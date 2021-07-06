import { LoadUser } from './LoadUser'

class LoadUserGenerator {
    public users: any = []

    public async generate(url: string, count: number, iterations: number): Promise<[LoadUser]>{

        while (count > 0) {
            await new Promise(async (resolve, _reject) =>{
                const user = new LoadUser(iterations)
                user.count = count
                await user.create(url, resolve)
            }).then(user => {
                this.users.push(user)
                console.log(`User ${(user as any).count} was created`)
            })
            count -= 1
        }
        return this.users
    }
}

export default new LoadUserGenerator()