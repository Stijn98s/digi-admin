<template>
    <v-form v-model="valid">
        <v-container>
            <v-layout wrap>
                <v-flex xs12>
                    <v-text-field label="Naam" v-model="item.name" :rules="[v => !!v || 'De naam is verplicht']" />
                </v-flex>

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
    import { AreaApiClient } from './../../plugins/api-client';

    export default {
        data: () => ({
            item: {

            },

            valid: false,
        }),

        async created() {

        },

        methods: {
            async create() {
                await AreaApiClient().areasPost(this.item).then((response) => {
                    this.$router.push({ path: `/areas/${response.name}` });
                }).catch((response) => {
                    if (response.status === 409) {
                        this.$toast.error('Er bestaat al een gebied met deze naam');
                        return;
                    }

                    this.$toast.error('Er is iets fout gegaan bij het aanmaken. Probeer het later opnieuw');
                });
            }
        }
    }
</script>

<style lang="scss" scoped> 

</style>
