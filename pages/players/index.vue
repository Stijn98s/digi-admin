<template>
    <v-layout justify-center wrap>
        <v-flex xs12>
            <v-data-table :headers="headers" :items="items" hide-actions :pagination.sync="pagination">
                <template slot="header" slot-scope="{ header }">
                    <span v-text="header.text" />
                </template>
                <template slot="items" slot-scope="{ item }">
                    <td>{{ item.name }}</td>
                    <td>
                        <v-btn slot="activator" color="success" icon :to="{ path: '/players/' + item.name }">
                            <v-icon color="white">edit</v-icon>
                        </v-btn>

                        <v-btn slot="activator" color="error" icon @click.native.stop="openDialog(item.name)">
                            <v-icon color="white">delete</v-icon>
                        </v-btn>
                    </td>
                </template>
            </v-data-table>

            <div class="text-xs-center pt-2">
                <v-pagination v-model="pagination.current" :length="pagination.total" @input="onPageChanged"></v-pagination>
            </div>
            <v-dialog
                v-model="dialog"
                width="300"
                >     
                <v-card>
                        <v-card-text>
                    Weet je zeker dat je de speler met de naam: <b>{{tempName}}</b> wilt verwijderen?
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                            color="primary"
                            flat
                            @click.native="dialog = false"

                        >
                            Annuleren
                        </v-btn>
                        <v-btn
                            color="error"
                            flat
                            @click.native="remove(tempName)"

                        >
                            Verwijderen
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-flex>
    </v-layout>
</template>

<script>
    import { PlayerApiClient, Player } from './../../plugins/api-client';

    export default {
        data: () => ({
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
            pagination: {},
            dialog: false,
            tempName: null
        }),

        created() {
            this.get();
        },

        methods: {
            async get() {
                const elements = await PlayerApiClient().playersGet();
                this.items = elements.data;
                this.pagination.current = elements.page;
                this.pagination.rowsPerPage = elements.pageSize;
                this.pagination.total = elements.pageCount;
            },

            async remove(id) {
                await PlayerApiClient().playersIdDelete(id);
                this.get();
                this.dialog = false;
            },

            async onPageChanged() {
                const elements = await PlayerApiClient().playersGet(this.pagination.current);
                this.items = elements.data;
            },
            openDialog(name){
                this.tempName = name;
                this.dialog = true;
            }
        }
    }
</script>

<style lang="scss" scoped> 

</style>
