import { ref, watch, computed } from '@vue/composition-api'
import store from '@/store'

// Notification
import { useToast } from 'vue-toastification/composition'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

export default function useStocksList() {
  // Use toast
  const toast = useToast()

  const refStockListTable = ref(null)

  // Table Handlers
  const tableColumns = [
    { key: 'id', sortable: true },
    { key: 'name', sortable: true },
    { key: 'description', sortable: true },
    { key: 'address', sortable: true },
    { key: 'phone', sortable: true },
    { key: 'email', sortable: true },
    { key: 'actions' },
  ]
  const perPage = ref(10)
  const totalStocks = ref(0)
  const currentPage = ref(1)
  const perPageOptions = [5, 10, 25, 50, 100]
  const searchQuery = ref('')
  const sortBy = ref('id')
  const isSortDirDesc = ref(false)

  const dataMeta = computed(() => {
    const localItemsCount = refStockListTable.value ? refStockListTable.value.localItems.length : 0
    return {
      from: perPage.value * (currentPage.value - 1) + (localItemsCount ? 1 : 0),
      to: perPage.value * (currentPage.value - 1) + localItemsCount,
      of: totalStocks.value,
    }
  })

  const refetchData = () => {
    refStockListTable.value.refresh()
  }

  watch([currentPage, perPage, searchQuery], () => {
    refetchData()
  })

  const fetchStocks = (ctx, callback) => {
    store
      .dispatch('app-stock/fetchStocks', {
        q: searchQuery.value,
        perPage: perPage.value,
        page: currentPage.value,
        sortBy: sortBy.value,
        sortDesc: isSortDirDesc.value,
      })
      .then(response => {
        const { data, total } = response
        callback(data)
        totalStocks.value = total
      })
      .catch(() => {
        toast({
          component: ToastificationContent,
          props: {
            title: 'Error fetching stocks list',
            icon: 'AlertTriangleIcon',
            variant: 'danger',
          },
        })
      })
  }

  // *===============================================---*
  // *--------- UI ---------------------------------------*
  // *===============================================---*

  return {
    fetchStocks,
    tableColumns,
    perPage,
    currentPage,
    totalStocks,
    dataMeta,
    perPageOptions,
    searchQuery,
    sortBy,
    isSortDirDesc,
    refStockListTable,

    refetchData,
  }
}
