<template>
    <v-form v-model="valid">
        <v-container>
            <v-layout justify-center wrap>
                <v-flex xs12>
                    <v-text-field label="Naam" v-model="item.name" readonly :rules="[v => !!v || 'De naam is verplicht']" />
                </v-flex>

                <l-map class="map" :zoom="13" :center="center" v-if="items.length > 0">
                    <l-tile-layer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"></l-tile-layer>
                    <l-rectangle :bounds="[position1, position2]"></l-rectangle>
                </l-map>

                 <v-flex xs12 v-else>
                    <v-alert :value="true" type="info">
                        Het gebied heeft geen vangzones. Voeg vangzones toe om een gebied genereren.
                    </v-alert>
                </v-flex>

                <v-layout justify-center wrap>
                    <v-flex xs12>
                        <v-card>
                            <h2 class="text-md-center headline pt-2 pb-3">Vangzones</h2>
                            <v-data-table :headers="headers" :items="items" hide-actions :pagination.sync="pagination">
                                <template slot="header" slot-scope="{ header }">
                                    <span v-text="header.text" />
                                </template>
                                <template slot="items" slot-scope="{ item }">
                                    <td>{{ item.name }}</td>
                                    <td>
                                        <v-btn slot="activator" color="success" icon :to="{ path: '/areas/' + $route.params['item'] + '/catchzones/' + item.name }">
                                            <v-icon color="white">edit</v-icon>
                                        </v-btn>

                                        <v-btn slot="activator" color="error" icon @click.native="remove(item.name)">
                                            <v-icon color="white">delete</v-icon>
                                        </v-btn>
                                    </td>
                                </template>
                            </v-data-table>

                            <div class="text-xs-center pt-2">
                                <v-pagination v-model="pagination.current" :length="pagination.total" @input="onPageChanged"></v-pagination>
                            </div>

                            <v-flex xs12 text-xs-right>
                                <v-btn :to="{ path: '/areas/' + $route.params['item'] + '/catchzones/create' }"> 
                                    Toevoegen
                                </v-btn>
                            </v-flex>
                        </v-card>
                    </v-flex>
                </v-layout>

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
    import { AreaApiClient, CatchZoneApiClient } from './../../../plugins/api-client';

    export default {
        data: () => ({
            position1: [0, 0],
            position2: [0, 0],
            center: [0, 0],
            
            item: {

            },

            valid: false,

            headers: [
                {
                    sortable: false,
                    text: 'Naam',
                    value: 'name'
                },
                {
                    width: '160',
                    sortable: false,
                }
            ],

            items: [

            ],

            pagination: {}
        }),

        async created() {
            await this.get();

            await CatchZoneApiClient().catchzonesGet(this.pagination.current || 1, 20, ['area:' + this.item.id]).then(result => {
                this.items = result.data;
                this.pagination.current = result.page;
                this.pagination.rowsPerPage = result.pageSize;
                this.pagination.total = result.pageCount;
            }).catch(() => {

            });
        },

        methods: {
            async get() {
                this.item = await AreaApiClient().areasIdGet(this.$route.params['item']);
                
                var lat = 0;
                var lon = 0;

                try {
                    lat = (this.item.lat1 + this.item.lat2) / 2;
                } catch {
                    
                }

                try {
                    lon = (this.item.lon1 + this.item.lon2) / 2;
                } catch {

                }

                this.center = [lat, lon];
                this.position1 = [this.item.lat1, this.item.lon1];
                this.position2 = [this.item.lat2, this.item.lon2];
            },
            
            async edit() {
                await AreaApiClient().areasIdPut(this.item, this.$route.params['item']).then(() => {
                    this.$router.push({ path: '/areas' });
                }).catch(() => {
                    this.$toast.error('Er is iets fout gegaan bij het bewerken. Probeer het later opnieuw');
                });
            },

            async remove(id) {
                await CatchZoneApiClient().catchzonesIdDelete(id);
                await this.onPageChanged();
            },

            async onPageChanged() {
                await this.get();

                await CatchZoneApiClient().catchzonesGet(this.pagination.current || 1, 20, ['area:' + this.item.id]).then(result => {
                    this.items = result.data;
                    this.pagination.current = result.page;
                    this.pagination.rowsPerPage = result.pageSize;
                    this.pagination.total = result.pageCount;
                }).catch(() => {

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
