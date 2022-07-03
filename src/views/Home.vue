<template>
  <section class="page-home">
    <div class="content-max-width" v-if="loadedMartians && loadedItems">

      <div class="platform">

        <div class="selection flex">
          <div class="col titles">&nbsp;</div>

          <div class="col trader-one">
            <h4>Trader 1</h4>

            <SelectTrader
              ref="selectedOne"
              :martians="martians"
              :otherTraderID="traderTwo.martianid || 0"
              @changeTrader="(trader) => traderOne = trader"
            />
          </div>

          <div class="col trader-two">
            <h4>Trader 2</h4>

            <SelectTrader
              ref="selectedTwo"
              :martians="martians"
              :otherTraderID="traderOne.martianid || 0"
              @changeTrader="(trader) => traderTwo = trader"
            />
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
              @traderItems="updateBuyPayload"
              @total="(n) => traderOneTotal = n"
            />
          </div>

          <div class="col trader-two">
            <Trader
              v-if="traderTwo"
              :trader="traderTwo"
              :items="items"
              @traderItems="updateSellPayload"
              @total="(n) => traderTwoTotal = n"
            />
          </div>
        </div>


        <FinalActions
          :isDisabled="isDisabled"
          :traderOne="traderOne"
          :traderTwo="traderTwo"
          :payload="payload"
          @resetTraders="reset"
        />

      </div>  

    </div>
  </section>
</template>

<script>
import Trader from '@/components/Trader.vue'
import SelectTrader from '@/components/SelectTrader.vue'
import FinalActions from '@/components/FinalActions.vue'

export default {
  components: {
    Trader,
    SelectTrader,
    FinalActions
  },

  data: () => ({
    loadedItems: false,
    loadedMartians: false,

    items: [],
    martians: [],

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
    // if params have IDs existing set those traders as selected
    if (this.$route.params) {
      console.log(this.$route.params.traderOneId)
    }

    this.getMartians()
    this.getItems()
  },

  methods: {
    async getMartians() {
      const response = await this.$api().get('/martian')
      this.martians = response.data.data
      this.loadedMartians = true
    },

    async getItems() {
      const response = await this.$api().get('/martian/items')
      this.items = response.data.data
      this.loadedItems = true
    },

    updateBuyPayload(items) {
      this.payload.buyFrom.items = this.trimmedItems(items)
      this.payload.buyFrom.martianid = this.traderOne.martianid
    },

    updateSellPayload(items) {
      this.payload.sellTo.items = this.trimmedItems(items)
      this.payload.sellTo.martianid = this.traderTwo.martianid
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
      this.$refs.selectedOne.clearTrader()
      this.$refs.selectedTwo.clearTrader()
      this.payload.buyFrom.items = []
      this.payload.sellTo.items = []
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
          width: 170px;
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
    }
  }
</style>
