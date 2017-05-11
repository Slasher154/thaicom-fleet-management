<template>
    <div>
        <h1>Manage OBD-II <button class="btn btn-primary pull-right" @click="navigateToAddObd2"><i class="fa fa-plus"></i>  Add OBD-II Device</button></h1>
        <hr>
        <router-view></router-view>
    </div>
</template>

<script>
    export default {
        methods: {
            navigateToAddObd2() {
                this.$router.push({ name: 'newObdiiDevice' });
            }
        }
    }
</script>