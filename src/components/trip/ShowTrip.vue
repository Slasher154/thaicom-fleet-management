<template>
    <div>
        <h1>Trips</h1>
        <hr>
        <br>
        <div class="row">
            <div class="col-sm-12 col-md-6">

                <!-- Start of car/no.of trip pickers -->
               <div class="row">
                   <div class="col-md-6 col-sm-12">
                       <h5>Select Vehicle</h5>
                       <select v-model="selectedVehicleId" class="form-control" @change="loadTrip">
                           <option value="">Select vehicle</option>
                           <option v-for="vehicle in vehicles" :value="vehicle.vid">{{ vehicle.name }}</option>
                       </select>
                       <br>
                   </div>
                   <div class="col-md-6 col-sm-12">
                       <h5>Number of trips to show:</h5>
                       <select v-model="tripsToShow" class="form-control" @change="loadTrip">
                           <option v-for="trip in tripOptions" :value="trip"> {{ trip }}</option>
                       </select>
                   </div>
               </div>
                <!-- End of car/no.of trip pickers -->

                <!-- Start of trip list table -->
                <h5>Trip List</h5>
                <!-- End of trip list table -->
                <p v-if="trips.length === 0">Please select vehicle to show trip list</p>
                <table class="table table-bordered" v-else>
                    <tr>
                        <th>Trip Name</th>
                        <th>Start time</th>
                        <th>Stop time</th>
                    </tr>
                    <tr v-for="trip in trips" @click="selectTrip(trip.index)" :class="{ highlight: trip.selected }">
                        <td>{{ trip.name }}</td>
                        <td>{{ trip.formattedStartTime }}</td>
                        <td>{{ trip.formattedStopTime }}</td>
                    </tr>
                </table>
            </div>

            <div class="col-sm-12 col-md-6">
                <app-trip-map
                    :routes="routes"
                    :markers="markers"
                ></app-trip-map>
            </div>
        </div>
    </div>
</template>

<script>
    import TripMap from './TripMap.vue';
    export default {
        components: {
          appTripMap: TripMap,
        },
        data() {
            return {
                tripsToShow: 3,
                tripOptions: [3, 10],
                vehicles: [],
                trips: [],
                routes: [],
                markers: [],
                selectedVehicleId: '',
                queryUrl: 'http://ubuntu@ec2-54-255-197-138.ap-southeast-1.compute.amazonaws.com',
            }
        },
        computed: {
            vehicleChoices() {
                return this.vehicles.map((v) => {
                    return {
                        label: v.name,
                        value: v.id,
                    };
                })
            },
        },
        methods: {
          loadTrip() {
              console.log(`${this.selectedVehicleId} , ${this.tripsToShow}`);
              if (this.selectedVehicleId === '') {
                  this.trips = [];
              }
              else {
                  // Call API to get new trips
                  this.$http.get(`${this.queryUrl}/listtrip?vid=${this.selectedVehicleId}&trip=${this.tripsToShow}`)
                      .then(response => {
                          return response.json();
                      }, error => {
                          alert(`There is an error while fetching the ${this.tripsToShow} trips of vid: ${this.selectedVehicleId}`);
                      })
                      .then(data => {
                          console.log(data);
                          // Check if return VID is correct
                          if (data.msg[0].vid !== this.selectedVehicleId) {
                              alert(`The return result VID doesn't match with the request`);
                              this.trips = [];
                          }
                          else {
                              let returnedTrips = data.msg[0].data[0];
                              let trips = [];
                              // The returned result from API uses trip name as a key
                              let count = 0;
                              for (let key in returnedTrips) {
                                  trips.push({
                                      name: key,
                                      index: count++,
                                      startTime: +returnedTrips[key][0],
                                      stopTime: +returnedTrips[key][1],
                                      formattedStartTime: this.formatTimestamp(+returnedTrips[key][0]),
                                      formattedStopTime: this.formatTimestamp(+returnedTrips[key][1]),
                                      selected: false,
                                  });
                              }
                              console.log(JSON.stringify(trips));
                              trips.sort((a,b) => b.startTime - a.startTime);
                              this.trips = trips;
                          }
                      })
              }
          },
          // User clicks a table row
          selectTrip(index) {
              // Reset the selected state of all trips
              this.trips.forEach(t => t.selected = false);
              let t = this.trips.find(trip => trip.index === index);
              t.selected = !t.selected;

              // Query for car lat/lon
              let vidQueryString = `vid=${this.selectedVehicleId}`;
              let propertiesQueryString = `properties=location,speed`;
              let timeQueryString = `start=${t.startTime}&stop=${t.stopTime}`;
              this.$http.get(`${this.queryUrl}/query?${vidQueryString}&${propertiesQueryString}&${timeQueryString}`)
                  .then(response => {
                      return response.json();
                  }, error => {
                      alert('There is an error fetching trip data from the server.');
                  })
                  .then(data => {
                      let route = {
                          color: 'E74C3C',
                          path: [],
                          name: t.name,
                      };
                      // Filter invalid GPS data out and sort by timestamp
                      let tripData = data.msg.find(m => m.vid === this.selectedVehicleId).data
                          .filter(d => !(d.GPS_LAT == "0.0" && d.GPS_LONG === "0.0"))
                          .sort((a, b) => a.tstamp - b.tstamp);

                      // Push the lat/lon into path and marker arrays
                      tripData.forEach(td => {
                          route.path.push({
                              lat: +td.GPS_LAT,
                              lng: +td.GPS_LONG
                          })
                          this.markers.push({
                              position: {
                                  lat: +td.GPS_LAT,
                                  lng: +td.GPS_LONG
                              },
                              timestamp: td.tstamp
                          });
                      })
                      this.routes.push(route);
                      console.log('Routes = ' + JSON.stringify(this.routes));
                      console.log('Markers = ' + JSON.stringify(this.markers));


                  })
          },
          formatTimestamp(timestamp) {
              return this.$moment(timestamp).format('MMM D, YYYY HH:mm:ss');
          }
        },
        created() {
            let vm = this;

            // Load the vehicles
            this.$http.get('vehicles.json')
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    const resultArray = [];
                    for (let key in data) {
                        data[key].id = key;
                        resultArray.push(data[key]);
                    }
                    this.vehicles = resultArray;

                    /*// Assign all vehicles to be selected by default
                    this.vehicles.forEach((v) => {
                        vm.selectedVehicleIds.push({
                            label: v.name,
                            value: v.id,
                        });
                    });     */

                });
        }
    }
</script>

<style>
    .highlight {
        background-color: pink;
    }
</style>