<template>
    <div>
        <h1>Manage Vehicles <button class="btn btn-primary pull-right" @click="navigateToAddVehicle"><i class="fa fa-plus"></i>  Add vehicle</button></h1>
        <hr>
        <router-view></router-view>
    </div>
</template>

<script>
    export default {
        methods: {
            navigateToAddVehicle() {
                this.$router.push({ name: 'newVehicle' });
            }
        }
    }
</script>