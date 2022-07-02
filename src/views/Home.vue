<template>
  <section class="page-home">
    <div class="content-max-width" v-if="loadedMartians && loadedItems">

      <div class="platform">

        <div class="selection flex">
          <div class="col titles">&nbsp;</div>

          <div class="col trader-one">
            <h4>Trader 1</h4>

            <SelectTrader
              :martians="martians"
              :otherTraderID="traderTwo.martianid"
              @changeTrader="(n) => traderOne = n"
            ></SelectTrader>
          </div>

          <div class="col trader-two">
            <h4>Trader 2</h4>

            <SelectTrader
              :martians="martians"
              :otherTraderID="traderOne.martianid"
              @changeTrader="(n) => traderTwo = n"
            ></SelectTrader>
          </div>
        </div>

        <div class="items flex">
          <div class="col titles">
            <div
              v-for="item of items"
              :key="item.itemid"
            >
              <p>{{ item.name }}</p>
            </div>
            <div>
              <p>Total</p>
            </div>
          </div>

          <div class="col trader-one">
            <Trader
              v-if="traderOne"
              :trader="traderOne"
              :items="items"
              @traderItems="updateBuyFromItems"
              @total="(n) => traderOneTotal = n"
            ></Trader>
          </div>

          <div class="col trader-two">
            <Trader
              v-if="traderTwo"
              :trader="traderTwo"
              :items="items"
              @traderItems="updateSellToItems"
              @total="(n) => traderTwoTotal = n"
            ></Trader>
          </div>
        </div>

        <div class="actions flex justify-end">
          <button
            @click="reset()"
            class="button reset"
          >
            RESET
          </button>

          <button
            @click="trade()"
            :disabled="isDisabled"
            class="button trade"
          >
            TRADE
          </button>
        </div>

      </div>  

    </div>
  </section>
</template>

<script>
import Trader from '@/components/Trader.vue'
import SelectTrader from '@/components/SelectTrader.vue'

export default {
  components: {
    Trader,
    SelectTrader
  },

  data: () => ({
    items: [],
    martians: [],
    loadedItems: false,
    loadedMartians: false,
    traderOne: {},
    traderOneTotal: 0,
    traderTwo: {},
    traderTwoTotal: 0,
    payload: {
      buyFrom: {
        martianid: 0,
        items: []
      },
      sellTo: {
        martianid: 0,
        items: []
      }
    }
  }),

  computed: {
    isDisabled() {
      if (this.traderOneTotal === 0 || this.traderTwoTotal === 0) {
        return true
      } else {
        if (this.traderOneTotal === this.traderTwoTotal) {
          return false
        } else {
          return true
        }
      }
    }
  },

  mounted() {
    this.getMartians()
    this.getItems()
  },

  methods: {
    getMartians() {
      this.$api().get('/martian')
        .then((res) => {
          if (res.status === 200) {
            this.martians = res.data.data

            this.loadedMartians = true
            this.traderOne = this.martians[0]
            this.traderTwo = this.martians[1]
          } else {
            // error
          }
        })
    },

    getItems() {
      this.$api().get('/martian/items')
        .then((res) => {
          if (res.status === 200) {
            this.items = res.data.data
            // console.log('home', res.data.data)

            this.loadedItems = true
          } else {
            // error
          }
        })
    },

    updateBuyFromItems(items) {
      this.payload.buyFrom.items = this.trimmedItems(items)
    },

    updateSellToItems(items) {
      this.payload.sellTo.items = this.trimmedItems(items)
    },

    trimmedItems(items) {
      // trim items to only send itemid and quantity
      let trimmedItems = []
      items.forEach(obj => {
        let item = {
          itemid: obj.itemid,
          quantity: obj.selected
        }
        trimmedItems.push(item)
      })
      return trimmedItems
    },

    reset() {
      this.traderOne = {}
      this.traderTwo = {}
      this.payload.buyFrom.items = []
      this.payload.sellTo.items = []
    },

    trade() {
      // add correct ids to buyer and seller
      this.payload.buyFrom.martianid = this.traderOne.martianid
      this.payload.sellTo.martianid = this.traderTwo.martianid

      this.$api().post('/martian/trade', this.payload)
        .then((res) => {
          if (res.status === 200) {
            console.log('home', res)
          } else {
            // error
          }
        })
    }
  }
}
</script>

<style lang="scss">
  .page-home {
    position: relative;

    .platform {
      position: relative;
      z-index: 2;

      width: 100%;

      @media (min-width: $mediumish) {
        width: 656px;
      }

      .col {
        & > div {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          width: 100%;
          height: 88px;

           p {
            margin: 0 0 0 6px;

            font-size: 12px;
            line-height: 24px;
            font-weight: 300;

            @media (min-width: $medium) {
              margin: 0 0 0 46px;

              font-size: 16px;
            }
           }
        }

        .total {
          font-size: 24px;
          line-height: 24px;
          text-align: center;
          color: $color-1;

          @media (min-width: $medium) {
            padding-left: 55px;
          }
        }
      }

      .col.titles {
        width: 20%;

        @media (min-width: $medium) {
          width: 34%;
        }
      }

      .col.trader-one {
        width: 40%;
        @media (min-width: $medium) {
          width: 34%;
        }
      }

      .col.trader-two {
        width: 40%;

        @media (min-width: $medium) {
          width: 32%;
        }
      }

      .selection {
        h4 {
          margin-bottom: 0px;

          font-weight: 300;
          font-size: 12px;
          line-height: 16px;
          letter-spacing: 0;
        }

        .form-field {
          margin-bottom: 14px;
          height: auto;
        }
      }

      .items {
        .col {
          & > div {
            &:nth-of-type(odd) {
              background: rgba(255, 255, 255, 0.1);
            }

            &:last-of-type {
              border-bottom: 1px solid #494949;
            }
          }
        }
      }

      .actions {
        margin: 40px 0;

        .button {
          width: 208px;

          &.trade {
            margin-left: 24px;
          }
        }
      }
    }
  }
</style>
