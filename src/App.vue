<template>
	<h2>Mars Trading Platform</h2>
	<div class="traders"><MarsTraders :traders="traders" /></div>
	<div class="traders-platform">
		<ul id="items">
			<li v-for="item in items" :key="item.itemid">
				<div class="items">
					<MartianItem :item="item" />
				</div>
			</li>
		</ul>
	</div>
	<MartiansTotalTrades />
</template>

<script>
import MarsTraders from "@/components/MarsTraders.vue";
import MartianItem from "@/components/MartianItem.vue";
import MartiansTotalTrades from "@/components/MartiansTotalTrades.vue";
import MartiansApi from "./components/MartiansApi";

export default {
	name: "App",
	components: {
		MarsTraders,
		MartianItem,
		MartiansTotalTrades,
	},
	data() {
		return {
			items: [],
			traders: [],
		};
	},
	mounted() {
		this.getItemsData();
		this.getMartians();
		this.emitter.on("resetData", () => {
			this.getMartians();
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
		getMartians() {
			MartiansApi.getAll()
				.then((response) => {
					let data = response.data.data;
					this.traders = data.filter((trader) => trader.allow >= 1);
				})
				.catch((e) => {
					console.log(e);
				});
		},
	},
};
</script>

<style lang="scss">
body,
html {
	height: 100%;
	background: url("assets/mars-img.png") fixed no-repeat bottom right/60% 100%,
		linear-gradient(to right, #470104, #050505 40%);

	padding: 20px;
	&:disabled {
		opacity: 0.5;
	}
}
h2 {
	color: #fff;
	margin: 0px 0px;
	display: block;
	width: 300px;
	text-align: left;
}
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	margin-top: 60px;
}
.traders {
	width: 40%;
	position: relative;
	margin: 40px 0 20px 0px;
	display: flex;
	justify-content: flex-end;
	color: #fff;
}
.traders-platform {
	width: 40%;
	display: flex;
	flex-direction: column;

	#items {
		padding: 0;
		margin: 0;
		list-style: none;

		li {
			margin: 10px 0;
		}
	}
	.items {
		width: 100%;
		box-sizing: border-box;
		display: flex;
		height: 100px;
		color: #fff;
		justify-content: space-between;
		align-items: center;
		padding: 30px;

		&:nth-child(odd) {
			background: rgba(255, 255, 255, 0.1);
		}
		.item-name {
			max-width: 100px;
			flex: auto;
		}
	}
}
</style>
