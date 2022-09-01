import axios from '@axios'
import { paginateArray, sortCompare } from '@/@core/utils/utils'

export default {
  namespaced: true,
  state: {
  },
  getters: {},
  mutations: {},
  actions: {
    fetchVerbalStocks({ state }, queryParams) {
      const {
        q = '',
        perPage = 10,
        page = 1,
        sortBy = 'id',
        sortDesc = false,
        shopId = 0
      } = queryParams
      return new Promise((resolve, reject) => {

        axios
          .get(`/verbal/stocks/${shopId}/`)
          .then(response => {
            const { data } = response
            console.log(data);
            const queryLowered = q.toLowerCase()

            const filteredData = data.filter(
              stock =>
                /* eslint-disable operator-linebreak, implicit-arrow-linebreak */
                stock.product.toLowerCase().includes(queryLowered) ||
                stock.brand.toLowerCase().includes(queryLowered) ||
                stock.category.toLowerCase().includes(queryLowered)
            )

            const sortedData = filteredData.sort(sortCompare(sortBy))
            if (sortDesc) sortedData.reverse()
            resolve({ data: paginateArray(sortedData, perPage, page), total: filteredData.length })
          })
          .catch(error => reject(error))
      })
    },
    addVerbal(ctx, verbal) {
      return new Promise((resolve, reject) => {
        axios
          .post('/verbal/', verbal)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
  },
}
