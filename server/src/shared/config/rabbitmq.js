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

            this.isConnecting = false;
        }catch(err){
            
        }
    }

}