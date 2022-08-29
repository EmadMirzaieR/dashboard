import { ref, watch, computed } from '@vue/composition-api'
import store from '@/store'

// Notification
import { useToast } from 'vue-toastification/composition'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

export default function useCustomersCartsList() {
  // Use toast
  const toast = useToast()

  const refCustomersCartListTable = ref(null)

  // Table Handlers
  const tableColumns = [
    { key: 'id', sortable: true },
    { key: 'name', sortable: true },
    { key: 'email', sortable: true },
    { key: 'phone_number', sortable: true },
    { key: 'last_login', sortable: true },
    { key: 'cancel_items_count', sortable: true },
    { key: 'pending_items_count', sortable: true },
    { key: 'factor_items_count', sortable: true },
  ]

  const perPage = ref(10)
  const totalCustomersCarts = ref(0)
  const currentPage = ref(1)
  const perPageOptions = [5, 10, 25, 50, 100]
  const searchQuery = ref('')
  const sortBy = ref('id')
  const isSortDirDesc = ref(false)

  const dataMeta = computed(() => {
    const localItemsCount = refCustomersCartListTable.value ? refCustomersCartListTable.value.localItems.length : 0
    return {
      from: perPage.value * (currentPage.value - 1) + (localItemsCount ? 1 : 0),
      to: perPage.value * (currentPage.value - 1) + localItemsCount,
      of: totalCustomersCarts.value,
    }
  })

  const refetchData = () => {
    refCustomersCartListTable.value.refresh()
  }

  watch([currentPage, perPage, searchQuery], () => {
    refetchData()
  })

  const fetchCustomersCarts = (ctx, callback) => {
    store
      .dispatch('app-customer/fetchCustomersCarts', {
        q: searchQuery.value,
        perPage: perPage.value,
        page: currentPage.value,
        sortBy: sortBy.value,
        sortDesc: isSortDirDesc.value,
      })
      .then(response => {
        const { data, total } = response
        callback(data)
        totalCustomersCarts.value = total
      })
      .catch(() => {
        toast({
          component: ToastificationContent,
          props: {
            title: 'Error fetching customersCarts list',
            icon: 'AlertTriangleIcon',
            variant: 'danger',
          },
        })
      })
  }


  return {
    fetchCustomersCarts,
    tableColumns,
    perPage,
    currentPage,
    totalCustomersCarts,
    dataMeta,
    perPageOptions,
    searchQuery,
    sortBy,
    isSortDirDesc,
    refCustomersCartListTable,
    refetchData,
  }
}