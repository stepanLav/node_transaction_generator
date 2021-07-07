import { api, KnownAssets, KnownSymbols } from "@sora-substrate/util";
import { BaseConnection } from "../database/BaseConnection";
import { PolkaswapUser } from "../database/entity/PolkaswapUser";
import { LoadUser } from "../userInteraction/LoadUser";
import { PromiseResult } from "@polkadot/api/types"

class CheckBalance {
    public async execute(loadUser: LoadUser): Promise<void> {
        const database = BaseConnection.getInstance()
        return new Promise(async (finish, _reject) => {
            while (loadUser.iterations > 0) {
                await checkBalance()
                loadUser.iterations-=1
            }

            async function checkBalance() {
                const userRepo = database.connection.getRepository(PolkaswapUser)
                const manager = database.connection.manager

                const users = await userRepo
                    .createQueryBuilder("user")
                    .leftJoinAndSelect("user.balances", "balances")
                    .leftJoinAndSelect("balances.assetId", "asset_list")
                    .where("user.hasMoney = true")
                    .limit(1000)
                    .getMany();

                const asset = KnownAssets.get(KnownSymbols.XOR)

                for (let user of users){
                    const userBalance = await (api.api.rpc as any).assets.freeBalance(user.address, asset.address)
                    const compareBalance = userBalance.unwrap().balance.toString()
                }
                // let rpcExecute = users.map(user => {

                //     return (api.api.rpc as any).assets.freeBalance(user.address, asset.address)
                // })
                // let balances = await Promise.all[rpcExecute]
                // const compareBalances = balances.map(balance => {
                //     balance.unwrap().balance.toString()
                // })

            }
            console.log('finish')
            finish()
        })
    }
}

export default new CheckBalance()