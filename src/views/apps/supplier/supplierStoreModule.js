import axios from '@axios'
import { paginateArray, sortCompare } from '@core/utils/utils'

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    fetchSuppliers(ctx, queryParams) {
      const {
        q = '',
        perPage = 10,
        page = 1,
        sortBy = 'id',
        sortDesc = false,
      } = queryParams
      return new Promise((resolve, reject) => {
        axios
          .get('/suppliers/suppliers/', {})
          .then(response => {
            const { data } = response
            const queryLowered = q.toLowerCase()

            const filteredData = data.filter(
              supplier =>
              /* eslint-disable operator-linebreak, implicit-arrow-linebreak */
              (
                supplier.address.toLowerCase().includes(queryLowered)
                || supplier.phone.toLowerCase().includes(queryLowered)
                || supplier.email.toLowerCase().includes(queryLowered)
                || supplier.website.toLowerCase().includes(queryLowered)
                || supplier.description.toLowerCase().includes(queryLowered)
              )
            )

            const sortedData = filteredData.sort(sortCompare(sortBy))
            if (sortDesc) sortedData.reverse()
            resolve({ data: paginateArray(sortedData, perPage, page), total: filteredData.length })
          })
          .catch(error => reject(error))
      })
    },
    fetchSupplier(ctx, { id }) {
      return new Promise((resolve, reject) => {
        axios
          .get(`/suppliers/suppliers/${id}/`)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    addSupplier(ctx, supplierData) {
      return new Promise((resolve, reject) => {
        axios
          .post('/suppliers/suppliers/', supplierData)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    editSupplier(ctx, { id, supplierData }) {
      return new Promise((resolve, reject) => {
        axios
          .patch(`/suppliers/suppliers/${id}/`, supplierData)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    deleteSupplier(ctx, { id }) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`/suppliers/suppliers/${id}/`)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
  },
}