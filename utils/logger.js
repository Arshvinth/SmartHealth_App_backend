import winston from 'winston';

const logger = winston.createLogger({
  level: 'info', // minimum level to log
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(
      info => `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message}`
    )
  ),
  transports: [
    new winston.transports.Console(),                  // logs to terminal
    new winston.transports.File({ filename: 'error.log', level: 'error' }), // logs errors to file
    new winston.transports.File({ filename: 'combined.log' })               // logs everything to file
  ]
});

export default logger;
