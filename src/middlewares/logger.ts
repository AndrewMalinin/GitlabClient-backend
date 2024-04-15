import winston from 'winston';

import path from 'path';

// if ( !fs.existsSync( 'logs' ) ) {
//    // Create the directory if it does not exist
//    fs.mkdirSync( 'logs' );
// }

export const logger = winston.createLogger({
   level: 'debug',
   transports: [new winston.transports.File({filename: path.join(__dirname, 'logs', 'request.log')})],
   format: winston.format.json(),
});

// export const requestLogger = logger({
//    transports: [new _transports.File({filename: './logs/request.log'})],
//    format: _format.json(),
// });

// // логгер ошибок
// export const errorLogger = _errorLogger({
//    transports: [new _transports.File({filename: './logs/error.log'})],
//    format: _format.json(),
// });
