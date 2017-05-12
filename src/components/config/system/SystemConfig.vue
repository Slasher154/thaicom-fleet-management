<template>
    <div>
        <h1>Manage System Configurations</h1>
        <hr>
        <div class="form-group row"
             :class="{'has-danger': errors.has('speedLimit')}">
            <label class="col-sm-2 col-form-label">Speed Limit (km/h)</label>
            <div class="col-sm-3">
                <input
                        v-validate="{ rules: { required: true, decimal: 2}}"
                        :class="{'form-control-danger': errors.has('speedLimit')}"
                        name="speedLimit"
                        class="form-control"
                        v-model.number="systemConfig.speedLimit" >
                <div v-if="errors.has('speedLimit')" class="form-control-feedback">{{ errors.first('speedLimit') }}</div>
            </div>
        </div>
        <div class="form-group row">
            <div class="offset-sm-2 col-sm-10">
                <button class="btn btn-primary" @click="readyToSubmit = true">Submit</button>
            </div>
        </div>
        <!-- use the modal component, pass in the prop -->
        <app-modal v-if="readyToSubmit" @ok="submit" @cancel="readyToSubmit = false">
            <h3 slot="header">Update Confirmation</h3>
            <div slot="body">
                <h3>Save changes?</h3>
            </div>
        </app-modal>
    </div>
</template>

<script>
    import DBCallMixin from '../../../mixins/retrieveDatabaseMixin';
    import VueNotifications from 'vue-notifications';
    import Modal from '../../ConfirmationModal.vue';
    export default {
        mixins: [DBCallMixin],
        components: {
            appModal: Modal,
        },
        data() {
            return {
                readyToSubmit: false,
                systemConfig: {},
            }
        },
        methods: {
            submit() {
                this.readyToSubmit = false;
                // Update data to the database
                this.$http.put('systemConfig.json', this.systemConfig)
                    .then(response => {
                        VueNotifications.success({
                            message: `System configuration has been updated.`
                        });
                    }, error => {
                        VueNotifications.error({
                            message: `There has been error while updating system configuration to the database.`
                        });
                    });
                this.$router.push({ name: 'updateSystemConfig' });
            }
        },
        created(){
            this.loadSystemConfig();
        }
    }
</script>