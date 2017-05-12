/**
 * Created by thana on 5/11/2017.
 */

// CommitChart.js
import {Line, mixins } from 'vue-chartjs'

export default Line.extend({
    mixins: [mixins.reactiveProp],
    props: ["chartData", "options"],
    computed: {

    },
    methods: {
        newDate(days) {
            return this.$moment().add(days, 'd');
        },
    },
    mounted () {
        // Overwriting base render method with actual data.
        this.renderChart(this.chartData, this.options);
    }
})