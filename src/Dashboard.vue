<template>
    <div>
        <h1>Dashboard</h1>
        <hr>
        <!--<h4>Speed Limit: {{ systemConfig.speedLimit }} km/h</h4>-->
      <!--  <div class="row">
            <div class="col-12 col-sm-6">

            </div>
            <div class="col-12 col-sm-6">
                <button class="btn btn-primary" @click="refreshMap">Refresh map</button>
            </div>
        </div>-->
        <br>
        <div class="row">
            <div class="col-12 col-sm-6">
                <app-vehicle-info
                        v-for="car in cars"
                        :car="car"
                        :key="car.id"
                        @trackingChanged="updateTrackingStatus"
                >

                </app-vehicle-info>
            </div>
            <div class="col-12 col-sm-6">

                <app-vehicle-map
                        :cars="cars"
                ></app-vehicle-map>
            </div>
        </div>
    </div>

</template>

<script>
    import VehicleInfo from './components/dashboard/VehicleInfo.vue';
    import VehicleMap from './components/dashboard/VehicleMap.vue';
    import DBCallMixin from './mixins/retrieveDatabaseMixin';
    export default {
        components: {
            appVehicleInfo: VehicleInfo,
            appVehicleMap: VehicleMap,
        },
        mixins: [DBCallMixin],
        data () {
            return {
                speedLimit: 100,
                cars: [],
                simulateDataChanges: '',
                refreshSpeedLimit: '',
                systemConfig: {},
                carsToShow: 3,
                simulateChangeDurationInSeconds: 0.5,
                refreshSpeedLimitRateInSeconds: 5,

            }
        },
        methods: {
            randomBetweenTwoNumbers(min, max) {
                return Math.floor(Math.random()*(max-min+1)+min);
            },
            refreshMap() {
                this.$refs.example.resizePreserveCenter()
            },
            updateTrackingStatus(status, carId) {
                //console.log('Status = ' + status + ' and car ID = ' + carId);
                // If the status is True, this means new car is being tracked so we need to turn off tracking of other cars
                if(status) {

                    // Change tracking status of other cars to false
                    this.cars.forEach((car) => {
                        if (car.id != carId) {
                            car.tracking = false;
                        }
                    })



                }


            }
        },
        created() {
            // Download the speed limit from the database
        },
        mounted() {

            // Load system config which includes speed limit
            this.loadSystemConfig();

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
                    // Initialize data for cars
                    let colors = [
                        'E74C3C',
                        '28B463',
                        '3498DB',
                        'F39C12'];

                    // Limit number of cars to show in dashboard
                    let numberOfCars = resultArray.length < this.carsToShow ? resultArray : this.carsToShow;

                    /*
                    // Loop each car data from database and merge with some random data to display in dashboard (speed, position, etc.)
                    for (let i = 0; i < numberOfCars; i++) {
                        this.cars.push(Object.assign(
                            resultArray[i], {
                                fuelLevel: 100 - Math.round(Math.random() * 10),
                                temperature: 27 + (Math.round(Math.random() * 3 - 0.5)),
                                speed: 100,
                                position: {
                                    lat: 13.8,
                                    lng: 100.54,
                                },
                                speedLimit: this.systemConfig.speedLimit,
                                latestUpdate: this.$moment().format('MMM D, YYYY HH:mm:ss'),
                                color: colors[i % 4],
                                tracking: false,
                            }));
                    }
                    */
                    for (let i = 0; i < numberOfCars; i++) {
                        this.cars.push(Object.assign(
                            resultArray[i], {
                                fuelLevel: 100 - Math.round(Math.random() * 10),
                                temperature: 27 + (Math.round(Math.random() * 3 - 0.5)),
                                speed: 100,
                                position: {
                                    lat: 0,
                                    lng: 0
                                },
                                speedLimit: this.systemConfig.speedLimit,
                                latestUpdate: this.$moment().format('MMM D, YYYY HH:mm:ss'),
                                timestamp: 0,
                                color: colors[i % 4],
                                tracking: i == 0 ? true: false, // track the first car by default
                                currentPositionIndex: 0,
                            }
                        ))
                    }
                    //let startTime = 1498628162079;
                    let startTime = 1498628272000;
                    let stopTime =  1498628672074;
                    let vidQueryString = `vid=${this.cars.map(car => car.vid).join(',')}`;
                    let propertiesQueryString = `properties=speed,rpm,location,gspeed,score`;
                    let timeQueryString = `start=${startTime}&stop=${stopTime}`;
                    let url = `http://ubuntu@ec2-54-255-197-138.ap-southeast-1.compute.amazonaws.com/query?${vidQueryString}&${propertiesQueryString}&${timeQueryString}`;
                    this.$http.get(url)
                    //this.$http.get('http://ubuntu@ec2-54-255-197-138.ap-southeast-1.compute.amazonaws.com')
                        .then(response => {
                          return response.json();
                        }, error => {
                            // error callback
                            alert('There is an error while getting data from ' + error.url);
                            return error;
                        })
                        .then(data => {
                            //console.log(JSON.stringify(data));

                            // Message is an array of cars with speed, location data
                            let msg = data.msg;

                            // Map the data from Amazon Dynamodb with our cars array
                            this.cars.forEach((car) => {
                                // Find the data of the corrensponding car by comparing its vid, then sort the data by timestamp
                                car.data = msg.find(m => m.vid === car.vid).data
                                    .filter(d => !(d.GPS_LAT == "0.0" && d.GPS_LONG === "0.0"))
                                    .sort((a, b) => a.tstamp - b.tstamp);

                                // Set the position of the car to the first point in the location data array
                                car.position = {
                                    lat: +car.data[0].GPS_LAT,
                                    lng: +car.data[0].GPS_LONG,
                                };

                                // Set the speed and score
                                car.speed = car.data[0].SpeedSensor;
                                car.score = car.data[0].Score;

                                // Set the timestamp
                                car.timestamp = car.data[0].tstamp;
                            })

                            // Assign the setInterval function to a component parameter so we can call clearInterval(this.simulateChanges) to
                            // stop the value update when the component is destroyed
                            this.simulateDataChanges = setInterval(() => {
                                this.cars.forEach((car) => {

                                    // Update speed
                                    // let speedChange = this.randomBetweenTwoNumbers(-2, 2);
                                    car.speed = car.data[car.currentPositionIndex].SpeedSensor;

                                    // If car speed is less than 0, set it to zero
                                    if(car.speed < 0) {
                                        car.speed = 0;
                                    }

                                    // Update score
                                    car.score = car.data[car.currentPositionIndex].Score;

                                    // Change speed limit
                                    // car.speedLimit = this.systemConfig.speedLimit;

                                    // Move the car
                                    car.position.lat = +car.data[car.currentPositionIndex].GPS_LAT;
                                    car.position.lng = +car.data[car.currentPositionIndex].GPS_LONG;

                                    // Set the timestamp
                                    car.timestamp = car.data[car.currentPositionIndex].tstamp;


                                    // Update the current position index if it's not the end of array
                                    if(car.currentPositionIndex < car.data.length-1) {
                                        car.currentPositionIndex++;
                                    }

                                    // Change the latest datetime the data is updated
                                    car.latestUpdate = this.$moment().format('MMM D, YYYY HH:mm:ss');

                                    // console.log('Updating car with ID = ' + car.id);
                                })
                            }, this.simulateChangeDurationInSeconds * 1000);

                            // Refresh the speed limit every 5 seconds. This process calls external API by giving the current
                            // position of the car and the API will return the speed limit according to Thailand law
                            this.refreshSpeedLimit = setInterval(() => {
                                this.cars.forEach((car) => {
                                    let url = `http://ec2-54-255-197-138.ap-southeast-1.compute.amazonaws.com/speedlimit?lat=${car.position.lat}&long=${car.position.lng}&type=car`;
                                    this.$http.get(url)
                                        .then(response => {
                                            return response.json();
                                        }, error => {
                                            alert(`Error getting speed limit on coordinates: ${car.position.lat}, ${car.position.lng}`)
                                        })
                                        .then(data => {
                                            console.log(`Setting speed limit of ${car.carName} to ${data.msg[0].speed_limit}`);
                                            car.speedLimit = data.msg[0].speed_limit;
                                        });
                                })
                            }, this.refreshSpeedLimitRateInSeconds * 1000);
                        });

                });



            /*
            // Assign the setInterval function to a component parameter so we can call clearInterval(this.simulateChanges) to
            // stop the value update when the component is destroyed
            this.simulateDataChanges = setInterval(() => {
                this.cars.forEach((car) => {
                    // Change speed
                    let speedChange = this.randomBetweenTwoNumbers(-2, 2);
                    car.speed += speedChange;

                    // If car speed is less than 0, set it to zero
                    if(car.speed < 0) {
                        car.speed = 0;
                    }

                    // Change speed limit
                    car.speedLimit = this.systemConfig.speedLimit;

                    // Move the car
                    car.position.lat += Math.random() / 500;
                    car.position.lng += Math.random() / 500;

                    // Change the latest datetime the data is updated
                    car.latestUpdate = this.$moment().format('MMM D, YYYY HH:mm:ss');

                    // console.log('Updating car with ID = ' + car.id);
                })
            }, 2000);
            */
        },
        beforeDestroy() {
            // Stop the value updates when this component is destroyed, i.e. user navigates to other page
            clearInterval(this.simulateDataChanges);
            clearInterval(this.refreshSpeedLimit);
        },

    }
</script>