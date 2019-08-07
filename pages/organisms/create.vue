<template>
    <v-form v-model="valid">
        <v-container>
            <v-layout wrap>
                <v-flex xs12>
                    <v-text-field label="Naam" v-model="item.name" :rules="[v => !!v || 'De naam is verplicht']" />
                </v-flex>

                <v-flex xs12>
                    <v-text-field label="Beschrijving" v-model="item.description" :rules="[v => !!v || 'De beschrijving is verplicht']" />
                </v-flex>

                <v-flex xs12>
                    <file-upload url='https://api.imgur.com/3/image' btnLabel='Selecteer een afbeelding' btnUploadingLabel='Afbeelding versturen' :thumb-url='thumbUrl' :headers="headers" @change="onFileChange"></file-upload>
                </v-flex>

                <v-flex xs12>
                    <v-text-field label="Afbeelding" v-model="item.image" @input="onFileChange" disabled :rules="[v => !!v || 'De afbeelding is verplicht']" />
                </v-flex>

                <v-select
                        v-model="item.tags"
                        :items="tags"
                        chips
                        label="Tags"
                        item-text="name"
                        item-value="id"
                        multiple
                        solo
                ></v-select>

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
    import { OrganismApiClient, TagsApiClient } from './../../plugins/api-client';
    import FileUpload from '@stijn98s/v-file-upload';

    export default {
        data: () => ({
            item: {

            },

            valid: false,

            tags: [],
            
            headers: {'Authorization': 'Client-ID 29254565fdbcf6a'},
            fileUploaded: null,
        }),

        components: { 
            FileUpload 
        },

        async created() {
            await TagsApiClient().tagsGet().then(result => {  
                this.tags = result.data;
            });
        },

        methods: {
            async create() {
                await OrganismApiClient().organismsPost(this.item).then((response) => {
                    this.$router.push({path: '/organisms'});
                }).catch((response) => {
                    if (response.status === 409) {
                        this.$toast.error('Er bestaat al een organisme met deze naam');
                        return;
                    }

                    this.$toast.error('Er is iets fout gegaan bij het aanmaken. Probeer het later opnieuw');
                });
            },

            thumbUrl(file) {
                if (file.data != undefined) {
                    return file.data.link;
                }
            },

            onFileChange (file) {
                this.fileUploaded = file;
                this.item.image = file.data.link;
                this.$forceUpdate();
            }
        }
    }
</script>

<style lang="scss" scoped> 
</style>
