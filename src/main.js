import Vue from 'vue';
import VueResource from 'vue-resource';
import VueRouter from 'vue-router';
import App from './App.vue';
import { routes } from './routes';

Vue.use(VueResource);
Vue.use(VueRouter);

// Configure Vue Router
const router = new VueRouter({
    routes,
    mode: 'history',
});

// Configure Vue Resource to my Google Firebase Database
Vue.http.options.root = 'https://vuejs-http-d1017.firebaseio.com/';


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
