
<template>
    <v-form v-model="valid">
        <v-container>
            <v-layout wrap>
                <v-flex xs12>
                    <v-text-field label="Naam" v-model="item.name" :rules="[v => !!v || 'De gebruikersnaam is verplicht']"/>
                </v-flex>

                <v-flex xs12>
                    <v-text-field label="Wachtwoord" v-model="item.password" :rules="[v => !!v || 'Het wachtwoord is verplicht']"/>
                </v-flex>

                <v-flex xs12>
                    <v-text-field label="Herhaal wachtwoord" type="password" v-model="repassword" :rules="[v => v === item.password || 'De wachtwoorden komen niet overeen']"/>
                </v-flex>

                <v-flex xs12 text-xs-right>
                    <v-btn @click="create" :disabled="!valid">
                        Opslaan
                    </v-btn>
                </v-flex>
            </v-layout>
        </v-container>
    </v-form>
</template>

<script>
    import {AuthenticationApiClient, User, UserApiClient} from './../../plugins/api-client';


    export default {
        data: () => ({
            item: {

            },

            repassword: null,

            valid: false,
        }),

        methods: {
            async create() {
                if (this.item.password === this.repassword) {
                    await UserApiClient().usersPost({name: this.item.name, password: this.item.password}).then(() => {
                        this.$router.push({path: '/users'});
                        this.$toast.succes('Nieuwe gebruiker aangemaakt');
                    }).catch((response) => {
                        if (response.status === 409) {
                            this.$toast.error('Er bestaat al een gebruiker met deze naam');
                            return;
                        }

                        this.$toast.error('Er is iets fout gegaan bij het aanmaken. Probeer het later opnieuw');
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
