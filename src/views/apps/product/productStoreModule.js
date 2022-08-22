import axios from '@axios'
import { paginateArray, sortCompare } from '@/@core/utils/utils'

export default {
  namespaced: true,
  state: {
    cartItemsCount: (() => {
      const userData = JSON.parse(localStorage.getItem('userData'))
      return userData && userData.extras ? userData.extras.eCommerceCartItemsCount : 0
    })(),
  },
  getters: {},
  mutations: {
    UPDATE_CART_ITEMS_COUNT(state, count) {
      state.cartItemsCount = count
    },
  },
  actions: {
    fetchProducts(ctx, payload) {
      return new Promise((resolve, reject) => {
        axios
          .get('/products-dashboard/products/', {})
          .then(response => {
            // eslint-disable-next-line object-curly-newline
            const { q = '', sortBy = 'featured', perPage = 9, page = 1, categories = '', brands = '' } = payload

            const queryLowered = q.toLowerCase()

            const { data } = response;

            const filteredData = data.filter(
              product =>
                product.name.toLowerCase().includes(queryLowered) &&
                (categories === '' ? true : product.category.id === categories) &&
                (brands === '' ? true : product.brand.id === brands)
            )

            let sortDesc = false
            const sortByKey = (() => {
              if (sortBy === 'price-desc') {
                sortDesc = true
                return 'price'
              }
              if (sortBy === 'price-asc') {
                return 'price'
              }
              sortDesc = true
              return 'id'
            })()

            const sortedData = filteredData.sort(sortCompare(sortByKey))
            if (sortDesc) sortedData.reverse()

            const paginatedData = JSON.parse(JSON.stringify(paginateArray(sortedData, perPage, page)))

            resolve({ data: paginatedData, total: filteredData.length })
          })
          .catch(error => reject(error))
      })
    },
    fetchProductStocks(ctx, queryParams) {
      const {
        q = '',
        perPage = 5,
        page = 1,
        sortBy = 'shop',
        sortDesc = false,
        productId = 0,
      } = queryParams

      return new Promise((resolve, reject) => {
        axios
          .get(`/products-dashboard/products/${productId}/stock/`)
          .then(response => {
            // const { data } = response
            const data ={
              "Shop1": {
                  "offline_stock": [
                      {
                          "shop_id": 5,
                          "stock_id": 19,
                          "size": "6 DROP54",
                          "color": "Alizarin Crimson",
                          "quantity": 10,
                          "status": "Available",
                          "prices": 0,
                          "stock_values": 0,
                          "who_sell_in_month": 0,
                          "who_sell_in_year": 0
                      }
                  ],
                  "online_stock": [],
                  "purchase_price": 1000.0,
                  "total_transfer_price": 10.0
              },
              "shop2": {
                  "offline_stock": [
                      {
                          "shop_id": 6,
                          "stock_id": 20,
                          "size": "4 DROP 58",
                          "color": "Alizarin Crimson",
                          "quantity": 7,
                          "status": "Available",
                          "prices": 123.0,
                          "stock_values": 861.0,
                          "who_sell_in_month": 0,
                          "who_sell_in_year": 0
                      }
                  ],
                  "online_stock": [{
                    "shop_id": 7,
                    "stock_id": 54,
                    "size": "7 DROP 58",
                    "color": "Alizarin Crimson",
                    "quantity": 7,
                    "status": "Available",
                    "prices": 123.0,
                    "stock_values": 435.0,
                    "who_sell_in_month": 0,
                    "who_sell_in_year": 0
                },{
                  "shop_id": 8,
                  "stock_id": 23,
                  "size": "3 DROP 58",
                  "color": "Alizarin Crimson",
                  "quantity": 7,
                  "status": "Available",
                  "prices": 123.0,
                  "stock_values": 321.0,
                  "who_sell_in_month": 0,
                  "who_sell_in_year": 0
              }],
                  "purchase_price": 0,
                  "total_transfer_price": 0
              }
          }
            const array = Object.keys(data).map(item => {
              return {
                shop: item,
                offline_stock: data[item].offline_stock,
                online_stock: data[item].online_stock,
                purchase_price: data[item].purchase_price,
                total_transfer_price: data[item].total_transfer_price,
              }
            })

            const sortedData = array.sort(sortCompare(sortBy))
            if (sortDesc) sortedData.reverse()
            resolve({ data: paginateArray(sortedData, perPage, page), total: array.length })
          })
          .catch(error => reject(error))
      })
    },
    fetchProductOptions(ctx, payload) {
      return new Promise((resolve, reject) => {
        axios
          .get('/products-dashboard/products/', {})
          .then(response => {

            const { data } = response;

            const filteredData = data.map(
              product => {
                return {
                  'text': product.name,
                  'value': product.id
                }
              }
            )

            resolve({ data: filteredData })
          })
          .catch(error => reject(error))
      })
    },
    fetchFilterOptions(ctx, payload) {
      let result = { categories: { text: "All", value: "" }, brands: { text: "All", value: "" } }
      if (payload.type != 'All')
        result = {
          categories: { value: null, text: "Nothing Selected" },
          brands: { value: null, text: "Nothing Selected" },
        }

      return new Promise((resolve, reject) => {
        axios
          .get('/dashboard/categories/', {})
          .then(response => {
            // eslint-disable-next-line object-curly-newline
            const { data } = response;
            const categories = data.map(
              category => {
                return {
                  'text': category.name,
                  'value': category.id
                }
              }
            )
            result.categories = [result.categories, ...categories]
            axios
              .get('/dashboard/brands/', {})
              .then(response => {
                // eslint-disable-next-line object-curly-newline

                const { data } = response;

                const brands = data.map(
                  category => {
                    return {
                      'text': category.name,
                      'value': category.id
                    }
                  }
                )
                result.brands = [result.brands, ...brands]
                resolve(result)
              })
          })
          .catch(error => reject(error))
      })
    },
    fetchCreateOptions(ctx, payload) {
      let result = {}

      return new Promise((resolve, reject) => {
        axios
          .get('/dashboard/products/features/', {})
          .then(response => {
            // eslint-disable-next-line object-curly-newline
            const { data } = response;
            const features = data.map(
              feature => {
                return {
                  'text': feature.description,
                  'value': feature.id
                }
              }
            )
            result.features = features
            axios
              .get('/dashboard/products/colors/', {})
              .then(response => {
                // eslint-disable-next-line object-curly-newline

                const { data } = response;

                const colors = data.map(
                  color => {
                    return {
                      'text': color.name,
                      'value': color.id
                    }
                  }
                )
                result.colors = colors
                axios
                  .get('/dashboard/products/sizes/', {})
                  .then(response => {
                    // eslint-disable-next-line object-curly-newline
                    const { data } = response;
                    const sizes = data.map(
                      size => {
                        return {
                          'text': size.name,
                          'value': size.id
                        }
                      }
                    )
                    result.sizes = sizes
                    resolve(result)
                  })
              })
          })
          .catch(error => reject(error))
      })
    },
    fetchProduct(ctx, { productId }) {
      return new Promise((resolve, reject) => {
        axios
          .get(`/products-dashboard/products/${productId}/`)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    fetchProductGallery(ctx, { productId }) {
      return new Promise((resolve, reject) => {
        axios
          .get(`/products-dashboard/products/${productId}/images/gallery/`)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    editProduct(ctx, { id, productData }) {
      return new Promise((resolve, reject) => {
        axios
          .patch(`/products-dashboard/products/${id}/update/`, productData)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    deleteProduct(ctx, { id }) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`/products-dashboard/products/${id}/`)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
  },
}
