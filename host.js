
const util     = require( 'util' );
const exec     = util.promisify( require( 'child_process' ).exec );
const logger   = require( './logger' );

module.exports = {

    /**
     * Note: this function assumes that there is at least one temperature sensor, and that it's a "cpu-thermal".  This
     * should be fine on Raspberry Pi and similar SBCs, but there's probably a smarter way to do this.
     */
    getCpuTemp: async function () {
        let temperature = 0;

        try {
            const { stdout } = await exec( 'cat /sys/class/thermal/thermal_zone0/temp' );
            if( temperature = parseInt( stdout ) )
                temperature /= 1000.0;
        }
        catch( e )
        {
            logger.error( e, 'Failed to read CPU temperature' );
        }

        return temperature;
    }
};