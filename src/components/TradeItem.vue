<template>
  <div
    class="item flex justify-between"
    :class="{ 'grey' : item.quantity === 0 }"
  >
    
    <button
      @click="updateQty('-')"
      :disabled="item.quantity === 0"
      class="circle"
    >
      -
    </button>

    <div class="amount">
      {{ item.selected }} / {{ item.quantity }}
    </div>

    <button
      @click="updateQty('+')"
      :disabled="item.quantity === 0"
      class="circle"
    >
      +
    </button>

  </div>
</template>

<script>
export default {
  props: {
    item: Object
  },

  methods: {
    updateQty(sign) {
      if (sign === '+') {
        if (this.item.selected !== this.item.quantity) {
          this.item.selected = this.item.selected + 1
        }
      } else {
        if (this.item.selected >= 1) {
          this.item.selected = this.item.selected - 1
        }
      }

      this.item.score = this.item.selected * this.item.points
    }
  }
}
</script>

<style lang="scss" scoped>
.item {
  width: 109px;

  @media (min-width: $medium) {
    width: 129px;
  }

  button.circle {
    width: 24px;
    height: 24px;

    font-size: 14px;
    line-height: 22px;
    color: white;

    border: 1px solid white;
    border-radius: 50%;

    transition: all 0.2s ease-in-out;

    &:hover {
      color: $color-4;

      background: $color-1;
      border-color: $color-1;
    }
  }

  .amount {
    width: 61px;

    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
    text-align: center;
    color: white;

    @media (min-width: $medium) {
      width: 81px;
    }
  }
}

.item.grey {
  button.circle {
    color: #7F7F7F;

    border-color: #7F7F7F;
  }

  .amount {
    color: #7F7F7F;
  }
}
</style>
