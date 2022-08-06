# Mars trading app (mars-trading)

Technical Exam

## Install the dependencies
```bash
yarn
# or
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
quasar dev
```


### Build the app for production
```bash
quasar build
```

### Customize the configuration
See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js).
=======
# Frontend Developer Test

Be sure to read **all** of this document carefully, and follow the guidelines within.


## Problem Description

Mars Trading Platform. It is a new civilization and there are no shops but people need supplies to survive. People produce their own supplies and trade what they have for what they don't. 

You have been tasked to develop an interface to make the trading experience better.


## Requirements

You will be supplied a [design](https://www.figma.com/file/LfpdkCFeeeQUkXTGKkvGrm/Mars-trading-platform?node-id=2%3A266) and a [REST API](#endpoints), which will store information about the martians, the supplies they own and ability to trade. Your task is to build a *Vue* application that allows trade between 2 martians.

1. Martians are not allowed to trade with themselves (if they're selected in one dropdown, they should be disabled in the other)
2. Flagged martians (i.e. where `allow` is `0`) are unable to trade, therefore they should be filtered out from the dropdowns
3. The numbers in design (e.g. `1 / 2`) represent `[quantity of item being traded] / [quantity of item the trader has]`. The quantity of item being traded should not be less than 0 and should not exceed the total quantity the trader can trade
4. Each item is worth a certain number of points (described below). Use the `GET Index/List Martian Items` endpoint for getting this data as available items may change

| Item         | Points   |
|--------------|----------|
| 1 Oxygen     | 6 points |
| 1 Water      | 4 points |
| 1 Food       | 3 points |
| 1 Medication | 2 points |
| 1 Clothing   | 1 point  |

5. The total for each trader represents the sum of each item multiplied by their value and a trade can only occur if the total value of points is equal on both sides. For example, 1 Oxygen and 1 Medication (1 x 6 + 1 x 2) is worth 2 Water (4 x 2) or 8 Clothing items (1 x 8)
6. The `Trade` button should be disabled if a trade cannot occur (e.g. totals don't match)
7. When the `Trade` button is clicked, it should post to the `Martian Trade` endpoint. Note: only the items being traded should be included in the data


---------------------------------------

## Resources
- [Figma file](https://www.figma.com/file/LfpdkCFeeeQUkXTGKkvGrm/Mars-trading-platform?node-id=2%3A266)

## Endpoints
- GET Index/List Martian `https://www.blackpepper.co.nz/api/martian`
	```json
	{
		"status": true,
		"data": [
			{
				"martianid": 2,
				"name": "Peter",
				"age": 35,
				"gender": "M",
				"allow": 1,
				"inventory": [
					{
						"itemid": 4,
						"quantity": 0,
						"name": "Medication",
						"points": 2
					},
					{
						"itemid": 2,
						"quantity": 0,
						"name": "Water",
						"points": 4
					},
					{
						"itemid": 1,
						"quantity": 5,
						"name": "Oxygen",
						"points": 6
					}
				]
			},
		]
	}
	```
- GET Index/List Martian Items  `https://www.blackpepper.co.nz/api/martian/items`
	```json
	{
		"status": true,
		"data": [
			{
				"itemid": 1,
				"name": "Oxygen",
				"points": 6
			},
			{
				"itemid": 2,
				"name": "Water",
				"points": 4
			},
			{
				"itemid": 3,
				"name": "Food",
				"points": 3
			},
			{
				"itemid": 4,
				"name": "Medication",
				"points": 2
			},
			{
				"itemid": 5,
				"name": "Clothing",
				"points": 1
			}
		]
	}
	```
- POST Martian Trade  `https://www.blackpepper.co.nz/api/martian/trade`
	```json
	{
		"buyFrom": {
			"martianid": 8,
			"items": [
				{
					"itemid": 2,
					"quantity": 1
				}
			]
		},
		"sellTo": {
			"martianid": "x",
			"items": [
				{
					"itemid": 5,
					"quantity": 4
				}
			]
		}
	}
	```


## Notes

1. This must be built with Vue (can be Vue 2 or Vue 3)
2. You are free to use any build tools you like
3. The app does not need to be responsive
4. You may choose to focus on application logic over styling (or vice versa) depending on your strengths, but bonus points for completing both


## Q&A

> Where should I send back the result when I'm done?

Fork this repo and send us a pull request when you think you are done. We will note you about deadline directly.

> What if I have a question?

Just create a new issue in this repo and we will respond and get back to you quickly.

