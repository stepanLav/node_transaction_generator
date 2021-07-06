import "reflect-metadata";
import { Connection, createConnection } from "typeorm";

export class BaseConnection {

    public connection: Connection

    private constructor() {
    }

    private static instance: BaseConnection;

    public static getInstance(): BaseConnection {
        if (!BaseConnection.instance) {
            BaseConnection.instance = new BaseConnection();
        }

        return BaseConnection.instance;
    }

    public async createCon() {
        this.connection = await createConnection()
    }
}