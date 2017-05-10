/**
 * Created by thana on 5/10/2017.
 */

import Dashboard from './Dashboard.vue'
import CarForm from './components/config/cars/CarForm.vue';
import DriverForm from './components/config/drivers/DriverForm.vue';

export const routes = [
    { path: '', name: 'dashboard', component: Dashboard },
    { path: '/cars', components: {

    }, children: [
        { path: 'add', component: CarForm, name: 'newCar'},
    ]},
    { path: '/drivers', components: {

    }, children: [
        { path: 'add', component: DriverForm, name: 'newDriver'},
    ]},
    { path: '*', redirect: { name: 'dashboard' }},
];