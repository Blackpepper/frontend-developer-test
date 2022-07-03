<template>
  <div class="form-field select">
    <select
      v-model="trader"
      @change="$emit('changeTrader', trader)"
    >
      <option :value="{}">Select</option>
      <option
        v-for="martian of martians"
        v-show="martian.allow === 1"
        :key="martian.martianid"
        :disabled="martian.martianid === otherTraderID"
        :value="martian"
      >
        {{ martian.name }}
      </option>
    </select>
  </div>
</template>

<script>
export default {
  props: {
    martians: Array,
    otherTraderID: Number
  },

  data: () => ({
    trader: {}
  }),

  methods: {
    clearTrader() {
      this.trader = {}
    }
  }
}
</script>