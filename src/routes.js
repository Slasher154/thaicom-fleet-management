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
    { path: '*', redirect: { name: 'dashboard' }},
];