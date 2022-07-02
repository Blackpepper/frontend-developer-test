<template>
  <div class="popup-module small">
    <span @click="$emit('confirm', false)" class="background"></span>

    <div class="wrap">
      <p>{{ headline }}</p>

      <div class="form">

        <div class="buttons flex justify-between">
          <button
            @click="$emit('confirm', false)"
            class="button border-grey"
          >
            CANCEL
          </button>

          <button
            @click="$emit('confirm', true)"
            class="button red"
          >
            CONFIRM
          </button>
        </div>
      </div>

    </div>

  </div>
</template>

<script>
export default {
  props: {
    headline: String
  }
}
</script>