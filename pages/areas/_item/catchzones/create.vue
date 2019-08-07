<template>
    <v-form v-model="valid">
        <v-container>
            <v-layout wrap>
                <v-flex xs12>
                    <v-text-field label="Naam" v-model="item.name" :rules="[v => !!v || 'De naam is verplicht']" />
                </v-flex>

                <v-flex xs12>
                    <v-text-field label="Grootte" type="number" v-model="item.radius" suffix="meter" :rules="[
                        v => !!v || 'De grootte is verplicht',
                        v => v >= 0 || 'De grootte moet groter zijn dan 0',
                        v => v <= 100 || 'De grootte moet kleiner zijn dan 100'
                    ]" />
                </v-flex>

                <l-map class="map" :zoom="13" :center="center">
                    <l-tile-layer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"></l-tile-layer>
                    <l-marker :lat-lng.sync="position" :draggable="true"></l-marker>
                    <l-circle v-if="item.radius" :lat-lng="position" :radius="Number(item.radius)"></l-circle>
                </l-map>

                <v-autocomplete
                        v-model="item.organisms"
                        :items="organisms"
                        label="Organismes"
                        item-text="name"
                        item-value="id"
                        multiple
                        chips
                        solo
                ></v-autocomplete>

                <v-flex xs12 text-xs-right>
                    <v-btn @click="create" :disabled="!valid">
                        Toevoegen
                    </v-btn>
                </v-flex>
            </v-layout>
        </v-container>
    </v-form>
</template>

<script>
    import { AreaApiClient, CatchZone, CatchZoneApiClient, OrganismApiClient } from './../../../../plugins/api-client';

    export default {
        data: () => ({
            position: [0, 0],
            center: [0, 0],
            radius: null,

            item: {
                lat: 0,
                lon: 0,
                organisms: []
            },

            valid: false,

            organisms: [],
        }),

        watch: {
            position: function() {
                this.item.lat = this.position['lat'];
                this.item.lon = this.position['lng'];
            }
        },

        async created() {
            await OrganismApiClient().organismsGet(1, 9999).then(result => {  
                this.organisms = result.data
            });

            this.area = await AreaApiClient().areasIdGet(this.$route.params['item']);
            const catchZone = await CatchZoneApiClient().catchzonesGet(1, 1, [`area:${this.area.id}`]);

            if (catchZone.data.length > 0) {
                const {lat, lon} = catchZone.data[0];
                this.center = [lat, lon];
                this.position = [lat, lon];
            } else {
                this.center = [51.708512, 5.295789];
                this.position = [51.708512, 5.295789];
            }
        },

        methods: {
            async create() {
                this.item.radius = parseInt(this.item.radius);
                this.item.area = this.area.id;

                await CatchZoneApiClient().catchzonesPost(this.item).then(() => {
                    this.$router.push({ path: '..' });
                }).catch((response) => {
                    if (response.status == 409) {
                        this.$toast.error('Er bestaat al een vangzone met deze naam');
                        return;
                    }

                    this.$toast.error('Er is iets fout gegaan bij het aanmaken. Probeer het later opnieuw');
                });
            }
        }
    }
</script>

<style lang="scss" scoped> 
    .map {
        width: 100%;
        height: 600px !important;
        margin-bottom: 25px;
        z-index: 0;
    }
</style>
