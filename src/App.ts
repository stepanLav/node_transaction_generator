// import "reflect-metadata"
import loadGenerator from './userInteraction/LoadUserGenerator'
import scenario from './case/CreateUsers'
import { LoadUser } from './userInteraction/LoadUser'
import * as Parallel from 'async-parallel'
import { BaseConnection } from './database/BaseConnection'
import * as property from '../local.properties.json'

const url = process.env.URL || property.DEV.url
const userCount = 1
const userIterations = 100

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