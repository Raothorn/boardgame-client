<template>
  <v-sheet>
    <v-container>
      <v-row>
        <v-col cols="1" class="d-flex justify-center">
          <div class="fill-height d-flex flex-column justify-space-evenly">
            <v-tooltip text="Home">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  density="compact"
                  icon="mdi-home-circle"
                  @click="client.selectPanel('home')"
                ></v-btn>
              </template>
            </v-tooltip>

            <v-tooltip text="Map">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  density="compact"
                  icon="mdi-map"
                  @click="client.selectPanel('map')"
                ></v-btn>
              </template>
            </v-tooltip>

            <v-tooltip text="Ship">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  density="compact"
                  icon="mdi-sail-boat"
                  @click="client.selectPanel('ship')"
                ></v-btn>
              </template>
            </v-tooltip>

            <v-menu :close-on-content-click="false">
              <template v-slot:activator="{ props }">
                <v-btn density="compact" icon="mdi-cog" v-bind="props"></v-btn>
              </template>

              <v-card color="on-surface">
                <v-container>
                  <v-row>
                    <v-col>
                      <v-switch
                        color="on-primary"
                        label="Debug view"
                        v-model="client.settings.debugMode"
                      ></v-switch>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card>
            </v-menu>

            <v-tooltip text="Restart">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  density="compact"
                  icon="mdi-restart"
                  @click="restart"
                ></v-btn>
              </template>
            </v-tooltip>
          </div>
        </v-col>

        <v-divider :vertical="true"></v-divider>

        <v-col cols="9">
          <v-virtual-scroll class="message_scroll" :items="client.messages">
            <template v-slot:default="{ item }">
              <Message :message="item"></Message>
            </template>
          </v-virtual-scroll>
        </v-col>
        <v-col cols="2" class="mx-auto">
          <ActionButton></ActionButton>
        </v-col>
      </v-row>
    </v-container>
  </v-sheet>
</template>

<script setup lang="ts">
import useClient from "../stores/ClientState";
import ActionButton from "./ActionButton.vue"
import Message from './Message.vue'

const client = useClient();

function restart() {
  client.sendMessage("restart", {});
  location.reload();
}

// Watchers
</script>

<style scoped>
.message_scroll {
  /* TODO don't hardcode this (css variables not working?)*/
  height: 26vh;
}
</style>
<style>
.v-btn__content {
  white-space: normal;
}
</style>
