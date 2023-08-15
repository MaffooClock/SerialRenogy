
const si    = require( 'systeminformation' );
const logger   = require( './logger' );

module.exports = {

    getCpuTemp: async function () {
        const temperature = await si.cpuTemperature();
        return temperature.main;
    }
};