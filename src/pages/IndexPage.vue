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
                :options="[1, 2, 3]"
                label="Trader 1"
                input-style="color: white"
                dropdown-icon="keyboard_arrow_down"
              />
            </th>
            <th style="width: 300px">
              <q-select
                style="max-width: 200px"
                class="select"
                label-color="secondary"
                borderless
                placeholder="Select"
                v-model="traderTwo"
                :options="[1, 2, 3]"
                dropdown-icon="keyboard_arrow_down"
                label="Trader 2"
              />
            </th>
          </thead>

          <tbody>
            <tr
              v-for="(n, index) in 5"
              :key="index"
              :class="{ 'gradient-row': index % 2 == 0 }"
            >
              <td>Oxygen</td>
              <td><quantity-controller /></td>
              <td><quantity-controller /></td>
            </tr>

            <tr class="total-row">
              <td>Total</td>
              <td class="text-center text-h5">0</td>
              <td class="text-center text-h5">0</td>
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
            color="secondary"
            label="Reset"
            class="action-button"
          />

          <q-btn
            padding="md"
            rounded
            color="info"
            label="Outline Rounded"
            class="action-button"
          />
        </div>
      </div>
      <q-img
        width="1170px"
        height="1170px"
        class="mars-planet-img"
        src="mars-planet3.png"
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
      traderOne: "Select",
      traderTwo: "Select",
      martians: [
        {
          name: "Peter",
          inventory: [
            {
              itemid: 4,
              quantity: 0,
              name: "Medication",
              points: 2,
            },
            {
              itemid: 2,
              quantity: 0,
              name: "Water",
              points: 4,
            },
            {
              itemid: 1,
              quantity: 5,
              name: "Oxygen",
              points: 6,
            },
          ],
        },

        {
          name: "Griffin",
          inventory: [
            {
              itemid: 4,
              quantity: 0,
              name: "Medication",
              points: 2,
            },
            {
              itemid: 2,
              quantity: 0,
              name: "Water",
              points: 4,
            },
            {
              itemid: 1,
              quantity: 5,
              name: "Oxygen",
              points: 6,
            },
          ],
        },
      ],
    };
  },

  mounted() {
    this.getItems();
  },

  methods: {
    async getItems() {
      const response = await this.$api.get("/items");
      console.log(response);
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
