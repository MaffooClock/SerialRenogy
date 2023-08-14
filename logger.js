const logger = require( 'pino' );
const cli = require( './cli' );
const args = cli.args;

module.exports = logger({
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true
        }
    },
    minimumLevel: args.loglevel
});
