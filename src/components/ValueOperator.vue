<template>
	<div class="item-value-operator" :disabled="disabledOperator">
		<button
			class="btn btn-minus"
			@click="minusCounter(item)"
			type="button"
			name="button"
		></button>
		<div class="item-value-operator__values">
			<div class="quantity-being-traded">{{ traderCounter }}</div>
			/
			<div
				class="quantity-trader-has"
				v-if="!trader.martianid || !trader.inventory.length"
			>
				0
			</div>
			<div
				class="quantity-trader-has"
				v-for="inventory in trader.inventory"
				:key="inventory.itemid"
				v-show="inventory.name === item.name"
			>
				<span>{{ inventory.quantity }}</span>
			</div>
		</div>
		<button
			class="btn btn-plus"
			@click.prevent="addCounter(item)"
			type="button"
			name="button"
		></button>
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
.btn {
	border-radius: 60px;
	background: none;
	opacity: 1;
	cursor: pointer;
	width: 24px;
	height: 24px;
	color: #7f7f7f;
	display: flex;
	justify-content: center;
	align-items: center;

	span {
		font-size: 24px;
	}

	&:hover {
		transition: 0.2s;
		transform: scale(1.2);
	}
}

.item-value-operator {
	display: flex;
	justify-content: space-between;

	.item-value-operator__values {
		font-size: 16px;
		font-weight: 400;
		width: 48px;
		display: flex;
		justify-content: center;

		.quantity-being-traded {
			padding: 0 5px;
		}
		.quantity-trader-has {
			padding: 0 5px;
		}
	}
	.btn {
		border: 1px solid #fff;
		color: #fff;
	}
	.btn-minus {
		margin-right: 20px;
		&:before {
			content: "-";
			position: relative;
			font-size: 24px;
			top: -1px;
			color: #fff;
		}
	}
	.btn-plus {
		margin-left: 20px;
		&:before {
			content: "+";
			position: relative;
			font-size: 20px;
			top: 0px;
			color: #fff;
		}
	}
}
.item-value-operator[disabled="true"] {
	pointer-events: none;
	color: #7f7f7f;

	.item-value-operator__values {
		font-size: 16px;
		font-weight: 400;
		width: 48px;
		display: flex;
		justify-content: center;

		.quantity-being-traded {
			padding: 0 5px;
		}
		.quantity-trader-has {
			padding: 0 5px;
		}
	}
	.btn {
		border: 1px solid #7f7f7f;
		color: #fff;
	}
	.btn-minus {
		margin-right: 20px;
		&:before {
			color: #7f7f7f;
		}
	}
	.btn-plus {
		margin-left: 20px;
		&:before {
			color: #7f7f7f;
		}
	}
}
</style>
