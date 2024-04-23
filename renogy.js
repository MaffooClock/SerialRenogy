const cli          = require( './cli' );
const logger       = require( './logger' );
const ModbusRTU    = require( 'modbus-serial' );
const modbusClient = new ModbusRTU();

const dataStartRegister = 0x100;
const numDataRegisters = 35;
const infoStartRegister = 0x00A;
const numInfoRegisters = 17;

const args = cli.args;

// Not currently used; for future use... maybe.
const renogyFaultMap = [
    {
        // b0
        name: "reserved",
        description: "reserved",
        value: null
    },
    {
        // b1
        name: "reserved",
        description: "reserved",
        value: null
    },
    {
        // b2
        name: "reserved",
        description: "reserved",
        value: null
    },
    {
        // b3
        name: "reserved",
        description: "reserved",
        value: null
    },
    {
        // b4
        name: "reserved",
        description: "reserved",
        value: null
    },
    {
        // b5
        name: "reserved",
        description: "reserved",
        value: null
    },
    {
        // b6
        name: "reserved",
        description: "reserved",
        value: null
    },
    {
        // b7
        name: "reserved",
        description: "reserved",
        value: null
    },
    {
        // b8
        name: "reserved",
        description: "reserved",
        value: null
    },
    {
        // b9
        name: "reserved",
        description: "reserved",
        value: null
    },
    {
        // b10
        name: "reserved",
        description: "reserved",
        value: null
    },
    {
        // b11
        name: "reserved",
        description: "reserved",
        value: null
    },
    {
        // b12
        name: "reserved",
        description: "reserved",
        value: null
    },
    {
        // b13
        name: "reserved",
        description: "reserved",
        value: null
    },
    {
        // b14
        name: "reserved",
        description: "reserved",
        value: null
    },
    {
        // b15
        name: "reserved",
        description: "reserved",
        value: null
    },
    {
        // b16
        name: "batteryOverDischarge",
        description: "Battery over-discharge",
        value: false
    },
    {
        // b17
        name: "batteryOverVoltage",
        description: "Battery over-voltage",
        value: false
    },
    {
        // b18
        name: "batteryUnderVoltage",
        description: "Battery under-voltage warning",
        value: false
    },
    {
        // b19
        name: "loadShortCircuit",
        description: "Load short-circuit",
        value: false
    },
    {
        // b20
        name: "loadOverPower",
        description: "Load over-power or over-current",
        value: false
    },
    {
        // b21
        name: "highTempController",
        description: "Controller temperature too high",
        value: false
    },
    {
        // b22
        name: "highTempAmbient",
        description: "Ambient temperature too high",
        value: false
    },
    {
        // b23
        name: "solarInputOverPower",
        description: "Solar input over-power",
        value: false
    },
    {
        // b24
        name: "solarInputShort",
        description: "Solar input short-circuit",
        value: false
    },
    {
        // b25
        name: "solarInputOverVoltage",
        description: "Solar input over-voltage",
        value: false
    },
    {
        // b26
        name: "solarPanelCounterCurrent",
        description: "Solar panel counter-current",
        value: false
    },
    {
        // b27
        name: "solarPanelWorkingPointHigh",
        description: "Solar panel working point over-voltage",
        value: false
    },
    {
        // b28
        name: "solarInputReversed",
        description: "Solar input reverse-wired",
        value: false
    },
    {
        // b29
        name: "mosShortAntiReverse",
        description: "MOS anti-reverse shorted",
        value: false
    },
    {
        // b30
        name: "mosShortChargeCircuit",
        description: "MOS charge circuit shorted",
        value: false
    },
    {
        // b31
        name: "reserved",
        description: "reserved",
        value: false
    }
];

