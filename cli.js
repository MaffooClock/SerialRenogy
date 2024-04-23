
require( 'dotenv' ).config();
const yargs = require( 'yargs' );

const argv = yargs

    .option( 'serialport', {
        alias:       's',
        description: 'Serial port your controller is connected to (e.g -s /dev/ttyUSB0)',
        type:        'string',
    })
    .option( 'baudrate', {
        alias:       'b',
        description: 'The baud rate to use for serial communications',
        type:        'integer',
        default:     9600
    })
    .option( 'device', {
        alias:       'd',
        description: 'The device ID (valid from 1 to 247)',
        type:        'integer',
        default:     1
    })
    .option( 'address', {
        alias:       'a',
        description: 'The local address on which to serve HTTP requests',
        type:        'string',
        default:     'localhost'
    })
    .option( 'tcpport', {
        alias:       'p',
        description: 'The TCP port on which to publish the Prometheus metrics',
        type:        'integer',
        default:     9090
    })
    .option( 'loglevel', {
        alias:       'l',
        description: 'Logging level to use',
        type:        'string',
        default:     'info'
    }).choices( 'loglevel', [ 'trace', 'debug', 'info', 'warn', 'error', 'fatal' ] )

    .help().alias( 'help', 'h' )

    .version().alias( 'version', 'v' )

    .epilogue( 'Environment variables set as SR_{OPTION} will be used to set options.  They can also be set in:' )
    .epilogue( `    ${__dirname}/.env` )
    .epilogue( '' )
    .epilogue( 'For more information, see https://github.com/MaffooClock/SerialRenogy' )

    .env( 'SR' )

    .demandOption( 'serialport', 'Serial port not specified' )

    .wrap( Math.min( yargs.terminalWidth(), 120 ) )

    .argv;

module.exports = {
    args: argv
};
