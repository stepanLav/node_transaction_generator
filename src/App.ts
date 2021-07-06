// import "reflect-metadata"
import loadGenerator from './userInteraction/LoadUserGenerator'
import scenario from './case/CreateUsers'
import { LoadUser } from './userInteraction/LoadUser'
import * as Parallel from 'async-parallel'
import { BaseConnection } from './database/BaseConnection'

const url = process.env.URL || 'wss://ws.framenode-1.s1.dev.sora2.soramitsu.co.jp/'
const userCount = 1
const userIterations = 10

class App {

    public async start(){
        const database = BaseConnection.getInstance()
        await database.createCon()
        const users = await this.createUsers()
        await this.executeScenario(users)
        await this.close(users)
    }
    public async createUsers(): Promise<[LoadUser]>{
        return await loadGenerator.generate(url, userCount, userIterations)
    }

    public async executeScenario(users: [LoadUser]){
        await Parallel.each(users, async value => {
            await scenario.execute(value)
        })
    }

    public async close(users: [LoadUser]): Promise<void>{
        for (let user of users){
            await user.closeConnection()
            console.log(`Connection from User: ${user.count} was closed`)
        }
        Promise.resolve()
    }
}

const app = new App()
app.start()