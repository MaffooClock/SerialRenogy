#!/usr/bin/env node

const platform = require( 'os' ).platform();

const Prometheus = require( 'prom-client' );
const Registry   = Prometheus.Registry;
const register   = new Registry();

const logger  = require( './logger' );

const cli     = require( './cli' );
const port    = cli.args.port;
const host    = cli.args.address;

const Host   = require( './host' );
const Renogy = require( './renogy' );
const { prometheusDataMap } = require( './prometheus' );
let renogyData, controllerInfo = null;

const path    = require( 'path' );
const express = require( 'express' );
const app     = express()


app.use( express.static( 'web' ) );

app.use( ( request, response, next ) => {
    logger.trace( `Received a request for '${request.url}'` );
    next();
});

app.get( '/', function ( request, response ) {
    logger.trace( 'Got a request for ' );
    response.sendFile( path.join( __dirname, '/web/index.html ') );
});

app.get( '/metrics', async function ( request, response ) {

    const metrics = await register.metrics();

    response.set( 'Content-type', register.contentType );
    response.status( 200 ).send( metrics );
});

app.get( '/metrics.json', async function ( request, response ) {
    response.set( 'Content-type', 'application/json' );
    response.status( 200 ).send( JSON.stringify( renogyData ) );
});

app.get( '/info.json', async function ( request, response ) {

    if( !controllerInfo )
        controllerInfo = await Renogy.getControllerInfo();

    response.set( 'Content-type', 'application/json' );
    response.status( 200 ).send( JSON.stringify( controllerInfo ) );
});

async function initRegister()
{
    Renogy.begin();

    logger.info( 'Preparing metrics...' );

    for( element in prometheusDataMap )
    {
        const thisMetric = new Prometheus.Gauge({
            name: prometheusDataMap[element].name,
            help: prometheusDataMap[element].help
        });

        register.registerMetric( thisMetric );

        logger.trace( `Added ${thisMetric.name}` )
    }
    
    logger.info( '...metrics ready.' )
}

async function readRenogyData()
{    
    try {
        renogyData = await Renogy.getData();

        for( const [ key, value ] of Object.entries( renogyData ) )
        {
            if( prometheusDataMap.hasOwnProperty( key ) )
                register.getSingleMetric( prometheusDataMap[key].name ).set( value );
        }
    }
    catch( e )
    {
        logger.warn( e, 'Failed to read data from Renogy device.  Exception:' )
    }
}

async function readHostData()
{
    const hostCpuTemp = await Host.getCpuTemp();

    if( hostCpuTemp )
        register.getSingleMetric( 'renogy_host_cpu_temp' ).set( hostCpuTemp );
}

app.listen( port, host, () => {

    initRegister();

    // We refresh the metrics register on a timed loop instead of per-request so that data is ready to go immediately when
    // requested, and also as a simple measure to reduce load for spammy requests that are repeated too frequently.
    setInterval( readRenogyData, 1000 );

    if( platform === 'linux' )
        setInterval( readHostData,   5000 );

    logger.info( `SerialRenogy is ready to service requests on http://${host}:${port}/` );
});
