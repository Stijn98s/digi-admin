<template>
    <v-form v-model="valid">
        <v-container>
            <v-layout wrap>
                <v-flex xs12>
                    <v-text-field label="Gebruikersnaam" v-model="item.local.name" :rules="[v => !!v || 'De gebruikersnaam is verplicht']" />
                </v-flex>
                <v-flex xs12>
                    <v-text-field label="Wachtwoord" type="password" v-model="item.local.password" :rules="[v => !!v || 'Het wachtwoord is verplicht']" />
                </v-flex>
                <v-flex xs12>
                    <v-text-field label="Herhaal wachtwoord" type="password" v-model="repassword" :rules="[v => v === item.local.password || 'De wachtwoorden komen niet overeen']"/>
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
    import { UserApiClient } from './../../plugins/api-client';

    export default {
        data: () => ({
            item: {
                local: {}
            },

            valid: false,

            repassword: null
        }),

        created() {
            this.get();
        },

        methods: {
            async get() {
                this.item = await UserApiClient().usersIdGet(this.$route.params['item']);
            },
            
            async edit() {
                if (this.item.local.password === this.repassword) {
                    await UserApiClient().usersIdPut(this.item, this.$route.params['item']).then(() => {
                        this.$router.push({ path: '/users' });
                    }).catch(() => {
                        this.$toast.error('Er is iets fout gegaan bij het bewerken. Probeer het later opnieuw');
                    });
                } else {
                    this.$toast.error('De wachtwoorden moeten gelijk zijn.');
                }
            }
        }
    }
</script>

<style lang="scss" scoped> 

</style>
