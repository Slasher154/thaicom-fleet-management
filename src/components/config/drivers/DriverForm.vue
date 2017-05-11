<template>
    <div>
        <h4>{{ title }}</h4>
        <br>
        <div class="row">
            <div class="col-md-6 col-sm-12">
                <div class="form-group">
                    <label>Title</label>
                    <select class="form-control" v-model="driver.title">
                        <option v-for="title in titleOptions" :value="title">{{ title }}</option>
                    </select>
                </div>
                <div class="form-group"
                     :class="{'has-danger': errors.has('firstName')}">
                    <label>First Name</label>
                    <input
                            v-validate="'required|alpha'"
                            :class="{'form-control-danger': errors.has('firstName')}"
                            class="form-control"
                            type="text"
                            name="firstName"
                            v-model.trim="driver.firstName">
                    <div v-if="errors.has('firstName')" class="form-control-feedback">{{ errors.first('firstName') }}</div>
                </div>
                <div class="form-group"
                     :class="{'has-danger': errors.has('lastName')}">
                    <label>Last Name</label>
                    <input
                            v-validate="'required|alpha'"
                            class="form-control"
                            :class="{'form-control-danger': errors.has('lastName')}"
                            type="text"
                            name="lastName"
                            v-model.trim="driver.lastName">
                    <div v-if="errors.has('lastName')" class="form-control-feedback">{{ errors.first('lastName') }}</div>
                </div>
                <button :disabled="errors.any()" class="btn btn-primary" @click="readyToSubmit = true">Submit</button>
            </div>
        </div>

        <!-- use the modal component, pass in the prop -->
        <app-modal v-if="readyToSubmit" @ok="submit" @cancel="readyToSubmit = false">
            <h3 v-if="isEdited" slot="header">Save changes?</h3>
            <h3 v-else slot="header">Add the following Driver?</h3>

            <div slot="body">
                <h4>{{driver.title}} {{driver.firstName}} {{driver.lastName}}</h4>
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
        props: {
            id: {
                type: String
            }
        },
        data() {
            return {
                driver: {
                    title: 'Mr',
                    firstName: 'Name',
                    lastName: 'Lastname',
                },
                currentFullName: '',
                titleOptions: [
                    'Mr',
                    'Mrs',
                    'Miss',
                ],
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
                    return `Edit driver:  ${this.currentFullName}`;
                }
                return 'Add a driver';
            },
            fullName() {
                return `${this.driver.title} ${this.driver.firstName} ${this.driver.lastName}`;
            }
        },
        methods: {
            submit() {
                this.readyToSubmit = false;
                let vm = this;
                if (!this.isEdited) {
                    this.$http.post('drivers.json', this.driver)
                        .then(response => {
                            VueNotifications.success({
                                message: `${vm.fullName} added.`
                            });
                        }, error => {
                            VueNotifications.error({
                                message: `There has been error while adding ${vm.fullName} to the database.`
                            });
                        });
                } else {
                    this.$http.put('drivers/' +  this.id + '.json', this.driver)
                        .then(response => {
                            VueNotifications.success({
                                message: `${vm.fullName} information has been updated.`
                            });
                        }, error => {
                            VueNotifications.error({
                                message: `There has been error while updating ${vm.fullName} to the database.`
                            });
                        });
                }
                this.$router.push({ name: 'allDrivers' });

            }
        },
        created() {
            // If this form is loaded for edit driver page, fetch the driver with id from props passed via the URL from Firebase
            if(this.isEdited) {
                var vm = this;
                this.$http.get('drivers/' +  this.id + '.json')
                    .then(response => {
                        return response.json();
                    })
                    .then(data => {
                        this.driver = data;
                        this.currentFullName = `${data.title} ${data.firstName} ${data.lastName}`;
                    });
            }

        }
    }
</script>