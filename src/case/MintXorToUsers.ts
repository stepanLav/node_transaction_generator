import { KnownAssets, KnownSymbols } from "@sora-substrate/util";
import { BaseConnection } from "../database/BaseConnection";
import { PolkaswapUser } from "../database/entity/PolkaswapUser";
import { LoadUser } from "../userInteraction/LoadUser";
import { encodeAddress } from '@polkadot/keyring'
import { mnemonicGenerate, naclKeypairFromSeed, mnemonicToMiniSecret } from '@polkadot/util-crypto'
import { createArrayOfTransactions, createKeyringFromMnemonic } from '../utils/usefullFunctions'
import { AssetList, Balances } from "../database";

class MintXorToUsers {
    public async execute(user: LoadUser): Promise<void> {
        let i = 1
        const database = BaseConnection.getInstance()
        return new Promise(async (finish, _reject) => {
            while (i > 0) {
                i-=1

                const userRepo = database.connection.getRepository(PolkaswapUser)

                const users = await userRepo
                    .createQueryBuilder("user")
                    .leftJoinAndSelect("user.balances", "balances")
                    .leftJoinAndSelect("balances.assetId", "asset_list")
                    .where("user.hasMoney = false")
                    .limit(1000)
                    .getMany();

                const asset = KnownAssets.get(KnownSymbols.XOR)
                const amount = "100000000000000000000"
                const mnemonic = 'era actor pluck voice frost club gallery palm moment empower whale flame'
                const sudo = createKeyringFromMnemonic('sr25519', mnemonic)

                const faucetTxArray = createArrayOfTransactions(
                    users,
                    user.api.api.tx.faucet.transfer,
                    user.api.api.tx.utility.batch,
                    asset.address, 'address', amount
                )
                for (let sendBatch of faucetTxArray) {
                    await user.api.submitExtrinsic(sendBatch, sudo)
                }
                const manager = database.connection.manager
                let assetElement = new AssetList()
                assetElement.isPoolToken = false
                assetElement.name = asset.name
                assetElement.symbol = asset.symbol
                assetElement.tokenAddress = asset.address
                assetElement.tokenOwner = (await user.api.api.query.assets.assetOwners(asset.address)).toString()
                await manager.save(assetElement)
                let balances: any[] = []
                for (let user of users){
                    const balance = new Balances();
                    balance.balance = amount;
                    balance.assetId = assetElement;
                    user.hasMoney = true;
                    user.balances.push(balance);
                    balances.push(balance);
                    // await manager.save(balance);
                    await manager.save(user);
                }

            }
            console.log('finish')
            finish()
        })
    }
}

export default new MintXorToUsers()