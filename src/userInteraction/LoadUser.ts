import { connection, Api } from '@sora-substrate/util'

export class LoadUser {

    public api: Api
    public count: Number
    private connection: any

    constructor(public iterations: number){}


    public async create(url: string, created: any) {
        this.api = new Api()
        this.api.initialize()
        await connection.open(url)
        console.log(`Hey, i\'m here user, my url is: ${url}`)
        return created(this)
    }

    public async closeConnection(): Promise<void>{
        return await this.connection.close()
    }
}