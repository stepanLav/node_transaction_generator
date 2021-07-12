import { KnownAssets, KnownSymbols } from "@sora-substrate/util";
import { BaseConnection } from "../database/BaseConnection";
import { PolkaswapUser, Balances } from "../database";
import { LoadUser } from "../userInteraction/LoadUser";
import { In } from "typeorm";

class CheckBalance {
    public async execute(loadUser: LoadUser): Promise<void> {
        const database = BaseConnection.getInstance()
        return new Promise(async (finish, _reject) => {
            while (loadUser.iterations > 0) {
                await checkBalance()
                loadUser.iterations-=1
            }

            async function checkBalance() {
                const dbConnection = database.connection
                const asset = KnownAssets.get(KnownSymbols.XOR)

                let users = await dbConnection.getRepository(PolkaswapUser)
                    .createQueryBuilder("user")
                    .leftJoinAndSelect("user.balances", "balances")
                    .leftJoinAndSelect("balances.asset", "asset_list")
                    .where("user.has_money = true")
                    .limit(1000)
                    .getMany();

                let currentBalance = users.map(user => {
                    return (loadUser.api.api.rpc as any).assets.freeBalance(user.address, asset.address)
                })

                await Promise.all(currentBalance).then(values => {
                    for (let i=0; i<values.length; i++) {
                        const convertedValue = values[i].unwrap().balance.toString()
                        const tokenBalance = users[i].balances.find(i => i.asset.token_address == asset.address)
                        tokenBalance.balance = convertedValue
                        if (convertedValue == 0){
                            users[i].has_money = false
                        }
                    }
                  })
                await dbConnection.manager.save(users)

            }
            console.log('finish')
            finish()
        })
    }
}

export default new CheckBalance()