<template>
    <div>
        <div class="row">
            <div class="col-lg-3 col-md-6 col-sm-12">
                 <h5>Select Vehicles</h5>
                 <v-select multiple v-model="selectedVehicles" :options="vehicleChoices">

                </v-select>
                <br>
            </div>
            <div class="col-lg-3 col-md-6 col-sm-12">
                <h5>See data from the past:</h5>
                <select v-model="selectedDay" class="form-control">
                    <option v-for="day in dayChoices" :value="day.value"> {{ day.label }}</option>
                </select>
            </div>

        </div>
        <div class="row">
            <div class="col-sm-12">
                <div class="card">
                    <h3 class="card-header">Historical Speed Data</h3>
                    <div class="card-block">
                        <h4 class="card-title">Select vehicles</h4>
                        <div style="height: 500px" width="100%">
                            <app-speed-chart
                                    :chartData="selectedSpeedData"
                                    :options="chartOptions"
                            ></app-speed-chart>
                        </div>
                        <!--<p class="card-text">With supporting text below as a natural lead-in to additional content.</p>-->
                        <!--<a href="#" class="btn btn-primary">Go somewhere</a>-->
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Chart from './BarChart';
    import _ from 'lodash';
    import DBCallMixin from '../../mixins/retrieveDatabaseMixin';
    export default {
        components: {
            appSpeedChart: Chart,
        },
        mixins: [DBCallMixin],
        data() {
            return {
                chartData: {},
                chartOptions: {
                    scales: {
                        xAxes: [{
                            type: 'time',
                            time: {
                                displayFormats: {
                                    'millisecond': 'MMM DD HH:mm',
                                    'second': 'MMM DD HH:mm',
                                    'minute': 'MMM DD HH:mm',
                                    'hour': 'MMM DD HH:mm',
                                    'day': 'MMM DD HH:mm',
                                    'week': 'MMM DD HH:mm',
                                    'month': 'MMM DD HH:mm',
                                    'quarter': 'MMM DD HH:mm',
                                    'year': 'MMM DD HH:mm',
                                }
                            }
                        }],
                    },
                    responsive: true,
                    maintainAspectRatio: false
                },
                vehicles: [],
                selectedVehicles: [],
                selectedDay: 1,
                days: [1, 3, 5, 7],
                vehicleHistoricalSpeedData: [],
            }
        },
        computed: {
            // Return speed data to be rendered in the graph
            selectedSpeedData() {
                // Create array of datasets filtered by selected vehicles
                let vm = this;
                let dataset = [];

                // Create a clone data here to prevent the changes to original historical data since we just to filter
                // from a set of data here
                let clonedData = _.cloneDeep(this.vehicleHistoricalSpeedData);


                // Filter data by vehicle first
                let selectedVehicleIds = _.map(this.selectedVehicles, 'value');
                let vehicleFilteredData = _.filter(clonedData, (o) => {
                    return _.indexOf(selectedVehicleIds, o.vehicleId) > -1;
                });
                // Remove the data points that is older than selected past day
                let day = this.selectedDay;
                vehicleFilteredData.forEach((d) => {
                    d.dataPoints = _.filter(d.dataPoints, (p) => {
                        return p.x > vm.$moment().add(-day, 'd');
                    });
                })
                let chartData = vehicleFilteredData.map((d) => {
                    return {
                        label: d.vehicleName,
                        data: d.dataPoints,
                        fill: false,
                        borderColor: '#' + d.color,
                    };
                });
                return {
                    datasets: chartData,
                };
            },
            dayChoices() {
                return this.days.map((day) => {
                    return {
                        label: day + ' Days',
                        value: day,
                    };
                });
            },
            vehicleChoices() {
                return this.vehicles.map((v) => {
                    return {
                        label: v.name,
                        value: v.id,
                    };
                });
            }
        },
        methods: {
          addHours(hour) {
              return this.$moment().add(hour, 'h');
          },
          randomBetweenTwoNumbers(min, max) {
                return Math.floor(Math.random()*(max-min+1)+min);
          },
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

                    // Assign all vehicles to be selected by default
                    this.vehicles.forEach((v) => {
                        vm.selectedVehicles.push({
                            label: v.name,
                            value: v.id,
                        });
                    });
                    /*vm.selectedVehicles = this.vehicles.map((v) => {
                        return v.id;
                    })*/

                    // Generate sample data

                    let colors = [
                        'E74C3C',
                        '28B463',
                        '3498DB',
                        'F39C12'];

                    // Speed

                    this.vehicleHistoricalSpeedData = this.vehicles.map((v, index) => {
                        let dataPoints = [];
                        let maxDays = vm.days.reduce((a,b) => Math.max(a,b));
                        let hour = 0;
                        let currentSpeed = vm.randomBetweenTwoNumbers(90, 110);
                        while(vm.addHours(hour) > vm.$moment().add(-maxDays, 'd')) {
                            dataPoints.push({
                                x: vm.addHours(hour--),
                                y: currentSpeed
                            });
                            currentSpeed += vm.randomBetweenTwoNumbers(-3, 3);
                        }
                        return {
                            vehicleId: v.id,
                            vehicleName: v.name,
                            color: colors[index % colors.length],
                            dataPoints: dataPoints,
                        }
                    })
                });
        }
    }
</script>