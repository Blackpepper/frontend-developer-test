<template>
	<div class="traders-select">
		<div class="traders-title">Trader 1</div>
		<select v-model="selectedTrader1" ref="dropdownObj" class="select-trader">
			<option value="null" selected>Select</option>
			<option
				v-for="trader in traders"
				:disabled="trader === selectedTrader2"
				:value="trader"
				:key="trader.martianid"
			>
				{{ trader.name }}
			</option>
		</select>
	</div>
	<div class="traders-select">
		<div class="traders-title">Trader 2</div>
		<select v-model="selectedTrader2">
			<option value="null" selected>Select</option>
			<option
				v-for="trader in traders"
				:disabled="trader === selectedTrader1"
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
				this.emitter.emit("selectTrader1", this.selectedTrader1);
			}
		},
		selectedTrader2: function () {
			if (this.selectedTrader2 && this.selectedTrader2.martianid) {
				TradersData.sellTo = {
					martianid: this.selectedTrader2.martianid,
					items: [],
				};
				this.emitter.emit("selectTrader2", this.selectedTrader2);
			}
		},
	},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.traders-select {
	padding: 0 10px;
	box-sizing: border-box;
	margin-left: 95px;

	.traders-title {
		margin: 5px;
		font-size: 12px;
		text-align: left;
	}
}
select {
	background: none;
	border: none;
	color: #fff;
	display: block;
	height: 35px;
	width: 140px;
	font-weight: 700;
	font-size: 14px;
}
</style>
