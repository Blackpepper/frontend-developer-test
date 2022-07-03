<template>
  <div class="actions flex justify-end">
    <button
      @click="$emit('resetTraders')"
      class="button reset"
    >
      RESET
    </button>

    <button
      @click="isTradeOpen = true"
      :disabled="isDisabled"
      class="button red trade"
    >
      TRADE
    </button>
  </div>

  <PopupConfirmTrade
    v-if="isTradeOpen"
    :headline="'Are you sure you want to make this trade?'"
    @confirm="confirmTrade"
  />

  <div
    v-if="message"
    class="popup-module"
    :class="{ 'success' : success }"
  >
    <span
      @click="message = ''"
      class="background"
    ></span>

    <div class="wrap">
      <h3>{{ message }}</h3>
      <p v-if="success">This page will reload in 3 seconds.</p>
    </div>
  </div>
</template>

<script>
import PopupConfirmTrade from '@/components/ConfirmModule.vue'

export default {
  components: {
    PopupConfirmTrade
  },

  emits: ['resetTraders'],

  props: {
    isDisabled: Boolean,
    traderOne: Object,
    traderTwo: Object,
    payload: Object
  },

  data: () => ({
    isTradeOpen: false,
    message: '',
    success: false
  }),

  methods: {
    confirmTrade(bool) {
      // make trade if it is confirmed in popup
      if (bool) {
        this.trade()
      }
      this.isTradeOpen = false
    },

    trade() {
      // finally make trade
      this.$api().post('/martian/trade', this.payload)
        .then((res) => {
          if (res.status === 200) {
            // success! set message, and reload page to see trades updated
            this.success = true
            this.message = res.data.data.message

            setTimeout(() => {
              this.$router.go()
            }, 3000)
          } else {
            // error
            this.success = false
            this.message = 'Sorry, something went wrong. Please try again.'
          }
        })
    }
  }
}
</script>

<style lang="scss">
  .actions {
    margin: 40px 0;

    .button {
      width: 208px;

      &.trade {
        margin-left: 24px;
      }
    }
  }
</style>