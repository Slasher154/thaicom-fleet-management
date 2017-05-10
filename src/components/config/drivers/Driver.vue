<template>
    <div>
        <h1>Manage Drivers <button class="btn btn-primary pull-right" @click="navigateToAddRouter"><i class="fa fa-plus"></i>  Add a driver</button></h1>
        <hr>
        <router-view></router-view>
    </div>
</template>

<script>
    export default {
        methods: {
            navigateToAddRouter() {
                this.$router.push({ name: 'newDriver' });
            }
        }
    }
</script>