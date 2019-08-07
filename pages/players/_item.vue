<template>
    <v-form v-model="valid">
        <v-container>
            <v-layout wrap>
                <v-flex xs12>
                    <v-text-field label="Naam" v-model="item.name" readonly :rules="[v => !!v || 'De naam is verplicht']" />
                </v-flex>

                <v-flex xs12>
                    <v-text-field label="Punten" type="number" v-model="item.points" :rules="[v => v !== '' || 'De punten is verplicht', v => v >= 0 || 'De punten moeten meer zijn dan of gelijk aan 0']" />
                </v-flex>

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
    import { PlayerApiClient } from './../../plugins/api-client';

    export default {
        data: () => ({
            item: {
                
            },

            valid: false,
        }),

        created() {
            this.get();
        },

        methods: {
            async get() {
                this.item = await PlayerApiClient().playersIdGet(this.$route.params['item']);
            },
            
            async edit() {
                this.item.points = parseInt(this.item.points);

                await PlayerApiClient().playersIdPut(this.item, this.$route.params['item']).then(() => {
                    this.$router.push({ path: '/catchzones' });
                }).catch((response) => {
                    this.$toast.error('Er is iets fout gegaan bij het bewerken. Probeer het later opnieuw');
                });

                this.$router.push({ path: '/players' });
            }
        }
    }
</script>

<style lang="scss" scoped> 

</style>
