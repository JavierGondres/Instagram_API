import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";
dotenv.config();
const uri = process.env.CONNECTION_STRING || "";
export class MongoSingleton {
    //Si a un no se ha conectado a mongo, se conecta, sino devuelve mongoClient que ya esta conectado
    static isInitialized() {
        return this.mongoClient !== undefined;
    }
    static getClient() {
        if (this.isInitialized())
            return this.mongoClient;
        console.log('initiliaze');
        // Initialize the connection.
        this.mongoClient = new MongoClient(uri, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            },
        });
        return this.mongoClient;
    }
}
