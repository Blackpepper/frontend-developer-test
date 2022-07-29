<template>
	<div class="title">Mars Trading Platform</div>
	<div class="traders-platform">
		<div class="traders"><MarsTraders :traders="traders" /></div>
		<ul id="items">
			<li v-for="item in items" :key="item.itemid">
				<div class="items">
					<MartianItem :item="item" />
				</div>
			</li>
		</ul>
		<MartiansTotalTrades />
	</div>
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
		linear-gradient(to right, #470104, #050505 32%);
	background-position-y: 130px;
}
.title {
	width: 300px;
	text-transform: uppercase;
	background-image: linear-gradient(
		-225deg,
		#231557 0%,
		#fff 29%,
		#ff1361 67%,
		#44107a 100%
	);
	color: #fff;
	font-size: 14px;
	font-weight: 700;
	text-align: left;
	background-size: auto auto;
	background-clip: border-box;
	background-size: 200% auto;
	color: #fff;
	background-clip: text;
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	animation: textclip 2s linear infinite;
}

@keyframes textclip {
	to {
		background-position: 200% center;
	}
}
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	margin-top: 50px;
	padding: 0 136px;
}
.traders {
	position: relative;
	margin: 124px 0 18px 0px;
	display: flex;
	justify-content: flex-end;
	color: #fff;
	width: 625px;
}
.traders-platform {
	width: 100%;
	max-width: 656px;
	display: flex;
	flex-direction: column;

	#items {
		padding: 0;
		margin: 0;
		list-style: none;

		li {
			&:nth-child(odd) {
				background: rgba(255, 255, 255, 0.1);
			}
			.items {
				width: 100%;
				box-sizing: border-box;
				display: flex;
				height: 88px;
				color: #fff;
				justify-content: space-between;
				align-items: center;
				padding: 32px 46px;

				.item-name {
					max-width: 53px;
					font-size: 16px;
					flex: auto;
					text-align: left;
				}
			}
		}
	}
}

@media screen and (max-width: 768px) {
	body,
	html {
		background-size: cover;
		background-attachment: fixed;
		background-repeat: no-repeat;
	}
	#app {
		padding: 0 20px;
	}
	.traders {
		width: 100%;
		.traders-select {
			margin-left: 0;
		}
	}

	.traders-platform #items li .items {
		padding: 10px;
		.item-name {
			font-size: 14px;
		}
	}
	.item-value-operator[disabled="true"],
	.item-value-operator {
		.btn-minus[data-v-f1690296] {
			margin: 0;
		}
		.btn-plus[data-v-f1690296] {
			margin: 0;
		}
	}
	.total-trades {
		padding: 0;
		.total-trades__name {
			padding: 10px;
			font-size: 14px;
			text-align: left;
			flex-basis: 10%;
		}
	}
}
</style>
