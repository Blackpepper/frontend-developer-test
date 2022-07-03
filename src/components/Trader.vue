<template>    
  <div
    v-for="item of inventory"
    :key="item.itemid"
  >
    <TradeItem
      :item="item"
    ></TradeItem>
  </div>
  <div class="total">
    {{ total }}
  </div>
</template>

<script>
import TradeItem from '@/components/TradeItem.vue'

export default {
  components: {
    TradeItem
  },

  emits: ['total', 'traderItems'],

  props: {
    trader: Object,
    items: Object
  },

  data: () => ({
    inventory: [{},{},{},{},{}]
  }),

  computed: {
    total() {
      let total = 0
      this.inventory.forEach(obj => total = total + obj.score)
      return total
    },

    payloadItems() {
      let items = this.inventory.filter(obj => obj.score !== 0)
      return items
    }
  },

  watch: {
    trader(newValue) {
      this.makeInventory()
    },

    payloadItems(newValue) {
      this.$emit('traderItems', newValue)
      this.$emit('total', this.total)
    }
  },

  mounted() {
    this.makeInventory()
  },

  methods: {
    makeInventory() {
      // create a new Array that holds all trader info in each Obj.
      // i will find users current 'qty', then add 'selected' and 'score'.
      this.inventory = []

      // loop all trading-items and add traders qty, selected, score
      this.items.forEach(element => {
        let qty = 0

        if (this.trader.inventory) {
          let item = this.trader.inventory.find(obj => obj.name === element.name)
          if (item !== undefined) {
            qty = item.quantity
          }
        }

        // make new object with correct qty & score(qty*points)
        let tradeditem = {
          itemid: element.itemid,
          name: element.name,
          points: element.points,
          quantity: qty,
          selected: 0,
          score: 0
        }

        this.inventory.push(tradeditem)
      })
    }
  }
  
}
</script>
