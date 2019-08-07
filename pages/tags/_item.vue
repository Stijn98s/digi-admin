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

                <v-flex xs12>
                    <color-picker v-model="item.color" label="Kleur" :rules="[v => !!v || 'De kleur is verplicht']" />
                </v-flex>

                <v-flex xs12>
                    <file-upload url='https://api.imgur.com/3/image' btnLabel='Selecteer een afbeelding' btnUploadingLabel='Afbeelding versturen' :thumb-url='thumbUrl' :headers="headers" @change="onFileChange"></file-upload>
                </v-flex>

                <v-flex xs12>
                    <v-text-field label="Afbeelding" v-model="item.image" @input="onFileChange" disabled :rules="[v => !!v || 'De afbeeling is verplicht']" />
                </v-flex>

                <v-flex xs12>
                    <v-textarea label="Beschrijving" v-model="item.description" :rules="[v => !!v || 'De beschrijving is verplicht']" />
                </v-flex>

                <v-flex xs12 text-xs-right>
                    <v-btn @click="edit" :disabled="!valid">
                        Aanpassen
                    </v-btn>
                </v-flex>
            </v-layout>
        </v-container>
    </v-form>
</template>

<script>
    import ColorPicker from '../../components/ColorPicker';
    import {TagsApiClient} from "../../plugins/api-client";
    import FileUpload from '@stijn98s/v-file-upload';

    export default {
        data: () => ({
            item: {

            },

            valid: false,

            headers: {'Authorization': 'Client-ID 29254565fdbcf6a'},
            fileUploaded: null,
        }),

        components:{
            ColorPicker,
            FileUpload
        },

        async created() {
            await this.get();
        },

        methods: {
            async get() {
                this.item = await TagsApiClient().tagsIdGet(this.$route.params['item']);
            },
            
            async edit() {
                this.item.points = parseInt(this.item.points);

                await TagsApiClient().tagsIdPut(this.item, this.$route.params['item']).then(() => {
                    this.$router.push({ path: '/tags' });
                }).catch(() => {
                    this.$toast.error('Er is iets fout gegaan bij het aanmaken. Probeer het later opnieuw');
                });
            },

            thumbUrl(file) {
                if(file.data != undefined){
                    return file.data.link;
                }

                if(this.item.image && this.item.image.match(/\.(jpeg|jpg|gif|png)$/) != null){
                    return this.item.image;
                }
            },

            onFileChange(file) {
                this.fileUploaded = file;
                this.item.image = file.data.link;
                this.$forceUpdate();
            }
        }
    }
</script>

<style lang="scss" scoped> 

</style>

