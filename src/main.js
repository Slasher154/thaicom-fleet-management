import Vue from 'vue';
import VueResource from 'vue-resource';
import VueRouter from 'vue-router';
import App from './App.vue';
import VueNotifications from 'vue-notifications';
import miniToastr from 'mini-toastr';
import { routes } from './routes';

Vue.use(VueResource);
Vue.use(VueRouter);

// If using mini-toastr, provide additional configuration
const toastTypes = {
    success: 'success',
    error: 'error',
    info: 'info',
    warn: 'warn'
}

miniToastr.init({types: toastTypes})

// Here we setup messages output to `mini-toastr`
function toast ({title, message, type, timeout, cb}) {
    return miniToastr[type](message, title, timeout, cb)
}

// Binding for methods .success(), .error() and etc. You can specify and map your own methods here.
// Required to pipe our output to UI library (mini-toastr in example here)
// All not-specified events (types) would be piped to output in console.
const options = {
    success: toast,
    error: toast,
    info: toast,
    warn: toast
}

Vue.use(VueNotifications, options);

// Configure Vue Router
const router = new VueRouter({
    routes,
    mode: 'history',
});

// Configure Vue Resource to my Google Firebase Database
Vue.http.options.root = 'https://thaicom-fleet-management.firebaseio.com/';


// Configure Vue Momentjs
const moment = require('moment');
Vue.use(require('vue-moment'), {
    moment
});

// Configure Vue Google Maps
const VueGoogleMaps = require('vue2-google-maps');
Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyDthuAAkP9IYaN7Cr8M32fYk6-O_adwD2k',
      v: '3.27',
      libraries: 'places'
  }
});



new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
