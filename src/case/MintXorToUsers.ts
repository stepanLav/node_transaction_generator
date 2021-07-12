import { KnownAssets, KnownSymbols } from "@sora-substrate/util";
import { BaseConnection } from "../database/BaseConnection";
import { PolkaswapUser } from "../database/entity/PolkaswapUser";
import { LoadUser } from "../userInteraction/LoadUser";
import { createArrayOfTransactions, createKeyringFromMnemonic } from '../utils/usefullFunctions'
import { AssetList, Balances } from "../database";

class MintXorToUsers {
    public async execute(loadUser: LoadUser): Promise<void> {
        const database = BaseConnection.getInstance()
        return new Promise(async (finish, _reject) => {

            const asset = KnownAssets.get(KnownSymbols.XOR)
            const amount = "100000000000000000000"

            console.time('Mint token processing')
            while (loadUser.iterations > 0) {
                loadUser.iterations-=1
                await mintAssetToDBUser()
                console.timeLog('Mint token processing', `Was completed iteration ${loadUser.iterations}`)
            }
            console.log('finish')
            finish()

            async function mintAssetToDBUser() {

                const userRepo = database.connection.getRepository(PolkaswapUser)
                const users = await userRepo
                    .createQueryBuilder("user")
                    .leftJoinAndSelect("user.balances", "balances")
                    .leftJoinAndSelect("balances.asset", "asset_list")
                    .where("user.has_money = false")
                    .limit(1000)
                    .getMany();

                const mnemonic = 'era actor pluck voice frost club gallery palm moment empower whale flame'
                const sudo = createKeyringFromMnemonic('sr25519', mnemonic)

                const faucetTxArray = createArrayOfTransactions(
                    users,
                    loadUser.api.api.tx.faucet.transfer,
                    loadUser.api.api.tx.utility.batch,
                    asset.address, 'address', amount
                )
                for (let sendBatch of faucetTxArray) {
                    await loadUser.api.submitExtrinsic(sendBatch, sudo)
                }
                const manager = database.connection.manager
                let assetElement = new AssetList()
                assetElement.is_pool_token = false
                assetElement.name = asset.name
                assetElement.symbol = asset.symbol
                assetElement.token_address = asset.address
                assetElement.token_owner = (await loadUser.api.api.query.assets.assetOwners(asset.address)).toString()
                await manager.save(assetElement)
                let balances: any[] = []
                for (let user of users){
                    const balance = new Balances();
                    balance.balance = amount;
                    balance.asset = assetElement;
                    balance.user = user
                    user.has_money = true;
                    balances.push(balance);
                }
                let promises = users.map(update =>  {
                    delete update.balances
                    return manager.update(PolkaswapUser, update.user_id, update)
                })
                await Promise.all(promises);
                await manager.insert(Balances, balances);
            }

        })
    }
}

export default new MintXorToUsers()