const yargs = require( 'yargs' );

const argv = yargs
    .option( 'serialport', {
        alias:       's',
        description: 'Serial port your controller is connected to (e.g -s /dev/ttyUSB0)',
        type:        'string',
    })
    .option( 'baudrate', {
        alias:       'b',
        description: 'The baud rate to use for serial communications, defaults to 9600 (e.g -b 14400)',
        type:        'integer',
        default:     9600
    })
    .option( 'address', {
        alias:       'a',
        description: 'The local address on which to serve HTTP requests',
        type:        'string',
        default:     'localhost'
    })
    .option( 'port', {
        alias:       'p',
        description: 'The TCP port on which to publish the Prometheus metrics',
        type:        'integer',
        default:     9090
    })
    .option( 'loglevel', {
        alias:       'l',
        description: 'Logging level to use, values are trace, debug, info, warn, error, fatal. Defaults to error',
        type:        'string',
        default:     'info'
    })
    .choices( 'loglevel', [ 'trace', 'debug', 'info', 'warn', 'error', 'fatal' ] )
    .help()
    .alias( 'help', 'h' )
    .epilogue( 'For more information, check out the project repository at https://github.com/MaffooClock/SerialRenogy' )
    .env( 'SR' )
    .demandOption( 'serialport', 'Serial port not specified' )
    .wrap( yargs.terminalWidth() )
    .argv;

module.exports = {
    args: argv
};
