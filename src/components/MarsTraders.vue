<template>
	<div class="traders-select">
		<div class="traders-1_title">Trader 1</div>
		<select v-model="selectedTrader1" ref="dropdownObj">
			<option value="null" selected>Select</option>
			<option
				v-for="trader in traders"
				:disabled="trader.disabled"
				:value="trader"
				:key="trader.martianid"
			>
				{{ trader.name }}
			</option>
		</select>
	</div>
	<div class="traders-select">
		<div class="traders-1_title">Trader 2</div>
		<select v-model="selectedTrader2">
			<option value="null" selected>Select</option>
			<option
				v-for="trader in traders"
				:disabled="trader.disabled"
				:value="trader"
				:key="trader.martianid"
			>
				{{ trader.name }}
			</option>
		</select>
	</div>
</template>

<script>
import TradersData from "./TradersData";
export default {
	name: "MarsTraders",
	props: {
		title: String,
		traders: Array,
	},
	components: {},
	data() {
		return {
			selectedTrader1: null,
			selectedTrader2: null,
		};
	},
	mounted() {
		this.emitter.on("resetData", () => {
			this.selectedTrader1 = null;
			this.selectedTrader2 = null;
		});
	},
	watch: {
		selectedTrader1: function () {
			if (this.selectedTrader1 && this.selectedTrader1.martianid) {
				TradersData.buyFrom = {
					martianid: this.selectedTrader1.martianid,
					items: [],
				};
				this.traders.filter((trader) => {
					if (
						trader.martianid === this.selectedTrader1.martianid ||
						trader.martianid === this.selectedTrader2?.martianid
					) {
						return (trader.disabled = true);
					}
					return (trader.disabled = false);
				});
				this.emitter.emit("selectTrader1", this.selectedTrader1);
			}
		},
		selectedTrader2: function () {
			if (this.selectedTrader2 && this.selectedTrader2.martianid) {
				TradersData.sellTo = {
					martianid: this.selectedTrader2.martianid,
					items: [],
				};
				this.traders.filter((trader) => {
					if (
						trader.martianid === this.selectedTrader2.martianid ||
						trader.martianid === this.selectedTrader1?.martianid
					) {
						return (trader.disabled = true);
					}
					return (trader.disabled = false);
				});
				this.emitter.emit("selectTrader2", this.selectedTrader2);
			}
		},
	},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
select {
	background: none;
	border: none;
	color: #fff;
	display: block;
	height: 35px;
}

.traders-select {
	font-size: 12px;
	padding: 0 10px;
	margin: 0 30px;
	.traders-1_title {
		margin: 5px 0;
	}
}
</style>
