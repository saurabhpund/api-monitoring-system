import winston from "winston"
import {config} from "./index"

/**
 * Winston logger configuration
 * Provides logging
 */

const logger = winston.createLogger({
    level: winston.format.combine(
        winston.format.timestamp({format: "YYYY-MM-DD HH-MM-SS"}),
        winston.format.errors({stack : true}),
        winston.format.splat(),
        winston.format.json()
    ),
    defaultMeta: {service: "api-monitoring"},

    transports: [
        new winston.transports.File({filename: 'logs/error.log', level: 'errors'}),
        new winston.transports.File({filename: 'logs/combine.log',})
    ]
})

if(config.node_env != "production"){
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
        )
    }))
}

export default logger;