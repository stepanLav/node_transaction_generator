import { api } from "@sora-substrate/util";
import { AssetList } from "../database";
import { createKeyringThroughPair, makestring } from "../utils/usefullFunctions";
import { BaseConnection } from "../database/BaseConnection";
import { PolkaswapUser } from "../database/entity/PolkaswapUser";
import { LoadUser } from "../userInteraction/LoadUser";

class CreateCustomToken {
    public async execute(loadUser: LoadUser): Promise<void> {
        const database = BaseConnection.getInstance()
        return new Promise(async (finish, _reject) => {

            const totalSupply = '1000000000000000000000'
            console.time('Create token processing')

            while (loadUser.iterations > 0) {
                await createToken(99)
                console.timeLog('Create token processing', `iteration ${loadUser.iterations} was completed`)
                loadUser.iterations-=1
            }
            console.log('finish')
            finish()

            async function createToken(amountOfTokens: number) {
                const userRepo = database.connection.getRepository(PolkaswapUser)
                const manager = database.connection.manager
                const customAssetArray: AssetList[] = []

                const users = await userRepo
                    .createQueryBuilder("user")
                    .leftJoinAndSelect("user.balances", "balances")
                    .leftJoinAndSelect("balances.asset", "asset_list")
                    .where("user.has_custom_token = false")
                    .limit(amountOfTokens)
                    .getMany();

                let buildExtr = users.map(user => {
                    let symbol = makestring((Math.floor(Math.random() * 7) + 1), true)
                    let tokenName = makestring((Math.floor(Math.random() * 33) + 1))
                    const seed = Uint8Array.from(user.private_key)
                    const public_key = Uint8Array.from(user.public_key)
                    let keyring = createKeyringThroughPair('ed25519', public_key, seed )

                    let customAsset = new AssetList()
                    customAsset.token_owner = user.address
                    customAsset.name = tokenName
                    customAsset.symbol = symbol
                    customAsset.is_pool_token = false
                    customAssetArray.push(customAsset)
                    user.has_custom_token = true

                    let extr = api.api.tx.assets.register(symbol, tokenName, totalSupply, true)
                    return api.submitExtrinsic(extr, keyring)
                })

                await Promise.all(buildExtr)

                await new Promise((r) => setTimeout(r, 6000))

                const tokenList = (await (api.api.rpc as any).assets.listAssetInfos()).toJSON()

                tokenList.forEach((token: { obj: object; }) => {
                    customAssetArray.forEach(element => {
                        if(element.name == (token as any).name){
                            if(element.symbol == (token as any).symbol){
                                element.token_address = (token as any).asset_id
                            }
                        }
                    });
                });

                await manager.insert(AssetList, customAssetArray)
                let updateUser = users.map(update =>  {
                    delete update.balances
                    return manager.update(PolkaswapUser, update.user_id, update)
                })
                await Promise.all(updateUser);
            }
        })
    }
}

export default new CreateCustomToken()