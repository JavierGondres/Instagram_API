import { Collection, MongoClient } from "mongodb";
import { MongoMemoryServer } from "mongodb-memory-server";
import dotenv from "dotenv";
import { DBCollections } from "../../src/types/enum";
import { UserSessions, Users } from "../../src/types/identidades";
dotenv.config();

export class MongoDbTest {
   private static instance: MongoDbTest;
   private static mongoServer?: MongoMemoryServer;
   private static mongoClient?: MongoClient;
   public userCollection?: Collection<Users>;
   public userSessionCollection?: Collection<UserSessions>;

   static async getInstance(): Promise<MongoDbTest> {
      if (!MongoDbTest.instance) {
         MongoDbTest.instance = new MongoDbTest();
         await MongoDbTest.instance.initialize();
      }
      return MongoDbTest.instance;
   }

   private async initialize(): Promise<void> {
      // Iniciar el servidor de MongoDB en memoria
      const newPort = 8080;
      MongoDbTest.mongoServer = await MongoMemoryServer.create({
         instance: { port: newPort },
      });

      // Obtener la URI de conexión al servidor en memoria
      const uri = MongoDbTest.mongoServer.getUri();

      // Crear un cliente MongoClient y conectar al servidor en memoria
      MongoDbTest.mongoClient = new MongoClient(uri);

      // Conectar al servidor en memoria
      await MongoDbTest.mongoClient.connect();
      // Inicializar las colecciones
      this.userCollection = MongoDbTest.mongoClient
         .db()
         .collection(DBCollections.USERS) as Collection<Users>;
      this.userSessionCollection = MongoDbTest.mongoClient
         .db()
         .collection(DBCollections.USER_SESSIONS) as Collection<UserSessions>;
   }

   async clear(): Promise<void> {
      // Verificar si hay un cliente MongoClient conectado
      if (!MongoDbTest.mongoClient) {
         throw new Error("MongoClient is not initialized.");
      }

      try {
         // Obtener la lista de colecciones
         const collections = await MongoDbTest.mongoClient.db().collections();

         // Iterar sobre cada colección y eliminar todos los documentos
         for (const collection of collections) {
            await collection.deleteMany({});
         }

         console.log("Collections cleared successfully.");
      } catch (error) {
         console.error("Error clearing collections:", error);
         throw new Error("Failed to clear collections.");
      }
   }

   async stop(): Promise<void> {
      // Cerrar la conexión con el cliente MongoClient
      if (MongoDbTest.mongoClient) {
         await MongoDbTest.mongoClient.db().dropDatabase();
         await MongoDbTest.mongoClient.close();
      }

      // Detener el servidor de MongoDB en memoria
      if (MongoDbTest.mongoServer) {
         await MongoDbTest.mongoServer.stop();
      }
   }
}
