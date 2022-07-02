import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL

export default {
  methods: {
    $api(baseURL) {
      // creates axios method to use all across the app.
      // this also uses the loader component everytime axios is used.
      if (!baseURL) {
        baseURL = BASE_URL
      }

      const loader = this.$loading.show()

      const api = axios.create({
        baseURL: BASE_URL,
      })

      this.onEnd(api, loader)

      return api
    },

    onEnd(api, loader) {
      api.interceptors.response.use((response) => {
        // stop the loader
        loader.hide()
        return response;
      }, (error) => {
        loader.hide()
        return Promise.reject(error);
      })
    }
  }
}