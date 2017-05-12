<template>
    <div>
        <h1>Dashboard</h1>
        <hr>
        <h4>Speed Limit: {{ systemConfig.speedLimit }} km/h</h4>
        <div class="row">
            <div class="col-12 col-sm-6">
                <app-vehicle-info
                        v-for="car in cars"
                        :car="car"
                        :key="car.id"
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
                systemConfig: {},
            }
        },
        methods: {
            randomBetweenTwoNumbers(min, max) {
                return Math.floor(Math.random()*(max-min+1)+min);
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
                    // Loop each car data from database and merge with some random data to display in dashboard (speed, position, etc.)
                    for (let i = 0; i < resultArray.length; i++) {
                        this.cars.push(Object.assign(
                            resultArray[i], {
                                fuelLevel: 100 - Math.round(Math.random() * 10),
                                temperature: 27 + (Math.round(Math.random() * 3 - 0.5)),
                                speed: 100,
                                position: {
                                    lat: 13.6 + Math.random() / 10,
                                    lng: 100.54 + Math.random() / 10,
                                },
                                speedLimit: this.systemConfig.speedLimit,
                                latestUpdate: this.$moment().format('MMM D, YYYY HH:mm:ss'),
                                color: colors[i % 4],
                            }));
                    }

                });


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
            }, 1000);
        },
        beforeDestroy() {
            // Stop the value updates when this component is destroyed, i.e. user navigates to other page
            clearInterval(this.simulateDataChanges);
        },

    }
</script>