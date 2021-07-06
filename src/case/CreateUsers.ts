import { KnownAssets, KnownSymbols } from "@sora-substrate/util";
import { BaseConnection } from "../database/BaseConnection";
import { PolkaswapUser } from "../database/entity/PolkaswapUser";
import { LoadUser } from "../userInteraction/LoadUser";
import { encodeAddress } from '@polkadot/keyring'
import { mnemonicGenerate, naclKeypairFromSeed, mnemonicToMiniSecret } from '@polkadot/util-crypto'
import { createArrayOfTransactions, createKeyringFromMnemonic } from '../utils/usefullFunctions'
import { AssetList, Balances } from "../database";

class CreateUsers {
    public async execute(user: LoadUser): Promise<void> {
        const database = BaseConnection.getInstance()
        return new Promise(async (finish, _reject) => {
            const userRepository = database.connection.getRepository(PolkaswapUser)
            console.time('User generation')
            while (user.iterations > 0) {
                const generatedByIteration = 1000
                const users = await createUser(generatedByIteration)
                await userRepository.save(users)
                console.timeLog('User generation', `Was completed iteration ${user.iterations}\n${generatedByIteration} users was generated!`)
                user.iterations-=1
            }

            async function createUser(numberOfUsers: number) {
                let users = []
                while (numberOfUsers > 0) {
                    numberOfUsers -= 1
                    const db_user = new PolkaswapUser
                    const mnemonic = mnemonicGenerate()
                    const seedAlice = mnemonicToMiniSecret(mnemonic);
                    const { publicKey, secretKey } = naclKeypairFromSeed(seedAlice)
                    const soraAddress = encodeAddress(publicKey, 69)
                    db_user.mnemonic = mnemonic
                    db_user.address = soraAddress
                    users.push(db_user)
                }
                return users
            }
            await new Promise((r)=> setTimeout(r, 3000))
            console.log('finish')
            finish()
        })
    }
}

export default new CreateUsers()