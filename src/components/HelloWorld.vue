<script setup lang="ts">
import { computed, ref } from "vue";
declare global {
  interface Window {
    NDEFReader: any;
  }
}

defineProps<{ msg: string }>();

const logBox = ref("");

function log(message: string) {
  logBox.value += message + "\n";
}

async function scan() {
  log("User clicked scan button");

  try {
    const ndef = new window.NDEFReader();
    await ndef.scan();
    log("> Scan started");

    ndef.addEventListener("readingerror", () => {
      log("Argh! Cannot read data from the NFC tag. Try another one?");
    });

    ndef.addEventListener("reading", ({ message, serialNumber }: any) => {
      log(`> Serial Number: ${serialNumber}`);
      log(`> Records: (${message.records.length})`);
    });
  } catch (error) {
    log("Argh! " + error);
  }
}

const computedLogs = computed(() => {
  return !("NDEFReader" in window)
    ? "Web NFC is not available. Use Chrome on Android."
    : logBox.value;
});
</script>

<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <button type="button" @click="scan">Scan</button>
    <!-- <button type="button" @click="write">Write</button>
    <button type="button" @click="makeReadOnly">Make Read-Only</button> -->
  </div>

  <div>
    <textarea name="logs" id="logs" cols="30" rows="10">
      {{ computedLogs }}
    </textarea>
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
