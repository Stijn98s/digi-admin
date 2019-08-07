<template>
<v-app>
    <v-navigation-drawer :mini-variant.sync="miniVariant" :clipped="clipped" v-model="drawer" fixed app>
        <v-list>
            <v-list-tile router :to="item.to" :key="i" v-for="(item, i) in items">
                <v-list-tile-action>
                    <v-icon v-html="item.icon"></v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                    <v-list-tile-title v-text="item.title"></v-list-tile-title>
                </v-list-tile-content>
            </v-list-tile>

            <v-list-tile
                @click="logout"
            >
                <v-list-tile-action>
                    <v-icon v-html="'exit_to_app'"></v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                    <v-list-tile-title v-text="'Uitloggen'"></v-list-tile-title>
                </v-list-tile-content>
            </v-list-tile>
        </v-list>
    </v-navigation-drawer>
    <v-toolbar fixed app :clipped-left="clipped">
        <v-toolbar-side-icon @click="drawer = !drawer"></v-toolbar-side-icon>

        <v-toolbar-title v-text="title"></v-toolbar-title>
        <v-spacer></v-spacer>
    </v-toolbar>
    <v-content>
        <v-container>
            <nuxt />
        </v-container>
    </v-content>
</v-app>
</template>

<script>
export default {
    data() {
        return {
            clipped: true,
            drawer: true,
            fixed: false,
            items: [
                {
                    icon: 'terrain',
                    title: 'Gebieden',
                    to: '/areas'
                },
                {
                    icon: 'pets',
                    title: 'Organismes',
                    to: '/organisms'
                },
                {
                    icon: 'local_activity',
                    title: 'Tags',
                    to: '/tags'
                },
                {
                    icon: 'videogame_asset',
                    title: 'Spelers',
                    to: '/players'
                },
                {
                    icon: 'person',
                    title: 'Gebruikers',
                    to: '/users'
                }
            ],
            miniVariant: false,
            right: true,
            rightDrawer: false,
            title: 'Digicatch'
        }
    },

    methods: {
        logout() {
            this.$store.commit('destroyToken');
            this.$router.go();
        }
    }
}
</script>
