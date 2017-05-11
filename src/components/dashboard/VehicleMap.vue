<template>
    <div>
        <div class="map-container">
            <gmap-map style="width: 100%; height: 100%; position: absolute; left:0; top:0"
                      :center="{lat: 13.8, lng: 100.54}"
                      :zoom="10"
                      ref="example"
            >
                <gmap-marker
                        :key="index"
                        v-for="(car, index) in cars"
                        :icon="{ url: 'https://chart.googleapis.com/chart?chst=d_simple_text_icon_below&chld=' + car.name + '|13|' + car.color + '|bus|24|' + car.color + '|000000'  }"
                        :position="car.position"
                        @position_changed="updateChild(car, 'position', $event)"
                ></gmap-marker>
                <!--:icon="{ url: 'https://chart.googleapis.com/chart?chst=d_bubble_icon_text_small&chld=bus|bb|' + car.name + '|FFFFFF|000000' }"-->
                <!--:icon="{ url: 'https://chart.googleapis.com/chart?chst=d_map_spin&chld=1.25|0|' + car.color + '|13|b|' + car.name.split(' ').join('|') }-->

                <gmap-polyline
                        v-for="(route, index) in routes"
                        :key="index"
                        :path="route.path"
                        :options="{geodesic:true, strokeColor: '#' + route.color}">
                </gmap-polyline>

            </gmap-map>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            cars: Array,
        },
        data() {
            return {
                paths: [
                    [ {lat: 37.772, lng: -122.214} ],
                    [ {lat: 21.291, lng: -157.821} ],
                ],
                routes: [],
            }
        },
        watch: {
            cars: {
                // Handle when array of cars data is changed from parent component
                handler: function(val, oldVal) {
                    for (let i = 0; i < val.length; i++) {
                        //console.log(`position changed from ${oldVal[i].position.lat},${oldVal[i].position.lng} to ${val[i].position.lat},${val[i].position.lng}`);
                        // Push coordinates to route array to extend the car route
                        // Find the car index
//
                        let routeExist = false;
                        for (let j = 0; j < this.routes.length; j++) {
                            if (val[i].id === this.routes[j].id) {
                                console.log('Route found!! for ID = ' + val[i].id);
                                console.log('Pushing ' + val[i].position.lat + ' ,' + val[i].position.lng + ' to this route');
                                this.routes[j].path.push({ lat: val[i].position.lat, lng: val[i].position.lng });
                                routeExist = true;
                            }
                        }
                        if(!routeExist) {
                            let obj = {
                                id: val[i].id,
                                path: [{ lat: val[i].position.lat, lng: val[i].position.lng }],
                                color: val[i].color,
                            };
                            console.log('Route does not exist yet');
                            console.log('Push ' + JSON.stringify(obj));
                            this.routes.push(obj);
                        }
//                        console.log('Find ' + JSON.stringify(carRoute));
                        //let carRoute = _.where(this.routes, { id: val[i].id });
                        // If the route with this car ID is already in the array, push the new car position to its route
//                        if (carRoute) {
//                            //console.log('Updating route for car ' + val[i].id);
//                            carRoute.path.push({ lat: val[i].position.lat, lng: val[i].position.lng });
//                        }
//                        // If this is the first car data, push the route data into the routes array
//                        else {
//                            console.log('New route will be created for car ' + val[i].id);
//                            let obj = {
//                                id: val[i].id,
//                                path: [{ lat: val[i].position.lat, lng: val[i].position.lng }],
//                            };
//                            console.log('Push ' + JSON.stringify(obj));
//                            this.routes.push({
//                                id: val[i].id,
//                                path: [{ lat: val[i].lat, lng: val[i].lng }],
//                            });
//                        }
                    }

                },
                deep: true,
            },
        },
        created() {

        },
        mounted() {
            var vm = this;
            setTimeout(function() {
                vm.$refs.example.resizePreserveCenter();
                console.log('hahahah');
            }, 1000);

        },
        methods: {
            updateChild(object, field, event) {
                console.log('marker moved');
                if (field === 'position') {
//                    object.position = {
//                        lat: event.lat(),
//                        lng: event.lng(),
//                    };
//                    console.log('New lat/lng = ' + event.lat() + ',' + event.lng());
                }
            },
        },

    }
</script>

<style>

</style>