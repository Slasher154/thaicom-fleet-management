<template>
    <div>
        <h4>{{ title }}</h4>
        <br>
        <div class="row">
            <div class="col-md-6 col-sm-12">
                <div class="form-group"
                     :class="{'has-danger': errors.has('name')}">
                    <label>Name</label>
                    <input
                            v-validate="'required'"
                            :class="{'form-control-danger': errors.has('name')}"
                            class="form-control"
                            type="text"
                            name="name"
                            v-model.trim="vehicle.name">
                    <div v-if="errors.has('name')" class="form-control-feedback">{{ errors.first('name') }}</div>
                </div>
                <div class="form-group"
                     :class="{'has-danger': errors.has('licensePlate')}">
                    <label>License Plate</label>
                    <input
                            v-validate="{ rules: { required: true, regex: /^[0-9ก-ฮ][ก-ฮ][ก-ฮ]? [0-9]{1,4}$/ }}"
                            class="form-control"
                            :class="{'form-control-danger': errors.has('licensePlate')}"
                            type="text"
                            name="licensePlate"
                            v-model.trim="vehicle.licensePlate">
                    <div v-if="errors.has('licensePlate')" class="form-control-feedback">{{ errors.first('licensePlate') }}</div>
                </div>
                <div class="form-group">
                    <label>Driver</label>
                    <select class="form-control" v-model="vehicle.driverId">
                        <option v-for="driver in drivers" :value="driver.id">{{ driver.title }} {{ driver.firstName }} {{ driver.lastName }}</option>
                    </select>
                </div>
                <button :disabled="errors.any()" class="btn btn-primary" @click="readyToSubmit = true">Submit</button>
            </div>
        </div>

        <!-- use the modal component, pass in the prop -->
        <app-modal v-if="readyToSubmit" @ok="submit" @cancel="readyToSubmit = false">
            <h3 v-if="isEdited" slot="header">Save changes?</h3>
            <h3 v-else slot="header">Add the following Vehicle?</h3>

            <div slot="body">
                <h4>Name: {{ vehicle.name }}</h4>
                <h4>License Plate: {{ vehicle.licensePlate }}</h4>
                <h4>Driver: {{ driverFullName }}</h4>
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
                vehicle: {
                    name: 'Car 1',
                    licensePlate: '1กถ 2222',
                    driverId: '',
                },
                drivers: [],
                currentVehicleName: '',                
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
                    return `Edit vehicle:  ${this.currentVehicleName}`;
                }
                return 'Add vehicle';
            },
            driverFullName() {
                if(this.vehicle.driverId) {
                    var vm = this;
                    let selectedDriver = this.drivers.find(function(driver) {
                        return driver.id ===  vm.vehicle.driverId;
                    });
                    return `${selectedDriver.title} ${selectedDriver.firstName} ${selectedDriver.lastName}`;
                }
            }
        },
        methods: {
            submit() {
                this.readyToSubmit = false;
                let vm = this;
                if (!this.isEdited) {
                    this.$http.post('vehicles.json', this.vehicle)
                        .then(response => {
                            VueNotifications.success({
                                message: `${vm.vehicle.name} added.`
                            });
                        }, error => {
                            VueNotifications.error({
                                message: `There has been error while adding ${vm.vehicle.name} to the database.`
                            });
                        });
                } else {
                    this.$http.put('vehicles/' +  this.id + '.json', this.vehicle)
                        .then(response => {
                            VueNotifications.success({
                                message: `${vm.vehicle.name} information has been updated.`
                            });
                        }, error => {
                            VueNotifications.error({
                                message: `There has been error while updating ${vm.vehicle.name} to the database.`
                            });
                        });
                }
                this.$router.push({ name: 'allVehicles' });

            }
        },
        created() {
            // Load the driver options
            this.loadAllDrivers();

            // If this form is loaded for edit vehicle page, fetch the driver with id from props passed via the URL from Firebase
            if(this.isEdited) {
                var vm = this;
                this.$http.get('vehicles/' +  this.id + '.json')
                    .then(response => {
                        return response.json();
                    })
                    .then(data => {
                        this.vehicle = data;
                        this.currentVehicleName = `${data.name}`;
                    });
            }
        },
    }
</script>