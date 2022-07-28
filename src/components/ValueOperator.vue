<template>
	<div class="item-value-operator" :disabled="disabledOperator">
		<button class="btn" @click="minusCounter(item)" type="button" name="button">
			-
		</button>
		<span class="quantityBeingTraded">{{ traderCounter }}</span>
		/
		<span
			v-if="
				!trader.martianid ||
				(!trader.inventory.length &&
					!trader1.inventory.some(
						(inv) => inv.itemid !== item.itemid && inv.name !== item.name
					))
			"
			>0</span
		>
		<span
			class="quantityTraderHas"
			v-for="inventory in trader.inventory"
			:key="inventory.itemid"
			v-show="inventory.name === item.name"
		>
			<span>{{ inventory.quantity }}</span>
		</span>
		<button
			class="btn"
			@click.prevent="addCounter(item)"
			type="button"
			name="button"
		>
			+
		</button>
	</div>
</template>

<script>
import MartiansApi from "./MartiansApi";
import TradersData from "./TradersData";

export default {
	name: "ValueOperator",
	props: {
		item: Object,
		disabledOperator: Boolean,
		trader: Object,
		traderNumber: Number,
	},
	data() {
		return {
			traderCounter: 0,
			itemsList: [],
			trader1: {},
			trader2: {},
		};
	},
	mounted() {
		this.getItemsData();
		this.emitter.on("selectTrader1", (trader) => {
			this.trader1 = trader;
		});
		this.emitter.on("selectTrader2", (trader) => {
			this.trader2 = trader;
		});
		this.emitter.on("resetData", () => {
			this.traderCounter = 0;
		});
	},
	methods: {
		getItemsData() {
			MartiansApi.getItems()
				.then((response) => {
					this.itemsList = response.data.data;
				})
				.catch((e) => {
					console.log(e);
				});
		},
		addCounter(item) {
			this.trader.inventory.forEach((traderInv) => {
				if (traderInv.itemid === item.itemid) {
					if (this.traderCounter < traderInv.quantity) {
						if (this.traderNumber === 1) {
							this.traderCounter = this.traderCounter + 1;
							let itemIndex = TradersData.buyFrom.items
								.map((elem) => {
									return elem.itemid;
								})
								.indexOf(item.itemid);

							if (itemIndex === -1) {
								TradersData.buyFrom.items.push({
									itemid: item.itemid,
									quantity: this.traderCounter,
								});
							} else {
								TradersData.buyFrom.items[itemIndex].quantity =
									this.traderCounter;
							}
							this.computeTradersTotal("buyFrom");
						} else {
							this.traderCounter = this.traderCounter + 1;
							let itemIndex = TradersData.sellTo.items
								.map((elem) => {
									return elem.itemid;
								})
								.indexOf(item.itemid);

							if (itemIndex === -1) {
								TradersData.sellTo.items.push({
									itemid: item.itemid,
									quantity: this.traderCounter,
								});
							} else {
								TradersData.sellTo.items[itemIndex].quantity =
									this.traderCounter;
							}
							this.computeTradersTotal("sellTo");
						}
					}
				}
			});
		},
		minusCounter(item) {
			this.trader.inventory.forEach((traderInv) => {
				if (traderInv.itemid === item.itemid) {
					if (this.traderCounter > 0) {
						if (this.traderNumber === 1) {
							this.traderCounter = this.traderCounter - 1;
							let itemIndex = TradersData.buyFrom.items
								.map((elem) => {
									return elem.itemid;
								})
								.indexOf(item.itemid);

							TradersData.buyFrom.items[itemIndex].quantity =
								this.traderCounter;

							if (this.traderCounter === 0) {
								TradersData.buyFrom.items.splice(itemIndex, 1);
							}
							this.computeTradersTotal("buyFrom");
						} else {
							this.traderCounter = this.traderCounter - 1;
							let itemIndex = TradersData.sellTo.items
								.map((elem) => {
									return elem.itemid;
								})
								.indexOf(item.itemid);

							TradersData.sellTo.items[itemIndex].quantity = this.traderCounter;

							if (this.traderCounter === 0) {
								TradersData.sellTo.items.splice(itemIndex, 1);
							}
							this.computeTradersTotal("sellTo");
						}
					}
				}
			});
			this.emitter.emit("totalTrader2", this.selectedTrader2);
		},
		computeTradersTotal(trader) {
			let total = {};
			let allItemsTrader1 = [];
			let allItemsTrader2 = [];
			let trader1Total = 0;
			let trader2Total = 0;

			if (TradersData[trader].items.length === 0) {
				if (trader === "buyFrom") {
					trader1Total = 0;
					return this.emitter.emit("trader1Total", trader2Total);
				}
				trader2Total = 0;
				return this.emitter.emit("trader2Total", trader2Total);
			}

			TradersData[trader].items.map((itemTrade) => {
				this.itemsList.forEach((item) => {
					if (itemTrade.itemid === item.itemid) {
						total[item.name] = item.points * itemTrade.quantity;
						if (trader === "buyFrom") {
							allItemsTrader1.push(total[item.name]);

							trader1Total = allItemsTrader1.reduce((prev, next) => {
								return (this.trader1Total = prev + next);
							}, 0);
							this.emitter.emit("trader1Total", trader1Total);
						} else {
							allItemsTrader2.push(total[item.name]);
							trader2Total = allItemsTrader2.reduce((prev, next) => {
								if (next === 0) return 0;
								return (this.trader2Total = prev + next);
							}, 0);
							this.emitter.emit("trader2Total", trader2Total);
						}
					}
				});
			});
		},
	},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.item-value-operator {
	display: flex;
	width: 100px;
	justify-content: space-around;

	.quantity {
		-webkit-appearance: none;
		border: none;
		text-align: center;
		width: 30px;

		font-size: 16px;
		color: #43484d;
		font-weight: 300;
		border: 1px solid #e1e8ee;
	}
}
.item-value-operator[disabled="true"] {
	opacity: 0.4;
	pointer-events: none;
}
.btn {
	border-radius: 60px;
	border: 2px solid #fff;
	opacity: 1;
	font-size: 14px;

	cursor: pointer;

	&:hover {
		transition: 0.2s;
		transform: scale(1.2);
	}
}
</style>
