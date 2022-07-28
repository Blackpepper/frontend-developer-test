<template>
	<div class="total-trades">
		<div class="total-trades__name">Total</div>
		<div class="total-trades__trader">{{ trader1Total || 0 }}</div>
		<div class="total-trades__trader">{{ trader2Total || 0 }}</div>
	</div>
	<div class="buttons">
		<button
			class="btn-reset"
			:disabled="trader1Total === 0 && trader2Total === 0"
			@click="resetTrade"
		>
			Reset
		</button>
		<button
			class="btn-trade"
			:disabled="
				trader1Total !== trader2Total ||
				trader1Total === 0 ||
				trader2Total === 0
			"
			@click="submitTrade"
		>
			Trade
		</button>
	</div>
</template>

<script>
import MartiansApi from "./MartiansApi";
import TradersData from "./TradersData";

export default {
	name: "MartiansTotalTrades",
	props: {
		item: Object,
		disabledOperator: Boolean,
		trader: Object,
	},
	data() {
		return {
			trader1Total: 0,
			trader2Total: 0,
			tradersApiData: {},
		};
	},
	mounted() {
		this.tradersApiData = TradersData;

		console.log(this.tradersApiData);
		this.emitter.on("selectTrader1", (trader) => {
			this.trader1 = trader;
			this.traderCounter = 0;
		});
		this.emitter.on("selectTrader2", (trader) => {
			this.trader2 = trader;
			this.traderCounter = 0;
		});
		this.emitter.on("trader1Total", (total) => {
			this.trader1Total = total;
		});
		this.emitter.on("trader2Total", (total) => {
			this.trader2Total = total;
		});
	},
	methods: {
		resetTrade() {
			this.emitter.emit("resetData");
			this.tradersApiData = {};
			TradersData.buyFrom = {};
			TradersData.sellTp = {};
			this.trader1Total = 0;
			this.trader2Total = 0;
		},
		submitTrade() {
			this.tradersApiData = TradersData;
			MartiansApi.trade(this.tradersApiData)
				.then(() => {
					alert("Trade Successful! :)");
					this.resetTrade();
				})
				.catch(() => {
					alert("Trade Unsuccessful! :(");
				});
		},
	},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.total-trades {
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 40%;
	padding: 20px;
	border-bottom: 1px solid #555;
	color: #fff;
	box-sizing: border-box;
	.total-trades__name {
		max-width: 100px;
		flex-basis: 30%;
	}
	.total-trades__trader {
		text-align: center;
		flex-basis: 10%;
		display: flex;
	}
}
.buttons {
	width: 38%;
	height: 60px;
	text-align: center;
	padding: 20px;
	display: flex;
	justify-content: flex-end;
	align-items: center;

	button {
		flex-basis: 30%;
		border: 0;
		margin: 0 10px;
		height: 50px;
		padding: 10px 20px;
		box-sizing: border-box;
		display: inline-block;
		border-radius: 100px;
		text-align: center;
		color: #fff;
		transition: 0.3s;
		cursor: pointer;
	}
	button:disabled {
		opacity: 0.4;
		pointer-events: none;
	}
	.btn-reset {
		background: none;
		border: 1px solid #fff;
		transition: 0.3s;

		&:hover {
			border: none;
			transition: 0.3s;
			background: #ff3a44;
			opacity: 0.8;
		}
	}
	.btn-trade {
		background: #ff3a44;
		transition: 0.3s;
		&:hover {
			transition: 0.3s;
			opacity: 0.8;
		}
	}
}
</style>
