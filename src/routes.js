/**
 * Created by thana on 5/10/2017.
 */

import Dashboard from './Dashboard.vue';
import Driver from './components/config/drivers/Driver.vue';
import AllDrivers from './components/config/drivers/AllDrivers.vue';
import CarForm from './components/config/cars/CarForm.vue';
import DriverForm from './components/config/drivers/DriverForm.vue';

export const routes = [
    { path: '', name: 'dashboard', component: Dashboard },
    { path: '/drivers', component: Driver , children: [
        { path: '', component: AllDrivers, name: 'allDrivers' },
        { path: 'add', component: DriverForm, name: 'newDriver'},
        { path: ':id/edit', component: DriverForm, name: 'editDriver', props: true },
    ]},
    { path: '*', redirect: { name: 'dashboard' }},
];