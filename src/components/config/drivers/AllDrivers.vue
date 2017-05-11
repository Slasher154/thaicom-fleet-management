<template>
    <div>
        <h4>All Drivers</h4>
        <br>
        <table class="table table-bordered table-striped table-sm">
            <thead>
            <tr>
                <th>#</th>
                <th>Title</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Actions</th>
            </tr>
            </thead>
            <tbody>
                <tr v-for="(driver, index) in drivers">
                    <td>{{ index+1 }}</td>
                    <td>
                        <i v-if="driver.title === 'Mr'" class="fa fa-male" style="color: blue"></i>
                        <i v-else class="fa fa-female" style="color: deeppink"></i>
                        {{ driver.title }}
                    </td>
                    <td>{{ driver.firstName }}</td>
                    <td>{{ driver.lastName }}</td>
                    <td>
                        <button class="btn btn-primary btn-sm" @click="navigateToEdit(driver.id)">Edit</button>
                        <button class="btn btn-danger btn-sm" @click="prepareToDeleteItem(driver.id)">Delete</button>
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
    import DBCallMixin from '../../../mixins/retrieveDatabaseMixin';
    export default {
        components: {
            appModal: Modal,
        },
        mixins: [DBCallMixin],
        data() {
            return {
                drivers: [],
                readyToDelete: false,
                deletedItem: {},
            };
        },
        methods: {
            navigateToEdit(id) {
                this.$router.push({ name: 'editDriver', params: { id: id }});
            },
            prepareToDeleteItem(_id) {
                this.deletedItem = this.drivers.find(function(driver) {
                    return driver.id === _id;
                });
                this.readyToDelete = true;
            },
            deleteItem() {
                this.readyToDelete = false;
                let vm = this;
                console.log('drivers/' +  this.deletedItem.id + '.json');
                this.$http.delete('drivers/' +  this.deletedItem.id + '.json')
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
              return `${this.deletedItem.title} ${this.deletedItem.firstName} ${this.deletedItem.lastName}`;
          },
        },
        created() {
                // Call the method loadAllDrivers from the imported DBCall mixin
                this.loadAllDrivers();
        }
    }
</script>