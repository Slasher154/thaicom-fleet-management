<template>
    <div>
        <div class="map-container">
            <gmap-map style="width: 100%; height: 500px; position: absolute; left:0; top:0"
                      :center="{lat: 13.8, lng: 100.54}"
                      :zoom="14"
                      ref="tripMap"
            >
                <!--<gmap-marker
                        :key="index"
                        v-for="(car, index) in cars"
                        :icon="{ url: 'https://chart.googleapis.com/chart?chst=d_simple_text_icon_below&chld=' + car.name + '|13|' + car.color + '|bus|24|' + car.color + '|000000'  }"
                        :position="car.position"
                        @position_changed="markerPositionChanged(car, $event)"
                        @click="centerMapToMarker(car.position)"
                ></gmap-marker>
                &lt;!&ndash;:icon="{ url: 'https://chart.googleapis.com/chart?chst=d_bubble_icon_text_small&chld=bus|bb|' + car.name + '|FFFFFF|000000' }"&ndash;&gt;
                &lt;!&ndash;:icon="{ url: 'https://chart.googleapis.com/chart?chst=d_map_spin&chld=1.25|0|' + car.color + '|13|b|' + car.name.split(' ').join('|') }&ndash;&gt;

                &lt;!&ndash; Markers for waypoints &ndash;&gt;
                -->
                <gmap-marker
                        v-for="(marker, index) in markers"
                        :key="index"
                        :position="marker.position"
                        :icon="{ url: markerIconUrl }"
                        @mouseover="toggleInfoWindow(marker, index)"
                        @mouseout="toggleInfoWindow(marker, index)"
                >
                </gmap-marker>

                <gmap-marker v-if="markers.length > 0"
                    :position="startMarker.position"
                    :icon="{ url: startMarkerIconUrl }"
                    :zIndex="999"
                ></gmap-marker>

                <gmap-marker v-if="markers.length > 0"
                        :position="stopMarker.position"
                        :icon="{ url: stopMarkerIconUrl }"
                         :zIndex="999"
                ></gmap-marker>

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
            routes: Array,
            markers: Array,
        },
        data() {
            return {
                infoContent: '',
                infoWindowPos: {
                    lat: 0,
                    lng: 0
                },
                markerIconUrl: 'https://chart.googleapis.com/chart?chst=d_map_spin&chld=0.25|0|E74C3C|12|_|',
                startMarkerIconUrl: 'https://chart.googleapis.com/chart?chst=d_bubble_text_small&chld=bbT|Start|F39C12|000000',
                stopMarkerIconUrl: 'https://chart.googleapis.com/chart?chst=d_bubble_text_small&chld=bbT|Stop|F39C12|000000',
                infoWinOpen: false,
                currentMidx: null,
                //optional: offset infowindow so it visually sits nicely on top of our marker
                infoOptions: {
                    pixelOffset: {
                        width: 0,
                        height: -10
                    }
                },
                startMarker: {
                    position: {
                        lat: 0,
                        lng: 0,
                    }
                },
                stopMarker: {
                    position: {
                        lat: 0,
                        lng: 0,
                    }
                }
            }
        },
        computed: {

        },
        watch: {
            markers: {
                handler: function(val, oldVal) {
                    console.log('Markers changed!!!!');

                    if (val.length === 0) {
                        alert('Cannot query the route for this trip.');
                    }

                    else {
                        // Set the position of start and stop marker to show the start/stop points on map
                        this.startMarker.position = {
                            lat: val[0].position.lat,
                            lng: val[0].position.lng
                        };
                        this.stopMarker.position = {
                            lat: val[val.length-1].position.lat,
                            lng: val[val.length-1].position.lng,
                        };

                        // Create a LatLngBounds to cover all markers so we can automatically pan to the our route
                        var bounds = new google.maps.LatLngBounds();
                        val.forEach(m => {
                            bounds.extend(new google.maps.LatLng(m.position.lat, m.position.lng));
                        })
                        this.$refs.tripMap.fitBounds(bounds);

                    }

                },
                deep: true,
            }
        },
        created() {

        },
        mounted() {
            var vm = this;
            setTimeout(function() {
                vm.$refs.tripMap.resizePreserveCenter();
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

            // Pan to the clicked marker
            centerMapToMarker(position) {
                this.$refs.tripMap.panTo(new google.maps.LatLng(position.lat, position.lng));
            },

            // Source: https://github.com/xkjyeah/vue-google-maps/blob/vue2/tripMaps/infowindow.html
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