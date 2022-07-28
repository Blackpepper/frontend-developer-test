import http from "../http-common";

class MartianApi {
	getAll() {
		return http.get("/martian");
	}
	getItems() {
		return http.get(`/martian/items`);
	}
	trade(data) {
		console.log("data", data);
		return http.post(`/martian/trade`, data);
	}
}

export default new MartianApi();
