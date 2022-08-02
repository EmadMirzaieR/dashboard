import axios from '@axios'
import { paginateArray, sortCompare } from '@core/utils/utils'

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    fetchShops(ctx, queryParams) {
      const {
        q = '',
        perPage = 10,
        page = 1,
        sortBy = 'id',
        sortDesc = false,
      } = queryParams
      return new Promise((resolve, reject) => {
        axios
          .get('/shops/', {})
          .then(response => {
            const { data } = response
            const queryLowered = q.toLowerCase()

            const filteredData = data.filter(
              shop =>
                /* eslint-disable operator-linebreak, implicit-arrow-linebreak */
                (shop.name.toLowerCase().includes(queryLowered) ||
                  shop.description.toLowerCase().includes(queryLowered) ||
                  shop.address.toLowerCase().includes(queryLowered)) ||
                shop.phone.toLowerCase().includes(queryLowered) ||
                shop.email.toLowerCase().includes(queryLowered),
            )

            const sortedData = filteredData.sort(sortCompare(sortBy))
            if (sortDesc) sortedData.reverse()
            resolve({ data: paginateArray(sortedData, perPage, page), total: filteredData.length })
          })
          .catch(error => reject(error))
      })
    },
    fetchShop(ctx, { id }) {
      return new Promise((resolve, reject) => {
        axios
          .get(`/shops/${id}/`)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    addShop(ctx, shopData) {
      return new Promise((resolve, reject) => {
        axios
          .post('/shops/', shopData)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    editShop(ctx, { id, shopData }) {
      return new Promise((resolve, reject) => {
        axios
          .patch(`/shops/${id}/`, shopData)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
  },
}
