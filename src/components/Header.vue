<template>
    <div>
        <nav class="navbar navbar-toggleable-md navbar-inverse fixed-top bg-inverse">
            <button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <a class="navbar-brand" href="#">Fleet Management</a>
            <div class="collapse navbar-collapse" id="navbarCollapse">
                <ul class="navbar-nav mr-auto">
                    <router-link :to="{ name: 'dashboard'}" tag="li" class="nav-item" active-class="active" exact><a class="nav-link">Home</a></router-link>
                    <router-link :to="{ name: 'showTrip'}" tag="li" class="nav-item" active-class="active"><a class="nav-link">Trips</a></router-link>
                    <router-link :to="{ name: 'allDrivers'}" tag="li" class="nav-item" active-class="active"><a class="nav-link">Driver</a></router-link>
                    <router-link :to="{ name: 'allVehicles'}" tag="li" class="nav-item" active-class="active"><a class="nav-link">Vehicle</a></router-link>
                    <router-link :to="{ name: 'allObdiiDevices'}" tag="li" class="nav-item" active-class="active"><a class="nav-link">OBD-II</a></router-link>
                    <router-link :to="{ name: 'updateSystemConfig'}" tag="li" class="nav-item" active-class="active"><a class="nav-link">Config</a></router-link>
                    <router-link :to="{ name: 'viewReport'}" tag="li" class="nav-item" active-class="active"><a class="nav-link">Report</a></router-link>




                </ul>

                <!--<form class="form-inline mt-2 mt-md-0">-->
                    <!--<input class="form-control mr-sm-2" type="text" placeholder="Search">-->
                    <!--<button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>-->
                <!--</form>-->
            </div>
        </nav>
    </div>
</template>