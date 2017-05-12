/**
 * Created by thana on 5/11/2017.
 */

export default {
    methods: {
        loadAllVehicles() {
            // Load the vehicles
            this.$http.get('vehicles.json')
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    const resultArray = [];
                    for (let key in data) {
                        data[key].id = key;
                        resultArray.push(data[key]);
                    }
                    this.vehicles = resultArray;
                });
        },
        loadAllDrivers() {
            // Load the drivers
            this.$http.get('drivers.json')
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    const resultArray = [];
                    for (let key in data) {
                        data[key].id = key;
                        resultArray.push(data[key]);
                    }
                    this.drivers = resultArray;
                });
        },
        loadAllObdiiDevices() {
            // Load the OBDii Devices
            this.$http.get('obdiiDevices.json')
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    const resultArray = [];
                    for (let key in data) {
                        data[key].id = key;
                        resultArray.push(data[key]);
                    }
                    this.obdiiDevices = resultArray;
                });
        },
        loadSystemConfig() {
            this.$http.get('systemConfig.json')
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    this.systemConfig = data;
                });
        }
    }
}