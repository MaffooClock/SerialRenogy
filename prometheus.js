

exports.prometheusDataMap = {

    batteryCapacity: {
        name: 'renogy_battery_capacity',
        help: 'Battery Capacity (%)'
    },
    batteryVolts: {
        name: 'renogy_battery_voltage',
        help: 'Battery Voltage (V)'
    },
    batteryChargeCurrent: {
        name: 'renogy_battery_charge_current',
        help: 'Battery Charging Current (A)'
    },
    controllerTemp: {
        name: 'renogy_controller_temp',
        help: 'Controller Temperature (°C)'
    },
    batteryTemp: {
        name: 'renogy_battery_temp',
        help: 'Battery Temperature (°C)'
    },

    loadVolts: {
        name: 'renogy_load_voltage',
        help: 'Load Voltage (V)'
    },
    loadCurrent: {
        name: 'renogy_load_current',
        help: 'Load Current (A)'
    },
    loadPower: {
        name: 'renogy_load_power',
        help: 'Load Power (W)'
    },

    solarVolts: {
        name: 'renogy_solar_voltage',
        help: 'Solar Voltage (V)'
    },
    solarCurrent: {
        name: 'renogy_solar_current',
        help: 'Solar Current (A)'
    },
    solarPower: {
        name: 'renogy_solar_power',
        help: 'Solar Power (W)'
    },

    battVMinToday: {
        name: 'renogy_today_battery_voltage_min',
        help: 'Battery Voltage Minimum Today (V)'
    },
    battVMaxToday: {
        name: 'renogy_today_battery_voltage_max',
        help: 'Battery Voltage Maximum Today  (V)'
    },
    chgCMaxToday: {
        name:  'renogy_today_battery_charge_current_max',
        help: 'Charge Current Maximum Today (A)'
    },
    dischgCMaxToday: {
        name: 'renogy_today_battery_discharge_current_max',
        help: 'Discharge Current Maximum Today (A)'
    },
    chgPMaxToday: {
        name: 'renogy_today_battery_charge_power_max',
        help: 'Charge Power Maximum Today (W)'
    },
    dischgPMaxToday: {
        name: 'renogy_today_battery_discharge_power_max',
        help: 'Discharge Power Maximum Today'
    },
    chgAHToday: {
        name: 'renogy_today_charge_ah',
        help: 'Charge Amp-hours Today (Ah)'
    },
    dischgAHToday: {
        name: 'renogy_today_discharge_ah',
        help: 'Discharge Amp-hours Today (Ah)'
    },
    chgWHToday: {
        name: 'renogy_today_charge_wh',
        help: 'Charge Watt-hours Today (Wh)'
    },
    dischgWHToday: {
        name: 'renogy_today_discharge_wh',
        help: 'Discharge Watt-hours Today (Wh)'
    },

    uptime: {
        name: 'renogy_uptime_days',
        help: 'Uptime (Days)'
    },

    totalBattOverDischarges: {
        name: 'renogy_battery_overdischarge_count',
        help: 'Battery Overdischarge Count'
    },
    totalBattFullCharges: {
        name: 'renogy_battery_full_charge_count',
        help: 'Battery Full Charge Count'
    },
    totalChargeAH: {
        name: 'renogy_total_charge_ah',
        help: 'Total Charge Amp-hours (Ah)'
    },
    totalDischargeAH: {
        name: 'renogy_total_discharge_ah',
        help: 'Total Discharge Amp-hours (Ah)'
    },
    
    cumulativePowerGenerated: {
        name: 'renogy_total_power_generated',
        help: 'Total Power Generated (kWh)'
    },
    cumulativePowerConsumed: {
        name: 'renogy_total_power_consumed',
        help: 'Total Power Consumed (kWh)'
    },
    
    loadStatus: {
        name: 'renogy_load_status',
        help: 'Load Status'
    },
    chargingState: {
        name: 'renogy_charge_state',
        help: 'Charging Status'
    },

    fault: {
        name: 'renogy_fault_status',
        help: 'Indicates whether the controller is in fault status (0=OK)'
    }
};