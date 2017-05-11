<template>
    <div>
        <h4>All OBD-II Devices</h4>
        <br>
        <table class="table table-bordered table-striped table-sm">
            <thead>
            <tr>
                <th>#</th>
                <th>Device ID</th>
                <th>Vehicle</th>
                <th>Driver</th>
                <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(obdiiDevice, index) in obdiiDevices">
                <td>{{ index+1 }}</td>
                <td>          
                    {{ obdiiDevice.deviceId }}
                </td>
                <td>{{ getVehicleName(obdiiDevice.vehicleId) }}</td>
                <td>{{ getObdiiDevicesName(obdiiDevice.vehicleId) }}</td>
                <td>
                    <button class="btn btn-primary btn-sm" @click="navigateToEdit(obdiiDevice.id)">Edit</button>
                    <button class="btn btn-danger btn-sm" @click="prepareToDeleteItem(obdiiDevice.id)">Delete</button>
                </td>
            </tr>
            </tbody>
        </table>
        <!-- use the modal component, pass in the prop -->
        <app-modal v-if="readyToDelete" @ok="deleteItem" @cancel="readyToDelete = false">
            <h3 slot="header">Confirm Delete</h3>

            <div slot="body">
                <h4>Delete {{ deletedItem.deviceId }} ? </h4>
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
        data() {
            return {
                obdiiDevices: [],
                vehicles: [],
                drivers: [],
                readyToDelete: false,
                deletedItem: {},
            };
        },
        computed: {
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
        },
        methods: {
            getVehicleName(obdiiVehicleId) {
                if(this.vehicleWithDrivers) {
                    return this.vehicleWithDrivers.find(function(vehicle) {
                        return vehicle.id === obdiiVehicleId;
                    }).name;
                } else {
                    return '';
                }

            },
            getObdiiDevicesName(obdiiVehicleId) {
                if(this.vehicleWithDrivers) {
                    return this.vehicleWithDrivers.find(function(vehicle) {
                        return vehicle.id === obdiiVehicleId;
                    }).driverInfo;
                } else {
                    return '';
                }
            },
            navigateToEdit(id) {
                this.$router.push({ name: 'editObdiiDevice', params: { id: id }});
            },
            prepareToDeleteItem(_id) {
                this.deletedItem = this.obdiiDevices.find(function(obdiiDevice) {
                    return obdiiDevice.id === _id;
                });
                this.readyToDelete = true;
            },
            deleteItem() {
                this.readyToDelete = false;
                let vm = this;
                console.log('obdiiDevices/' +  this.deletedItem.id + '.json');
                this.$http.delete('obdiiDevices/' +  this.deletedItem.id + '.json')
                    .then(response => {
                        VueNotifications.success({
                            message: `${vm.deletedItem.id} has been deleted.`
                        });
                        // Reload the page
                        this.$router.go(this.$router.currentRoute);
                    }, error => {
                        VueNotifications.error({
                            message: `There has been error while deleting ${vm.deletedItem.id} from the database.`
                        });
                    });

            }
        },
        created() {
            // Load the obdiiDevicees
            this.loadAllObdiiDevices();
            // Load cars
            this.loadAllVehicles();
            // Load drivers
            this.loadAllDrivers();
        }
    }
</script>