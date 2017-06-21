/**
 * Created by thana on 5/10/2017.
 */

import Dashboard from './Dashboard.vue';
import Driver from './components/config/drivers/Driver.vue';
import AllDrivers from './components/config/drivers/AllDrivers.vue';
//import CarForm from './components/config/cars/CarForm.vue';
import DriverForm from './components/config/drivers/DriverForm.vue';
import Vehicle from './components/config/vehicles/Vehicle.vue';
import VehicleForm from './components/config/vehicles/VehicleForm.vue';
import AllVehicles from './components/config/vehicles/AllVehicles.vue';
import ObdiiDevice from './components/config/obdiiDevices/ObdiiDevice.vue';
import ObdiiDeviceForm from './components/config/obdiiDevices/ObdiiDeviceForm.vue';
import AllObdiiDevices from './components/config/obdiiDevices/AllObdiiDevices.vue';
import ShowTrip from './components/trip/ShowTrip.vue';
import SystemConfig from './components/config/system/SystemConfig.vue';
import Report from './components/report/Report.vue';

export const routes = [
    { path: '', name: 'dashboard', component: Dashboard },
    { path: '/drivers', component: Driver , children: [
        { path: '', component: AllDrivers, name: 'allDrivers' },
        { path: 'add', component: DriverForm, name: 'newDriver'},
        { path: ':id/edit', component: DriverForm, name: 'editDriver', props: true },
    ]},
    { path: '/vehicles', component: Vehicle , children: [
        { path: '', component: AllVehicles, name: 'allVehicles' },
        { path: 'add', component: VehicleForm, name: 'newVehicle'},
        { path: ':id/edit', component: VehicleForm, name: 'editVehicle', props: true },
    ]},
    { path: '/obdiiDevices', component: ObdiiDevice, children: [
        { path: '', component: AllObdiiDevices, name: 'allObdiiDevices' },
        { path: 'add', component: ObdiiDeviceForm, name: 'newObdiiDevice'},
        { path: ':id/edit', component: ObdiiDeviceForm, name: 'editObdiiDevice', props: true },
    ]},
    {
      path: '/trip', component: ShowTrip, name: 'showTrip'
    },
    { path: '/config', component: SystemConfig, name: 'updateSystemConfig' },
    { path: '/report', component: Report, name: 'viewReport' },
    { path: '*', redirect: { name: 'dashboard' }},
];