const renogyValues = {

    setData: function( rawData )
    {
        //========== Battery ==========//

        // Register 0 (0x100) - Battery Capacity (%)
        this.batteryCapacity = rawData[0];

        // Register 1 (0x101) - Battery Voltage (V × 0.1)
        this.batteryVolts = ( rawData[1] * 0.1 );

        // Register 2 (0x102) - Battery Charging Current (A × 0.01)
        this.batteryChargeCurrent = ( rawData[2] * 0.01 );

        // Register 3 (0x103) - Battery/Controller Temperature (°C)
        // Two bytes: one for battery (on certain models) and one for controller
        const buf = Buffer.alloc( 2 )
        buf.writeInt16BE( rawData[3] );
        this.controllerTemp = buf[0];
        this.batteryTemp = buf[1];


        //========== Load ==========//

        // Register 4 (0x104) - Load Voltage (V × 0.1)
        this.loadVolts = ( rawData[4] * 0.1 );

        // Register 5 (0x105) - Load Current (A × 0.01)
        this.loadCurrent = ( rawData[5] * 0.01 );

        // Register 6 (0x106) - Load Power (W)
        this.loadPower = rawData[6];


        //========== Solar Panel ==========//

        // Register 7 (0x107) - Solar Panel Voltage (V × 0.1)
        this.solarVolts = ( rawData[7] * 0.1 );

        // Register 8 (0x108) - Solar Panel Current (W × 0.01)
        this.solarCurrent = ( rawData[8] * 0.01 );

        // Register 9 (0x109) - Solar Panel Power (W)
        this.solarPower = rawData[9];


        //========== Control ==========//

        // Register 10 (0x10A) - Turn on load (write register, 1=on, 0=off)
        // This utility is read-only


        //========== Min/Max/Totals ==========//

        // Register 11 (0x10B) - Min Battery Voltage Today (V × 0.1)
        this.battVMinToday = ( rawData[11] * 0.1 );

        // Register 12 (0x10C) - Min Battery Voltage Today (V × 0.1)
        this.battVMaxToday = ( rawData[12] * 0.1 );

        // Register 13 (0x10D) - Max Charge Current Today (A × 0.01)
        this.chgCMaxToday = ( rawData[13] * 0.01 );

        // Register 14 (0x10E) - Max Discharge Current Today (A × 0.01)
        this.dischgCMaxToday = ( rawData[14] * 0.01 );

        // Register 15 (0x10F) - Max Charge Power Today (W)
        this.chgPMaxToday = ( rawData[15] );

        // Register 16 (0x110) - Max Discharge Power Today (W)
        this.dischgPMaxToday = ( rawData[16] );

        // Register 17 (0x111) - Charge Amp-Hours Today (Ah)
        this.chgAHToday = ( rawData[17] );

        // Register 18 (0x112) - Discharge Amp-Hours Today (Ah)
        this.dischgAHToday = ( rawData[18] );

        // Register 19 (0x113) - Charge Watt-Hours Today (Wh)
        this.chgWHToday = ( rawData[19] );

        // Register 20 (0x114) - Discharge Watt-Hours Today (Wh)
        this.dischgWHToday = ( rawData[20] );


        //========== Historical Data ==========//

        // Register 21 (0x115) - Controller Uptime (Days)
        this.uptime = rawData[21];

        // Register 22 (0x116) - Total Battery Over-charges
        this.totalBattOverDischarges = rawData[22];

        // Register 23 (0x117) - Total Battery Full Charges
        this.totalBattFullCharges = rawData[23];

        // Registers 24 (0x118) and 25 (0x119) - Total Charging Amp-Hours (Ah)
        const bufTotAH = Buffer.alloc( 4 );
        bufTotAH.writeUInt16BE( rawData[24] );
        bufTotAH.writeUInt16BE( rawData[25], 2 );
        this.totalChargeAH = bufTotAH.readUInt32BE();

        // Registers 26 (0x11A) and 27 (0x11B) - Total Discharging Amp-Hours (Ah)
        const bufTotDisAH = Buffer.alloc( 4 );
        bufTotDisAH.writeUInt16BE( rawData[26] );
        bufTotDisAH.writeUInt16BE( rawData[27], 2 );
        this.totalDischargeAH = bufTotDisAH.readUInt32BE();
		
        // Registers 28 (0x11C) and 29 (0x11D) - Total Cumulative power generation (kWh)
        const bufTotWH = Buffer.alloc( 4 );
        bufTotWH.writeUInt16BE( rawData[28] );
        bufTotWH.writeUInt16BE( rawData[29], 2 );
        this.cumulativePowerGenerated = bufTotWH.readUInt32BE();

        // Registers 30 (0x11E) and 31 (0x11F) - Total Cumulative power consumption (kWh)
        const bufTotWHC = Buffer.alloc( 4 );
        bufTotWHC.writeUInt16BE( rawData[30] );
        bufTotWHC.writeUInt16BE( rawData[31], 2 );
        this.cumulativePowerConsumed = bufTotWHC.readUInt32BE();


        //========== Status ==========//

        // Register 32 (0x120) - Load Status, Load Brightness, Charging State
        // Two bytes: one for load status, and one for charging state
        const buf2 = Buffer.alloc( 2 );
        buf2.writeUInt16BE( rawData[32] );
        this.loadStatus = mirror_bits( buf2.readUInt8() );  // Seems the bits are completely inverted order?
        this.chargingState = buf2[1];

        /**
         * Load Status (b7 of 8 high bits):
         *   0 - off
         *   1 - on
         * 
         * Load Brightness (b0...b6 of 8 high bits)
         *   0-100%
         * 
         * Charge States (8 low bits):
         *   0x0 - inactive
         *   0x1 - activate
         *   0x2 - MPPT mode
         *   0x3 - equalizing mode
         *   0x4 - boost mode
         *   0x5 - floating mode
         *   0x6 - current limiting (overpower)
         */


        //========== Fault Information ==========//

        // Registers 33 (0x121) and 34 (0x122) - Controller fault codes
        // For now, let's just assert wither there is a fault (normal = 0x00000000)
        this.fault = Number( ( rawData[33] + rawData[34] ) > 0 );

        // TODO:
        // this.fault = decimalToBytes( rawData[33] ).concat( decimalToBytes( rawData[33] ) );

        /**
         * Fault Codes (0=okay, 1=fault):
         *   b0...b15 - reserved
         *   b16 - battery over-discharge
         *   b17 - battery over-voltage
         *   b18 - battery under-voltage warning
         *   b19 - load short-circuit
         *   b20 - load over-power or over-current
         *   b21 - controller temperature too high
         *   b22 - ambient temperature too high
         *   b23 - solar input over-power
         *   b24 - solar input short-circuit
         *   b25 - solar input over-voltage
         *   b26 - solar panel counter-current
         *   b27 - solar panel working point over-voltage
         *   b28 - solar panel input reverse polarity
         *   b29 - anti-reverse MOS short
         *   b30 - charge MOS short
         *   b31 - reserved
         */
    }
};

