<template>
    <div>
        <h1>Report</h1>
        <hr>
        <app-chart></app-chart>
    </div>
</template>

<script>
    import Chart from './Charts.vue';
    export default {
        components: {
            appChart: Chart
        }
    }
</script>