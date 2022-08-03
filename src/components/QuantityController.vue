<template>
  <div class="row justify-between items-center control-container">
    <q-btn :disable="!current" @click="manageQty('minus')"  size="10px" round color="info" icon="remove" outline />
    {{ `${current} / ${max}` }}
    <q-btn :disable="current >= max" @click="manageQty('add')" size="10px" round color="info" icon="add" outline />
  </div>
</template>

<script>
export default {
  name: "QuantityController",
  data() {
    return {
      current: 0,
      max: 10,
    };
  },

  methods: {
    manageQty(operation) {
      if(operation === 'minus') this.current --
      if(operation === 'add') this.current ++
    }

  }
};
</script>

<style lang="scss" scoped>
.control-container {
  width: 150px;
}
</style>
