<template>
  <v-container>
    <v-row>
      <v-col cols="6">
        <v-card v-if="story" class="px-2" color="grey-darken-3">
          <v-card-item>
          <p v-html="story.main_text">
          </p>
          <v-radio-group v-model="selectedOption">
            <div v-for="(option, ix) in story.options">
              <v-radio :label="option.text" :value="ix">
              </v-radio>
            </div>
          </v-radio-group>
          </v-card-item>
          <v-card-actions>
            <v-btn block color="primary" variant="tonal" @click="selectOption"> Continue </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import useClient from "@/stores/ClientState";
import { Ref, ref } from "vue";
import { computed } from "vue";

const client = useClient();
const selectedOption: Ref<number> = ref(0);

const story = computed(() => {
  let phase = client.gamestate.phase;

  if ("ExplorePhase" in phase) return phase.ExplorePhase;
  else return null;
});

function selectOption() {
  let msg = {
    actionType: "selectStoryOptionAction",
    actionData: {option_ix: selectedOption.value, player_ix: 0}
  };

  console.log(msg);
  client.sendMessage("action", msg);
}
</script>

<style>
.storybook_bold {
  margin: 5px 0;
  display: block;
  font-weight: bold;
  font-size: 18px;
  color: white;
}
</style>

<style scoped>
.option {

}
</style>