const controllerInfo = {

    setData: function( rawData )
    { 
        // Register 0 (0x00A) - Controller voltage (8 high bits) and current (8 low bits) rating
        const x0a = Buffer.alloc( 2 )
        x0a.writeInt16BE( rawData[0] );
        this.controllerV = x0a[0];
        this.controllerC = x0a[1];
        
        // Register 1 (0x00B) - Controller discharge current (8 high bits) and type (8 low bits)
        const x0b = Buffer.alloc( 2 )
        x0b.writeInt16BE( rawData[1] );
        this.controllerDischgC = x0b[0];
        this.controllerType = x0b[1] == 0 ? 'Controller' : 'Inverter';
        
        // Registers 2 (0x00C) to 9 (0x013) - Product Model String
        let modelString = '';
        for( let i = 0; i <= 7; i++ )
        {  
            rawData[i+2].toString( 16 ).match( /.{1,2}/g ).forEach( x => {
                modelString += String.fromCharCode( parseInt( x, 16 ) );
            });
        }
        this.controllerModel = modelString.replace( ' ','' ).trim();
        
        // Registers 10 (0x014) and 11 (0x015) - Software Version
        const x14 = Buffer.alloc( 4 );
        x14.writeInt16BE( rawData[10] );
        x14.writeInt16BE( rawData[11], 2 );
        this.softwareVersion = `V${x14[1]}.${x14[2]}.${x14[3]}`

        // Registers 12 (0x016) and 13 (0x017) - Hardware Version
        const x16 = Buffer.alloc( 4 );
        x16.writeInt16BE( rawData[12] );
        x16.writeInt16BE( rawData[13],2 );
        this.hardwareVersion = `V${x16[1]}.${x16[2]}.${x16[3]}`

        // Registers 14 (0x018) and 15 (0x019) - Product Serial Number
        let serialHex = rawData[14].toString( 16 );
        serialHex += rawData[15].toString( 16 );
        this.serialNumber = parseInt( serialHex, 16 );

        // Register 16 (0x01A) - Controller Modbus address
        this.controllerAddress = rawData[16];
    }
};

async function readController( startRegister, numRegisters )
{
    try {
        if( !modbusClient.isOpen )
            this.begin();

        if( modbusClient.isOpen )
        {
            let data =  await modbusClient.readHoldingRegisters( startRegister, numRegisters );
            if( data.data )
            {
                logger.trace( data.data, 'Raw data from controller:' );
                return data.data;
            }
        }
    }
    catch( e )
    {
        logger.error( e );
        process.exit( 1 );
    }
}

// Reverses the order of bits given an input integer
function mirror_bits( n )
{
    let t = n.toString( 2 ).split('' );
    let str_len = t.length;

    for( let i = 0; i < 8 - str_len; i++ )
        t.unshift( '0' );
    
    return parseInt( t.reverse().join( '' ), 2 );
}

// Convert a decimal bitmask into an array of bits
function decimalToBytes( value )
{
    let hex = ( '00000000' + value.toString( 2 ) ).slice( -8 );

    let bytes = [];
    for( let c = 0; c < hex.length; c++ )
        bytes.push( parseInt( hex.substr( c, 1 ), 16 ) );

    return bytes;
}

module.exports = {

    begin: async function()
    {
        logger.trace( 'Connecting to controller...' );

        try {
            modbusClient.setTimeout( 500 );
            await modbusClient.connectRTUBuffered( args.serialport, { baudRate: args.baudrate } );
            logger.info( 'Connected to controller!' );

            modbusClient.setID( args.device );
        }
        catch( e )
        {
            logger.error( e );
            process.exit( 1 );
        }
    },

    getData: async function()
    {
        logger.trace( 'Getting data from controller...' );

        const rawData = await readController( dataStartRegister, numDataRegisters );
        renogyValues.setData( rawData );
        
        // Make a copy of the data without the `setData` method
        const data = ( ({ setData, ...o }) => o )(renogyValues);
        
        return data;
    },

    getControllerInfo: async function()
    {
        logger.trace( 'Getting information about controller...' );

        const rawData = await readController( infoStartRegister, numInfoRegisters );
        controllerInfo.setData( rawData );
        
        // Make a copy of the data without the `setData` method
        const data = ( ({ setData, ...o }) => o )(controllerInfo);

        return data;
    }
}
