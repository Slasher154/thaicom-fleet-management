<template>
    <div id="app">
    <app-header></app-header>
        <div class="container">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
    import Header from './components/Header.vue';
    export default {
        name: 'app',

        components: {
            appHeader: Header,
        },

    }
</script>

<style>
    /* Show it is fixed to the top */
    body {
        min-height: 75rem;
        padding-top: 4.5rem;
    }
</style>
