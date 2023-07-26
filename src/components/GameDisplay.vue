<template>
    <v-card variant="outlined">
        <v-table>
            <tbody>
                <tr v-for="(value, key) in gamestate">
                    <td> {{ key }}</td>
                    <td> {{ value }}</td>
                </tr>
            </tbody>
        </v-table>
    </v-card>
</template>

<script setup lang="ts">
const props = defineProps(['gamestate']);
</script>
