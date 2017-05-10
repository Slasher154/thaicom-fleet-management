<template>
    <div>
        <h1>{{ title }}</h1>
        <hr>
        <div class="form-group">
            <label>Name</label>
            <input class="form-control" type="text" v-model="car.name">
        </div>
        <div class="form-group">
            <label>License Plate</label>
            <input class="form-control" type="text" v-model="car.licensePlate">
        </div>
        <button class="btn btn-primary" @click="submit">Submit</button>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                car: {
                    name: '',
                    licensePlate: '',
                }
            }
        },
        methods: {
            submit() {

            }
        }
    }
</script>