import axios from "axios";

export default axios.create({
	baseURL: "https://www.blackpepper.co.nz/api/",
	headers: {
		"Content-type": "application/json",
	},
});
