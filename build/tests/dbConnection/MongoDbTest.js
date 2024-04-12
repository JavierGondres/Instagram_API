var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { MongoClient } from "mongodb";
import { MongoMemoryServer } from "mongodb-memory-server";
export class MongoDbTest {
    /**
     * Inicializa el servidor de MongoDB en memoria y establece una conexión con él.
     * @param options Opciones adicionales para la conexión de MongoClient.
     */
    static start(options) {
        return __awaiter(this, void 0, void 0, function* () {
            // Iniciar el servidor de MongoDB en memoria
            this.mongoServer = yield MongoMemoryServer.create();
            // Obtener la URI de conexión al servidor en memoria
            const uri = this.mongoServer.getUri();
            // Crear un cliente MongoClient y conectar al servidor en memoria
            this.mongoClient = new MongoClient(uri, options);
            // Conectar al servidor en memoria
            yield this.mongoClient.connect();
            return this.mongoClient;
        });
    }
    static clear() {
        return __awaiter(this, void 0, void 0, function* () {
            // Verificar si hay un cliente MongoClient conectado
            if (!this.mongoClient) {
                throw new Error("MongoClient is not initialized. Please call start() before clearing collections.");
            }
            try {
                // Obtener la lista de colecciones
                const collections = yield this.mongoClient.db().collections();
                // Iterar sobre cada colección y eliminar todos los documentos
                for (const collection of collections) {
                    yield collection.deleteMany({});
                }
                console.log("Collections cleared successfully.");
            }
            catch (error) {
                console.error("Error clearing collections:", error);
                throw new Error("Failed to clear collections.");
            }
        });
    }
    /**
     * Detiene el servidor de MongoDB en memoria y cierra la conexión.
     */
    static stop() {
        return __awaiter(this, void 0, void 0, function* () {
            // Cerrar la conexión con el cliente MongoClient
            if (this.mongoClient) {
                yield this.mongoClient.db().dropDatabase();
                yield this.mongoClient.close();
            }
            // Detener el servidor de MongoDB en memoria
            if (this.mongoServer) {
                yield this.mongoServer.stop();
            }
        });
    }
    /**
     * Obtiene una referencia a la base de datos de prueba.
     * @param dbName Nombre de la base de datos.
     * @returns Referencia a la base de datos.
     */
    static getDb(dbName) {
        if (!this.mongoClient) {
            throw new Error("MongoClient is not initialized. Please call start() before accessing the database.");
        }
        return this.mongoClient.db(dbName);
    }
}
