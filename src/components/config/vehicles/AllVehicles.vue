<template>
    <div>
        <h4>All Vehicles</h4>
        <br>
        <table class="table table-bordered table-striped table-sm">
            <thead>
            <tr>
                <th>#</th>
                <th>Name</th>
                <th>License Plate</th>
                <th>Driver</th>
                <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(vehicle, index) in vehicles">
                <td>{{ index+1 }}</td>
                <td>
                    {{ vehicle.name }}
                </td>
                <td>{{ vehicle.licensePlate }}</td>
                <td>{{ getName(vehicle.driverId) }}</td>
                <td>
                    <button class="btn btn-primary btn-sm" @click="navigateToEdit(vehicle.id)">Edit</button>
                    <button class="btn btn-danger btn-sm" @click="prepareToDeleteItem(vehicle.id)">Delete</button>
                </td>
            </tr>
            </tbody>
        </table>
        <!-- use the modal component, pass in the prop -->
        <app-modal v-if="readyToDelete" @ok="deleteItem" @cancel="readyToDelete = false">
            <h3 slot="header">Confirm Delete</h3>

            <div slot="body">
                <h4>Delete {{ deletedItemFullName }} ? </h4>
            </div>
        </app-modal>
    </div>

</template>

<script>
    import Modal from '../../ConfirmationModal.vue';
    import VueNotifications from 'vue-notifications';
    export default {
        components: {
            appModal: Modal,
        },
        data() {
            return {
                vehicles: [],
                readyToDelete: false,
                deletedItem: {},
                drivers: [],
            };
        },
        methods: {
            getName(driverId) {
                let d = this.drivers.find(function (driver) {
                    return driver.id === driverId;
                });
                return `${d.title} ${d.firstName} ${d.lastName}`;
            },
            navigateToAddRouter() {
                this.$router.push({ name: 'newVehicle' });
            },
            navigateToEdit(id) {
                this.$router.push({ name: 'editVehicle', params: { id: id }});
            },
            prepareToDeleteItem(_id) {
                this.deletedItem = this.vehicles.find(function(vehicle) {
                    return vehicle.id === _id;
                });
                this.readyToDelete = true;
            },
            deleteItem() {
                this.readyToDelete = false;
                let vm = this;
                console.log('vehicles/' +  this.deletedItem.id + '.json');
                this.$http.delete('vehicles/' +  this.deletedItem.id + '.json')
                    .then(response => {
                        VueNotifications.success({
                            message: `${vm.deletedItemFullName} has been deleted.`
                        });
                        // Reload the page
                        this.$router.go(this.$router.currentRoute);
                    }, error => {
                        VueNotifications.error({
                            message: `There has been error while deleting ${vm.deletedItemFullName} from the database.`
                        });
                    });

            }
        },
        computed: {
            deletedItemFullName() {
                return `${this.deletedItem.name}`;
            },
        },
        created() {
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
                });
            // Load the drivers
            this.$http.get('drivers.json')
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    const resultArray = [];
                    for (let key in data) {
                        data[key].id = key;
                        resultArray.push(data[key]);
                    }
                    this.drivers = resultArray;
                });
        }
    }
</script>