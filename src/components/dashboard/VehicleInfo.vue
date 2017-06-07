<template>
    <div>
        <div class="card">
            <div class="card-block">
                <!--<h3 class="float-right">{{ speed }} km/h</h3>-->
                <div class="row">
                    <!--<div class="col-8">-->
                    <!--<h4 class="card-title">{{ name }}</h4>-->
                    <!--<h6 class="card-subtitle mb-2 text-muted">{{ licensePlate }}</h6>-->
                    <!--<span>Fuel Level: {{ fuelLevel }} %</span>-->
                    <!--<span>Temperature: {{ temperature }} C</span>-->
                    <!--</div>-->
                    <!--<div class="col-4 text-md-right">-->
                    <!--<h2>100</h2>-->
                    <!--<h6>km/h</h6>-->
                    <!--</div>-->
                    <div class="col-8">
                        <h4 class="card-title" :style="{color: '#' + car.color}"><i class="fa fa-bus" aria-hidden="true"></i> {{ car.name }}</h4>
                        <h6 class="card-subtitle mb-2 text-muted">{{ car.licensePlate }}</h6>
                        <div>
                            <i class="fa fa-battery-full" aria-hidden="true"></i>
                            <span>{{ car.fuelLevel }} %</span> |
                            <i class="fa fa-thermometer-4" aria-hidden="true"></i>
                            <span>{{ car.temperature }} C</span>
                        </div>
                        <div>
                            <strong>Latest Update:</strong> {{ car.latestUpdate }}
                        </div>

                    </div>
                    <div class="col-4 text-md-right">
                        <h2 v-if="car.speed == 0" style="color: orangered">Parked</h2>
                        <template v-else>
                            <h2 :class="violateSpeedLimit ? 'car-speed-violate' : 'car-speed-normal'">{{ car.speed }}</h2>
                            <h6 :class="violateSpeedLimit ? 'car-speed-violate' : 'car-speed-normal'">km/h</h6>
                        </template>
                        <button v-if="car.tracking" class="btn btn-small btn-danger" @click="toggleCarTracking">Tracking</button>
                        <button v-else class="btn btn-small" @click="toggleCarTracking">Track</button>
                    </div>
                </div>

                <!--<a href="#" class="card-link">Card link</a>-->
                <!--<a href="#" class="card-link">Another link</a>-->
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            car: {
                type: Object,
            },
            name: {
                type: String,
                default: 'Bus 322',
            },
            licensePlate: {
                type: String,
            },
            speed: {
                type: Number,
                default: 100,
            },
            fuelLevel: {
                type: Number,
                default: 100,
            },
            temperature: {
                type: Number,
                default: 27,
            },
            speedLimit: {
                type: Number,
                default: 110,
            },

        },
        computed: {
            violateSpeedLimit() {
                return this.car.speed > this.car.speedLimit;
            }
        },
        methods: {
            toggleCarTracking() {
                this.car.tracking = !this.car.tracking;

                // Emit change to parent template by sending the tracking status and car ID back to template
                this.$emit('trackingChanged', this.car.tracking, this.car.id);

            }
        }
    }
</script>

<style>
 /*   .card {
        cursor: pointer;
    }*/
    .car-speed-normal {
        color: green;
    }
    .car-speed-violate {
        color: red;
    }
</style>