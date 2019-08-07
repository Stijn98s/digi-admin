<template>
  <v-app id="login" class="primary">
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4 lg4>
            <v-card class="elevation-1 pa-3">
              <v-card-text>
                <div class="layout column align-center">
                  <h1 class="flex my-4 primary--text">Digicatch</h1>
                </div>
                <v-form>
                  <v-text-field
                    append-icon="person"
                    name="name"
                    label="Gebruikersnaam"
                    type="text"
                    v-model="item.name"
                  ></v-text-field>
                  <v-text-field
                    v-on:keyup.enter="login"
                    append-icon="lock"
                    name="password"
                    label="Wachtwoord"
                    id="password"
                    type="password"
                    v-model="item.password"
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn block color="primary" @click="login" :loading="loading">Inloggen</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
 import { AuthenticationApiClient } from './../plugins/api-client';

  export default {
    layout: "clean",

    meta: {
        noAuthRequired: true
    },

    data: () => ({
      loading: false,
      item: {
        name: "test@test.nl",
        password: "123kaas123"
      }
    }),

    methods: {
      async login() {
        this.loading = true;
        
        AuthenticationApiClient().authLocalPost(this.item).then((response) => {
          this.$store.commit('retrieveToken', response.jwt);
          this.$router.push("/");
        }).catch(() => {
          this.loading = false;
        });
      }
    }
  };
</script>

<style scoped lang="css">
  #login {
    height: 50%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    content: "";
    z-index: 0;
  }
</style>
