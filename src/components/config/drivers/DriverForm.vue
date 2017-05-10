<template>
    <div>
        <h1>{{ title }}</h1>
        <hr>
        <div class="form-group">
            <select class="form-control">
                <option v-for="title in titleOptions" value="title" v-model="driver.title">{{ title }}</option>
            </select>
        </div>
        <div class="form-group">
            <label>First Name</label>
            <input class="form-control" type="text" v-model="driver.firstName">
        </div>
        <div class="form-group">
            <label>Last Name</label>
            <input class="form-control" type="text" v-model="driver.lastName">
        </div>
        <button class="btn btn-primary" @click="submit">Submit</button>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                driver: {
                    title: 'Mr',
                    firstName: '',
                    lastName: '',
                },
                titleOptions: [
                    'Mr',
                    'Mrs',
                    'Miss',
                ]
            }
        },
        methods: {
            submit() {

            }
        }
    }
</script>