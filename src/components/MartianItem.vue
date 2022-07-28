<template>
	<div class="item-name">{{ item.name }}</div>
	<ValueOperator
		:disabledOperator="!trader1.martianid"
		:item="item"
		:traderNumber="1"
		:trader="trader1"
		:traderCounter="traderCounter1"
	/>
	<ValueOperator
		:disabledOperator="!trader2.martianid"
		:item="item"
		:traderNumber="2"
		:trader="trader2"
		:traderCounter="traderCounter2"
	/>
</template>

<script>
import MartiansApi from "./MartiansApi";
import ValueOperator from "./ValueOperator.vue";

export default {
	name: "MartianItems",
	props: {
		item: Object,
	},
	components: {
		ValueOperator,
	},
	data() {
		return {
			traderCounter1: 0,
			traderCounter2: 0,
			items: [],
			trader1: {},
			trader2: {},
		};
	},
	mounted() {
		this.getItemsData();
		this.emitter.on("selectTrader1", (trader) => {
			this.trader1 = trader;
			this.traderCounter1 = 0;
		});
		this.emitter.on("selectTrader2", (trader) => {
			this.trader2 = trader;
			this.traderCounter2 = 0;
		});
		this.emitter.on("resetData", () => {
			this.trader1 = {};
			this.trader2 = {};
		});
	},
	methods: {
		getItemsData() {
			MartiansApi.getItems()
				.then((response) => {
					this.items = response.data.data;
				})
				.catch((e) => {
					console.log(e);
				});
		},
	},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.item-name {
	max-width: 100px;
	flex-basis: 30%;
}
</style>
