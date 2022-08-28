import axios from '@axios'
import { paginateArray, sortCompare } from '@core/utils/utils'

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    fetchCustomersOrders(ctx, queryParams) {
      const {
        q = '',
        perPage = 10,
        page = 1,
        sortBy = 'id',
        sortDesc = false,
      } = queryParams
      return new Promise((resolve, reject) => {
        axios
          .get('/customers/orders/')
          .then(response => {
            const { data } = response
            const queryLowered = q.toLowerCase()

            const filteredData = data.user_has_order.filter(
              customersOrder =>
                /* eslint-disable operator-linebreak, implicit-arrow-linebreak */
                customersOrder.email.toLowerCase().includes(queryLowered) ||
                customersOrder.phone_number.toLowerCase().includes(queryLowered) ||
                customersOrder.last_name.toLowerCase().includes(queryLowered) ||
                customersOrder.first_name.toLowerCase().includes(queryLowered)
            )

            const sortedData = filteredData.sort(sortCompare(sortBy))
            if (sortDesc) sortedData.reverse()
            resolve({ data: paginateArray(sortedData, perPage, page), total: filteredData.length })
          })
          .catch(error => reject(error))
      })
    },
    fetchCustomersCarts(ctx, queryParams) {
      const {
        q = '',
        perPage = 10,
        page = 1,
        sortBy = 'id',
        sortDesc = false,
      } = queryParams
      return new Promise((resolve, reject) => {
        axios
          .get('/customers/carts/')
          .then(response => {
            const { data } = response
            const queryLowered = q.toLowerCase()

            const filteredData = data.users_with_cart.filter(
              customersCart =>
                /* eslint-disable operator-linebreak, implicit-arrow-linebreak */
                customersCart.email.toLowerCase().includes(queryLowered) ||
                customersCart.phone_number.toLowerCase().includes(queryLowered) ||
                customersCart.last_name.toLowerCase().includes(queryLowered) ||
                customersCart.first_name.toLowerCase().includes(queryLowered)
            )

            const sortedData = filteredData.sort(sortCompare(sortBy))
            if (sortDesc) sortedData.reverse()
            resolve({ data: paginateArray(sortedData, perPage, page), total: filteredData.length })
          })
          .catch(error => reject(error))
      })
    },
  },
}
