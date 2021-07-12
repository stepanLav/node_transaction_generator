import { BaseConnection } from "../database/BaseConnection";
import { PolkaswapUser } from "../database/entity/PolkaswapUser";
import { LoadUser } from "../userInteraction/LoadUser";
import { encodeAddress } from '@polkadot/keyring'
import { mnemonicGenerate, naclKeypairFromSeed, mnemonicToMiniSecret } from '@polkadot/util-crypto'

class CreateUsers {
    public async execute(user: LoadUser): Promise<void> {
        const database = BaseConnection.getInstance()
        const crypto = require('get-random-values')
        return new Promise(async (finish, _reject) => {
            const userRepository = database.connection.getRepository(PolkaswapUser)
            console.time('User generation')

            while (user.iterations > 0) {
                const generatedByIteration = 1000
                const users = await createUser(generatedByIteration)
                await userRepository.save(users)
                console.timeLog('User generation', `Was completed iteration ${user.iterations}\n${generatedByIteration} users was generated!`)
                user.iterations -= 1
            }

            async function createUser(numberOfUsers: number): Promise<PolkaswapUser[]> {
                let users: PolkaswapUser[] = []
                let promises = []
                async function createU(): Promise<PolkaswapUser> {
                    return new Promise<PolkaswapUser>(async (resolve) => {
                        const db_user = new PolkaswapUser
                        const array = new Uint8Array(32)
                        crypto(array);
                        const { publicKey, secretKey } = naclKeypairFromSeed(array)
                        db_user.address = encodeAddress(publicKey, 69)
                        db_user.private_key = Buffer.from(secretKey)
                        db_user.public_key = Buffer.from(publicKey)
                        resolve(db_user)
                    })
                }
                while (numberOfUsers > 0) {
                    promises.push(createU())
                    numberOfUsers -= 1
                }
                await Promise.all(promises).then(values => {
                    for (let value of values) {
                        users.push(value)
                    }
                })
                return users
            }
            await new Promise((r) => setTimeout(r, 3000))
            console.log('finish')
            finish()
        })
    }
}

export default new CreateUsers()