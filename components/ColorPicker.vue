<template>
  <v-menu
    :close-on-content-click="false"
    max-width="min-content"
    min-width="min-content"
    offset-y
    transition="scale-transition"
    v-model="show"
  >
    <template v-slot:activator="{ on }">
      <v-text-field
        :label="label"
        :rules="rules"
        v-model="value"
        onkeydown="return false"
        v-on="on"
      ></v-text-field>
    </template>
    <color-picker v-model="value" @changeColor="changeColor" style="width: min-content;"></color-picker>
  </v-menu>
</template>

<script>
    import ColorPicker from '@caohenghu/vue-colorpicker';

    export default {
        data: () => ({
            show: false,
        }),

        props: ['label', 'value', 'rules'],
        
        components:{
            ColorPicker,
        },

        methods: {
            changeColor(color) {
                const {rgba: {r, g, b, a}} = color;
                const hex = this.RGBAToHex(r, g, b, a);
                this.$emit('input', hex);
            },

            RGBAToHex(r,g,b,a) {
                r = r.toString(16);
                g = g.toString(16);
                b = b.toString(16);
                a = Math.round(a * 255).toString(16);

                if (r.length == 1) {
                    r = "0" + r;
                }

                if (g.length == 1) {
                    g = "0" + g;
                }

                if (b.length == 1) {
                    b = "0" + b;
                }

                if (a.length == 1) {
                    a = "0" + a;
                }

                this.$forceUpdate();
                return "#" + r + g + b ;
            }
        }
    }
</script>

<style lang="scss"></style>
