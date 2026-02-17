import { error } from "winston";
import { config } from "./index"
import logger from "./logger"
import amqp from "amqplib";

class RabbitMQConnection{
    constructor(){
        this.connection = null;
        this.channel = null;
        this.isConnecting = false;
    }

    async connect(){
        if(this.channel){
            return this.channel
        }

        if(this.isConnecting){
            await new Promis((resolve) =>{
                const checkInterval = setInterval(() =>{
                    if(!this.isConnecting){
                        clearInterval(checkInterval);
                        resolve();
                    }
                }, 1000)
            });
            this.channel;
        }

        try{
            this.isConnecting = true

            logger.info("Connecting to RabbitMQ", config.rabbitmq.url)
            this.connection = amqp.connect(config.rabbitmq.url);
            this.channel = (await this.connection).createChannel();

            //Creating key
            const dlName = `${config.rabbitmq.queue}.dlq`
            
            // Dl Queue
            (await this.channel).assertQueue(dlName, { durable : true });

            // Normal Queue
            (await this.channel).assertQueue(config.rabbitmq.queue, {
                durable: true,
                arguments: {
                    "x-dead-letter-exchange": "",
                    "x-dead-letter-routing-key": dlName
                }
            });

            logger.info("RabbitMQ Connected  Queue: ", config.rabbitmq.queue);

            (await this.connection).on("close", () =>{
                logger.warn("RabbitMQ connection close");
                this.channel = null;
                this.connection = null
            })

            (await this.connection).on("error", (error) =>{
                logger.warn("RabbitMQ connection error", error);
                this.channel = null;
                this.connection = null
            })


            this.isConnecting = false;
            return this.channel;
        }catch(err){
            this.isConnecting = false;
            logger.error("Failed to connect RabbitMQ", err);
            throw err;
        }
    }

    getChannel(){
        return this.channel;
    }

    getStatus(){
        if(!this.connect || !this.channel){
            return "disconnected";
        }

        if(this.connect.closing) return "closing";
        return "connected";
    }

    async close(){
        try {
            if(this.channel){
                (await this.channel).close();
                this.channel = null;
            }
    
            if(this.connection){
                (await this.connection).close();
                this.connection = null;
            }
        } catch (error) {
            logger.error("Error in closing RabbitMQ connection", error);
        }
    }

}

export default new RabbitMQConnection;