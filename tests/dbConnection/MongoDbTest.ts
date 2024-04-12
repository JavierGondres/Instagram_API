import { MongoClient, MongoClientOptions } from "mongodb";
import { MongoMemoryServer } from "mongodb-memory-server";

export class MongoDbTest {
   private static mongoServer?: MongoMemoryServer;
   private static mongoClient?: MongoClient;

   /**
    * Inicializa el servidor de MongoDB en memoria y establece una conexión con él.
    * @param options Opciones adicionales para la conexión de MongoClient.
    */
   static async start(options?: MongoClientOptions): Promise<MongoClient> {
      // Iniciar el servidor de MongoDB en memoria
      this.mongoServer = await MongoMemoryServer.create();

      // Obtener la URI de conexión al servidor en memoria
      const uri = this.mongoServer.getUri();

      // Crear un cliente MongoClient y conectar al servidor en memoria
      this.mongoClient = new MongoClient(uri, options);

      // Conectar al servidor en memoria
      await this.mongoClient.connect();

      return this.mongoClient;
   }

   static async clear(): Promise<void> {
      // Verificar si hay un cliente MongoClient conectado
      if (!this.mongoClient) {
         throw new Error(
            "MongoClient is not initialized. Please call start() before clearing collections."
         );
      }

      try {
         // Obtener la lista de colecciones
         const collections = await this.mongoClient.db().collections();

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

   /**
    * Detiene el servidor de MongoDB en memoria y cierra la conexión.
    */
   static async stop(): Promise<void> {
      // Cerrar la conexión con el cliente MongoClient
      if (this.mongoClient) {
         await this.mongoClient.db().dropDatabase();
         await this.mongoClient.close();
      }

      // Detener el servidor de MongoDB en memoria
      if (this.mongoServer) {
         await this.mongoServer.stop();
      }
   }

   /**
    * Obtiene una referencia a la base de datos de prueba.
    * @param dbName Nombre de la base de datos.
    * @returns Referencia a la base de datos.
    */
   static getDb(dbName: string): any {
      if (!this.mongoClient) {
         throw new Error(
            "MongoClient is not initialized. Please call start() before accessing the database."
         );
      }

      return this.mongoClient.db(dbName);
   }
}
