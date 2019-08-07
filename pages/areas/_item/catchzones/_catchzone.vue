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

                <l-map class="map" v-if="item" :zoom="13" :center="center">
                    <l-tile-layer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"></l-tile-layer>
                    <l-marker :lat-lng.sync="position" :draggable="true"></l-marker>
                    <l-circle :lat-lng="position" v-if="item.radius" :radius="Number(item.radius)"></l-circle>
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
                    <v-btn @click="edit" :disabled="!valid">
                        Bewerken
                    </v-btn>
                </v-flex>
            </v-layout>
        </v-container>
    </v-form>
</template>

<script>
    import { AreaApiClient, CatchZoneApiClient, OrganismApiClient } from './../../../../plugins/api-client';

    export default {
        data: () => ({
            position: [0, 0],
            center: [0, 0],

            item: {
                lat: 0,
                lon: 0,
                organisms: []
            },

            valid: false,

            organisms: []
        }),

        watch: {
            position: function() {
                this.item.lat = this.position['lat'];
                this.item.lon = this.position['lng'];
            }
        },

        async created() {
            this.get();

            await AreaApiClient().areasIdGet(this.$route.params['item']).then(result => {
                this.area = result;
            });

            await OrganismApiClient().organismsGet(1, 9999).then(result => {
                this.organisms = result.data
            });
        },

        methods: {
            async get() {
                this.item = await CatchZoneApiClient().catchzonesIdGet(this.$route.params['catchzone']);
                this.center = [this.item.lat, this.item.lon];
                this.position = [this.item.lat, this.item.lon];
                
                var organisms = [];

                this.item.organisms.forEach((element) => {
                    organisms.push(element.id);
                });

                this.item.organisms = organisms;
            },
            
            async edit() {
                this.item.radius = parseInt(this.item.radius);
                this.item.area = this.area.id;

                await CatchZoneApiClient().catchzonesIdPut(this.item, this.$route.params['catchzone']).then(() => {
                    this.$router.push({ path: '..' });
                }).catch(() => {
                    this.$toast.error('Er is iets fout gegaan bij het bewerken. Probeer het later opnieuw');
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
