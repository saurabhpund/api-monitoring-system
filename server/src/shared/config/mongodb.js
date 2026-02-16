import mongoose from "mongoose";
import { config } from "./index";
import logger from "./logger";

class MongoConnection {
    constructor(){
        this.connection = null;
    }

    /**
     * The function establishes a connection to MongoDB using Mongoose and logs connection events.
     * @returns {Promise<mongoose.Connection>}  The `connection()` function returns a MongoDB connection object after establishing a
     * connection to the MongoDB database using Mongoose. If a connection already exists, it returns
     * the existing connection without creating a new one. The function also sets up event listeners
     * for error and disconnection events on the MongoDB connection.
     */
    async connection(){
        try {
            if(this.connection){
                return this.connection;
            }

            await mongoose.connect(config.mongo.uri, {
                dbName: config.mongo.dbName
            })
            
            logger.info(`MongoDB connected: ${config.mongo.uri}`)

            this.connection.on("error", err =>{
                logger.error("MongoDB connection error",  err)
            })

            this.connection.on("disconnected", () =>{
                logger.error("MongoDB disconnected")
            })

            return this.connection;
        } catch (error) {
            logger.error("Failed to connect to MongoDB: ", error);
            throw error;
        }
    }
    
    /**
     * The `disconnect` function asynchronously disconnects from a MongoDB database using Mongoose and
     * logs the disconnection status.
     */
    async disconnect(){
        try {
            if(this.connection){
                await mongoose.disconnect();
                this.connection = null;
                logger.info("MongoDB disconnected")
            }
        } catch (error) {
            logger.error("Failed to disconnect to MongoDB: ", error);
            throw error;
        }
    }

    /**
     * The function `getConnection()` returns the connection object.
     * @returns {mongoose.Connection} The `connection` object is being returned.
     */
    getConnection(){
        return this.connection;
    }
}

export default MongoConnection;