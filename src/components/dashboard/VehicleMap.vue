<template>
    <div>
        <div class="map-container">
            <gmap-map style="width: 100%; height: 500px; position: absolute; left:0; top:0"
                      :center="{lat: 13.8, lng: 100.54}"
                      :zoom="14"
                      ref="example"
            >
                <gmap-marker
                        :key="index"
                        v-for="(car, index) in cars"
                        :icon="{ url: 'https://chart.googleapis.com/chart?chst=d_simple_text_icon_below&chld=' + car.name + '|13|' + car.color + '|bus|24|' + car.color + '|000000'  }"
                        :position="car.position"
                        @position_changed="markerPositionChanged(car, $event)"
                        @click="centerMapToMarker(car.position)"
                ></gmap-marker>
                <!--:icon="{ url: 'https://chart.googleapis.com/chart?chst=d_bubble_icon_text_small&chld=bus|bb|' + car.name + '|FFFFFF|000000' }"-->
                <!--:icon="{ url: 'https://chart.googleapis.com/chart?chst=d_map_spin&chld=1.25|0|' + car.color + '|13|b|' + car.name.split(' ').join('|') }-->

                <!-- Markers for waypoints -->
                <gmap-marker
                    v-for="(marker, index) in wayPointMarkers"
                    :key="index"
                    :position="marker.position"
                    :icon="{ url: marker.icon }"
                    :clickable="true"
                    @mouseover="toggleInfoWindow(marker, index)"
                    @mouseout="toggleInfoWindow(marker, index)"
                >
                </gmap-marker>

                <gmap-polyline
                        v-for="(route, index) in routes"
                        :key="index"
                        :path="route.path"
                        :options="{geodesic:true, strokeColor: '#' + route.color}">
                </gmap-polyline>

                <gmap-info-window :options="infoOptions" :position="infoWindowPos" :opened="infoWinOpen" :content="infoContent" @closeclick="infoWinOpen=false"></gmap-info-window>

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
                wayPointMarkers: [],
                infoContent: '',
                infoWindowPos: {
                    lat: 0,
                    lng: 0
                },
                infoWinOpen: false,
                currentMidx: null,
                //optional: offset infowindow so it visually sits nicely on top of our marker
                infoOptions: {
                    pixelOffset: {
                        width: 0,
                        height: -10
                    }
                },
            }
        },
        watch: {
            cars: {
                // Handle when array of cars data is changed from parent component
                handler: function(val, oldVal) {
                    for (let i = 0; i < val.length; i++) {

                        //console.log('First val' + JSON.stringify(val[i]));
                        // Check if there is already location data loaded
                        if(val[i].data !== undefined) {

                            // If car tracking status is True, pan the map to that car
                            if (val[i].tracking) {
                                this.$refs.example.panTo(new google.maps.LatLng(val[i].position.lat, val[i].position.lng));
                            }

                            // Check if there's already a route object for this car
                            let routeIndex = this.routes.findIndex(r => r.id === val[i].id);
                            if (routeIndex >= 0) {

                                // Convert the latest point of this route into a waypoint
                                let currentPosition = this.routes[routeIndex].path[this.routes[routeIndex].path.length-1];
                                let currentTimestamp = this.routes[routeIndex].timestamp[this.routes[routeIndex].timestamp.length-1];
                                this.wayPointMarkers.push({
                                    id: val[i].id,
                                    position: { lat: currentPosition.lat, lng: currentPosition.lng },
                                    icon: 'https://chart.googleapis.com/chart?chst=d_map_spin&chld=0.25|0|' + val[i].color + '|12|_|',
                                    timestamp: currentTimestamp,
                                    color: val[i].color,
                                    carName: val[i].name,
                                });

                                // Push a new point to the route
                                this.routes[routeIndex].path.push({ lat: val[i].position.lat, lng: val[i].position.lng });
                                this.routes[routeIndex].timestamp.push(val[i].timestamp);

                            } else {
                                // Create a new route object for this car
                                let obj = {
                                    id: val[i].id,
                                    carName: val[i].name,
                                    path: [{ lat: val[i].position.lat, lng: val[i].position.lng }],
                                    color: val[i].color,
                                    timestamp: [val[i].timestamp],
                                };
                                console.log(`Creating new route object for car : ${obj.carName}`);
                                this.routes.push(obj);
                            }



                            //console.log(`position changed from ${oldVal[i].position.lat},${oldVal[i].position.lng} to ${val[i].position.lat},${val[i].position.lng}`);
                            // Push coordinates to route array to extend the car route
                            // Find the car index

                            /*
                            let routeExist = false;
                            for (let j = 0; j < this.routes.length; j++) {
                                if (val[i].id === this.routes[j].id) {
                                    //console.log('Route found!! for ID = ' + val[i].id);
                                    //console.log('Pushing ' + val[i].position.lat + ' ,' + val[i].position.lng + ' to this route');

                                    // Update route and add waypoint only if the position is updated
                                    let previousLocation = this.routes[j].path[this.routes[j].path.length - 1];
                                    if (previousLocation.lat !== val[i].position.lat || previousLocation.lng !== val[i].position.lng) {

                                        this.routes[j].path.push({ lat: val[i].position.lat, lng: val[i].position.lng });
                                        this.routes[j].timestamp.push(val[i].latestUpdate);
                                        routeExist = true;

                                        // Add waypoint marker to an array. The marker coordinates will be at marker's previous position (like leaving a trail)
                                        this.wayPointMarkers.push({
                                            id: val[i].id,
                                            //position: { lat: oldVal[i].position.lat, lng: oldVal[i].position.lng },
                                            position: { lat: previousLocation.lat, lng: previousLocation.lng },
                                            icon: 'https://chart.googleapis.com/chart?chst=d_map_spin&chld=0.25|0|' + val[i].color + '|12|_|',
                                            timestamp: this.routes[j].timestamp[this.routes[j].timestamp.length -2 ],
                                            color: val[i].color,
                                            carName: val[i].name,
                                        });
                                    }


                                }
                            }
                            if(!routeExist) {
                                let obj = {
                                    id: val[i].id,
                                    carName: val[i].name,
                                    path: [{ lat: val[i].position.lat, lng: val[i].position.lng }],
                                    color: val[i].color,
                                    timestamp: [val[i].latestUpdate],
                                };
                                console.log('Route does not exist yet');
                                console.log('Push ' + JSON.stringify(obj));
                                this.routes.push(obj);
                            }
                            */


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

            // Things to do when marker position is changed
            markerPositionChanged(car, event) {
                console.log('Waypointed add at ' + car.position.lat + ' ' + car.position.lng);
                // Add a waypoint marker
                this.wayPointMarkers.push({
                    id: car.id,
                    position: car.position,
                    enabled: true,
                });
            },

            // Pan to the clicked marker
            centerMapToMarker(position) {
                this.$refs.example.panTo(new google.maps.LatLng(position.lat, position.lng));
            },

            // Source: https://github.com/xkjyeah/vue-google-maps/blob/vue2/examples/infowindow.html
            toggleInfoWindow: function(marker, idx) {
                console.log(JSON.stringify(marker) + ' clicked');
                console.log('marker  ' + idx + ' clicked');
                this.infoWindowPos = marker.position;
                this.infoContent = `<div style="color: #${marker.color}">`
                this.infoContent += '<h4>' + marker.carName + '</h4>';
                this.infoContent += '<strong>Visited: ' + this.$moment(marker.timestamp).format('MMM D, YYYY HH:mm:ss') + '</strong>';
                this.infoContent += '</div>';
                //check if its the same marker that was selected if yes toggle
                if (this.currentMidx == idx) {
                    this.infoWinOpen = !this.infoWinOpen;
                }
                //if different marker set infowindow to open and reset current marker index
                else {
                    this.infoWinOpen = true;
                    this.currentMidx = idx;
                }
            }
        },

    }
</script>

<style>

</style>