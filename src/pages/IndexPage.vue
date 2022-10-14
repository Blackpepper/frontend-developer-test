<template>
  <q-page>
    <div class="container q-ma-md">
      <span class="title text-white text-uppercase">Mars Trading Platform</span>
      <div class="mars-planet-img" />

      <div class="container__body">
        <table class="table">
          <thead>
            <th />
            <th style="width: 300px">
              <q-select
                style="max-width: 200px"
                class="select"
                label-color="secondary"
                borderless
                v-model="traderOne"
                :options="martians"
                :option-label="(martian) => martian.name"
                label="Trader 1"
                input-style="color: white"
                dropdown-icon="keyboard_arrow_down"
              />
            </th>
            <th style="width: 300px">
              <q-select
                style="max-width: 200px"
                class="select"
                :options="martians"
                :option-label="(martian) => martian.name"
                label-color="secondary"
                borderless
                placeholder="Select"
                v-model="traderTwo"
                dropdown-icon="keyboard_arrow_down"
                label="Trader 2"
              />
            </th>
          </thead>

          <tbody>
            <tr
              v-for="(item, index) in items"
              :key="item.id"
              :class="{ 'gradient-row': index % 2 == 0 }"
            >
              <td>{{ item.name }}</td>
              <td>
                <quantity-controller
                  :item="item"
                  :max="item.availableQtyOne"
                  @updateQty="updateQty('quantityOne', index, $event)"
                />
              </td>
              <td>
                <quantity-controller
                  :item="item"
                  :max="item.availableQtyTwo"
                  @updateQty="updateQty('quantityTwo', index, $event)"
                />
              </td>
            </tr>

            <tr class="total-row">
              <td>Total</td>
              <td class="text-center text-h5">{{ totalTraderOne }}</td>
              <td class="text-center text-h5">{{ totalTraderTwo }}</td>
            </tr>
          </tbody>
        </table>
        <div
          class="container--actions row items-center justify-end q-pt-md q-gutter-x-md"
        >
          <q-btn
            padding="md"
            outline
            rounded
            @click="reset"
            color="secondary"
            label="Reset"
            class="action-button"
          />

          <q-btn
            :loading="loading"
            padding="md"
            :disable="!tradable"
            rounded
            @click="handleTrade"
            :color="tradable ? 'primary' : 'info'"
            label="Trade"
            class="action-button"
          />
        </div>
      </div>
      <q-img
        width="1170px"
        height="1170px"
        class="mars-planet-img"
        src="mars-planet.png"
      />
    </div>
  </q-page>
</template>

<script>
import QuantityController from "src/components/QuantityController.vue";

export default {
  name: "IndexPage",
  components: { QuantityController },
  data() {
    return {
      traderOne: "",
      traderTwo: "",
      martians: [],
      items: [],
      loading: false,
    };
  },

  mounted() {
    this.fetchData();
  },

  watch: {
    traderOne: {
      handler(newVal) {
        this.isTraderSelected(newVal, "availableQtyOne");
      },
    },
    traderTwo: {
      handler(newVal) {
        this.isTraderSelected(newVal, "availableQtyTwo");
      },
    },
  },

  computed: {
    totalTraderOne() {
      return this.items.reduce((acc, item) => {
        return acc + item.quantityOne * item.points;
      }, 0);
    },

    totalTraderTwo() {
      return this.items.reduce((acc, item) => {
        return acc + item.quantityTwo * item.points;
      }, 0);
    },

    tradable() {
      return (
        this.totalTraderOne === this.totalTraderTwo &&
        this.totalTraderOne &&
        this.totalTraderTwo
      );
    },
  },

  methods: {
    reset() {
      this.traderOne = "";
      this.traderTwo = "";
      this.fetchData()
    },

    setInitialItems(items = this.items) {
      return items.map((item) => ({
        ...item,
        quantityOne: 0,
        quantityTwo: 0,
        availableQtyOne: 0,
        availableQtyTwo: 0,
      }));
    },
    updateQty(trader, index, quantity) {
      this.items[index][trader] = quantity;
      this.$forceUpdate();
    },
    async fetchData() {
      const martians = this.$api.get("/martian");
      const items = this.$api.get("/martian/items");
      const [itemsRes, martianRes] = await Promise.all([items, martians]);

      const allowedMartians = martianRes.data.data
        .filter((martian) => martian.allow)
        .map((_martian) => ({ ..._martian, disable: false }));

      this.items = this.setInitialItems(itemsRes.data.data);
      this.martians = allowedMartians;
    },

    isTraderSelected(martian, trader) {

      this.setQty(martian.inventory, trader);
      this.disableTraderSelected(martian.martianid);
    },

    setQty(inventory, trader) {
      if (inventory?.length) {
        this.items = this.items.map((item) => {
          inventory.forEach((inv) => {
            if (inv.itemid === item.itemid) item[trader] = inv.quantity;
          });

          return item;
        });
      } else {
        this.items = this.items.map((item) => ({ ...item, [trader]: 0 }));
      }
    },

    async handleTrade() {
      this.loading = true;
      const itemOne = this.items
        .filter((item) => item.quantityOne)
        .map((_item) => ({
          itemid: _item.itemid,
          quantity: _item.quantityOne,
        }));

      const itemTwo = this.items
        .filter((item) => item.quantityTwo)
        .map((_item) => ({
          itemid: _item.itemid,
          quantity: _item.quantityTwo,
        }));
      const payload = {
        buyFrom: {
          martianid: this.traderOne.martianid,
          items: itemOne,
        },

        sellTo: {
          martianid: this.traderTwo.martianid,
          items: itemTwo,
        },
      };

      try {
        await this.$api.post("/martian/trade", payload);

        this.$q.notify({
          iconSize: '2rem',
          position: 'top',
          message: "Items traded successfully",
          type: "positive",
          color:'primary',
        });
      } catch (err) {
        this.$q.notify({
          iconSize: '2rem',
          position: 'top',
          message: 'Something went wrong, please try again later',
          type: "negative",
        });
      }

      this.loading = false;
    },

    disableTraderSelected(id) {
      this.martians = this.martians.map((martian) => {
        if (
          martian.martianid === id ||
          this.traderOne?.martianid === martian.martianid ||
          this.traderTwo?.martianid === martian.martianid
        )
          martian.disable = true;
        else martian.disable = false;
        return martian;
      });
    },
  },
};
</script>
<style scoped lang="scss">
@import "src/css/quasar.variables";
.container {
  margin-top: 50px;
  .title {
    font-weight: 500;
    font-size: 14px;
  }

  &__body {
    margin-top: 5rem;
    width: 60%;
    table {
      border-collapse: collapse;
    }
    .table {
      width: 100%;
      color: white;
      th,
      td {
        padding: 20px;
      }

      .total-row {
        td {
          padding: 30px 20px;
        }

        border-bottom: 1px solid $info;
      }
    }
  }

  &--actions {
    .action-button {
      width: 200px;
    }
  }
  .mars-planet-img {
    z-index: -1;
    position: fixed;
    bottom: -30vh;
    right: -25%;
  }
}
</style>
