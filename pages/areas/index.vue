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
                        <v-btn slot="activator" color="success" icon :to="{ path: '/areas/' + item.name }">
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
                <v-btn :to="{ path: '/areas/create' }"> 
                    Toevoegen
                </v-btn>
            </v-flex>
        </v-flex>
    </v-layout>
</template>

<script>
    import { AreaApiClient, Area } from './../../plugins/api-client';

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
            pagination: {}
        }),

        created() {
            this.get();
        },

        methods: {
            async get() {
                const elements = await AreaApiClient().areasGet();
                this.items = elements.data;
                this.pagination.current = elements.page;
                this.pagination.rowsPerPage = elements.pageSize;
                this.pagination.total = elements.pageCount;
            },

            async remove(id) {
                await AreaApiClient().areasIdDelete(id);
                this.get();
            },

            async onPageChanged() {
                const elements = await AreaApiClient().areasGet(this.pagination.current);
                this.items = elements.data;
            }
        }
    }
</script>

<style lang="scss" scoped> 

</style>
