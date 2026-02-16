import env from "dotenv"

env.config();

export const config = {
    node_env: process.env.NODE_ENV || "developement",
    port: parseInt(process.env.PORT || "5000"),

    mongo: {
        uri: process.env.MONGO_URI || "mongodb://localhost:27017/api_monitoring",
        dbName: process.env.MONGO_DB_NAME || "api_monitoring"
    },

    postgres:{
        host: process.env.PG_HOST || "localhost",
        port: parseInt(process.env.PG_PORT || "5432", 10),
        database: process.env.PG_DATABASE || 'api_monitoring',
        user: process.env.PG_USER || 'postgres',
        password: process.env.PG_PASSWORD || "postgres"
    },

       rabbitmq: {
        url: process.env.RABBITMQ_URL || 'amqp://localhost:5672',
        queue: process.env.RABBITMQ_QUEUE || 'api_hits',
        publisherConfirms: process.env.RABBITMQ_PUBLISHER_CONFIRMS === 'true' || false, // MSGS LOST 
        retryAttempts: parseInt(process.env.RABBITMQ_RETRY_ATTEMPTS || '3', 10),
        retryDelay: parseInt(process.env.RABBITMQ_RETRY_DELAY || '1000', 10),
    },

    jwt: {
        secret: process.env.JWT_SECRET || "YE_JWT_KA_SECRET_HAI_TUMHE_KYU_BATAU",
        expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    },

    // Rate Limit
    rateLimit: {
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
        maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '1000', 10), // 1000 req / 15 min per IP
    }

}

