<template>
    <div>
        <h4>{{ title }}</h4>
        <br>
        <div class="row">
            <div class="col-md-6 col-sm-12">
                <div class="form-group"
                     :class="{'has-danger': errors.has('deviceId')}">
                    <label>Device ID</label>
                    <input
                            v-validate="'required|alpha_num'"
                            :class="{'form-control-danger': errors.has('deviceId')}"
                            class="form-control"
                            type="text"
                            name="deviceId"
                            v-model.trim="obdiiDevice.deviceId">
                    <div v-if="errors.has('deviceId')" class="form-control-feedback">{{ errors.first('deviceId') }}</div>
                </div>             
                <div class="form-group">
                    <label>Vehicle</label>
                    <select class="form-control" v-model="obdiiDevice.vehicleId">
                        <option v-for="vehicle in vehicleWithDrivers" :value="vehicle.id">{{ vehicle.name }} ({{ vehicle.driverInfo }})</option>
                    </select>
                </div>
                <button :disabled="errors.any()" class="btn btn-primary" @click="readyToSubmit = true">Submit</button>
            </div>
        </div>

        <!-- use the modal component, pass in the prop -->
        <app-modal v-if="readyToSubmit" @ok="submit" @cancel="readyToSubmit = false">
            <h3 v-if="isEdited" slot="header">Save changes?</h3>
            <h3 v-else slot="header">Add the following ObdiiDevice?</h3>

            <div slot="body">
                <h4>Device ID: {{ obdiiDevice.deviceId }}</h4>
                <h4>Vehicle: {{ selectedVehicleAndDriver.name }} </h4>
                <h4>Driver: {{ selectedVehicleAndDriver.driverInfo }} </h4>
            </div>
        </app-modal>
    </div>
</template>

<script>
    import Modal from '../../ConfirmationModal.vue';
    import VueNotifications from 'vue-notifications';
    import DBCallMixin from '../../../mixins/retrieveDatabaseMixin';
    export default {
        components: {
            appModal: Modal,
        },
        mixins: [DBCallMixin],
        props: {
            id: {
                type: String
            }
        },
        data() {
            return {
                obdiiDevice: {
                    deviceId: 'ABCDEFG',                    
                    vehicleId: '',
                },
                vehicles: [],
                drivers: [],
                currentObdiiDeviceId: '',
                readyToSubmit: false,
            }
        },
        computed: {
            isEdited() {
                if (this.id) return true;
                return false;
            },
            title() {
                // If this is' add new driver' page, post the content to drivers.json
                if (this.isEdited) {
                    return `Edit OBD-II Device:  ${this.currentObdiiDeviceId}`;
                }
                return 'Add OBD-II Device';
            },
            vehicleWithDrivers() {
                var vm = this;
                return this.vehicles.map(function (vehicle) {
                    let driver = vm.drivers.find(function(driver) {
                        return driver.id === vehicle.driverId;
                    });
                    if (driver) {
                        return Object.assign(vehicle, { driverInfo: `${driver.title} ${driver.firstName} ${driver.lastName}`});
                    }
                    else {
                        return vehicle;
                    }
                });
            },
            selectedVehicleAndDriver() {
                var vm = this;
                let selectedVehicle = this.vehicleWithDrivers.find(function(vehicle) {
                    return vehicle.id === vm.obdiiDevice.vehicleId;
                })
                return selectedVehicle;
            }
        },
        methods: {
            submit() {
                this.readyToSubmit = false;
                let vm = this;
                if (!this.isEdited) {
                    // For OBD-II Device, the given ID wil be used as an item key in Firebase so we need to use put instead
                    this.$http.post('obdiiDevices.json', this.obdiiDevice)
                        .then(response => {
                            VueNotifications.success({
                                message: `${vm.obdiiDevice.deviceId} added.`
                            });
                        }, error => {
                            VueNotifications.error({
                                message: `There has been error while adding ${vm.obdiiDevice.deviceId} to the database.`
                            });
                        });
                } else {
                    this.$http.put('obdiiDevices/' +  this.id + '.json', this.obdiiDevice)
                        .then(response => {
                            VueNotifications.success({
                                message: `${vm.obdiiDevice.deviceId} information has been updated.`
                            });
                        }, error => {
                            VueNotifications.error({
                                message: `There has been error while updating ${vm.obdiiDevice.deviceId} to the database.`
                            });
                        });
                }
                this.$router.push({ name: 'allObdiiDevices' });

            }
        },
        created() {
            // Load all vehicles
            this.loadAllVehicles();
            
            // Load the driver options
            this.loadAllDrivers();

            // If this form is loaded for edit obdiiDevice page, fetch the driver with id from props passed via the URL from Firebase
            if(this.isEdited) {
                var vm = this;
                this.$http.get('obdiiDevices/' +  this.id + '.json')
                    .then(response => {
                        return response.json();
                    })
                    .then(data => {
                        this.obdiiDevice = data;
                        this.currentObdiiDeviceId = `${data.deviceId}`;
                    });
            }
        },
    }
</script>