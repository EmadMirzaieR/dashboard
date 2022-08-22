<template>
  <b-card no-body class="mb-0">
    <b-table
      ref="refStockListTable"
      class="position-relative"
      :items="fetchProductStocks"
      responsive
      :fields="tableColumns"
      primary-key="shop"
      :sort-by.sync="sortBy"
      show-empty
      empty-text="No matching records found"
      :sort-desc.sync="isSortDirDesc"
    >
      <template #row-details="row">
        <b-card v-if="rows(row.index) == 'offline'">
          <b-row>Offline Stocks</b-row>
          <b-row class="mb-2">
            <b-table
              striped
              small
              hover
              :items="row.item.offline_stock"
              :fields="[
                'stock_id',
                'size',
                'color',
                'quantity',
                'status',
                'prices',
                'stock_values',
                'who_sell_in_month',
                'who_sell_in_year',
                'actions',
              ]"
            >
              <template #cell(actions)="data">
                <b-dropdown
                  variant="link"
                  no-caret
                  :right="$store.state.appConfig.isRTL"
                >
                  <template #button-content>
                    <feather-icon
                      icon="MoreVerticalIcon"
                      feature="16"
                      class="align-middle text-body"
                    />
                  </template>
                  <b-dropdown-item v-b-modal.modal-transfer-to-other-shop>
                    <feather-icon icon="ChevronsUpIcon" />
                    <span class="align-middle ml-50"
                      >Transfer To Other Shop</span
                    >
                  </b-dropdown-item>

                  <b-dropdown-item>
                    <feather-icon icon="ChevronsUpIcon" />
                    <span class="align-middle ml-50"
                      >Transfer To Online Shop</span
                    >
                  </b-dropdown-item>
                </b-dropdown>
              </template>
            </b-table>
          </b-row>
          <b-button
            size="sm"
            variant="outline-secondary"
            @click="row.toggleDetails"
          >
            Hide Stocks
          </b-button>
        </b-card>
        <b-card v-else>
          <b-row>Online Stocks</b-row>
          <b-row class="mb-2">
            <b-table
              striped
              small
              hover
              :items="row.item.online_stock"
              :fields="[
                'stock_id',
                'size',
                'color',
                'quantity',
                'status',
                'prices',
                'stock_values',
                'who_sell_in_month',
                'who_sell_in_year',
                'actions',
              ]"
            >
              <template #cell(actions)="data">
                <b-dropdown
                  variant="link"
                  no-caret
                  :right="$store.state.appConfig.isRTL"
                >
                  <template #button-content>
                    <feather-icon
                      icon="MoreVerticalIcon"
                      feature="16"
                      class="align-middle text-body"
                    />
                  </template>
                  <b-dropdown-item>
                    <feather-icon icon="ChevronsUpIcon" />
                    <span class="align-middle ml-50"
                      >Transfer To Offline Shop</span
                    >
                  </b-dropdown-item>
                </b-dropdown>
              </template>
            </b-table>
          </b-row>
          <b-button
            size="sm"
            variant="outline-secondary"
            @click="row.toggleDetails"
          >
            Hide Stocks
          </b-button>
        </b-card>
      </template>

      <!-- Column: Actions -->
      <template #cell(offline_stock)="row">
        <div @click="changeRows(row.index, 'offline')">
          <b-button
            variant="primary"
            :disabled="row.item.offline_stock.length === 0"
            @click="row.toggleDetails"
          >
            <span class="text-nowrap">{{ row.item.offline_stock.length }}</span>
          </b-button>
        </div>
      </template>

      <template #cell(online_stock)="row">
        <div @click="changeRows(row.index, 'online')">
          <b-button
            variant="primary"
            :disabled="row.item.online_stock.length === 0"
            @click="row.toggleDetails"
          >
            <span class="text-nowrap">{{ row.item.online_stock.length }}</span>
          </b-button>
        </div>
      </template>
    </b-table>
    <div class="mx-2 mb-2">
      <b-row>
        <b-col
          cols="12"
          sm="6"
          class="
            d-flex
            align-items-center
            justify-content-center justify-content-sm-start
          "
        >
          <span class="text-muted"
            >Showing {{ dataMeta.from }} to {{ dataMeta.to }} of
            {{ dataMeta.of }} entries</span
          >
        </b-col>
        <!-- Pagination -->
        <b-col
          cols="12"
          sm="6"
          class="
            d-flex
            align-items-center
            justify-content-center justify-content-sm-end
          "
        >
          <b-pagination
            v-model="currentPage"
            :total-rows="totalProductStocks"
            :per-page="perPage"
            first-number
            last-number
            class="mb-0 mt-1 mt-sm-0"
            prev-class="prev-item"
            next-class="next-item"
          >
            <template #prev-text>
              <feather-icon icon="ChevronLeftIcon" size="18" />
            </template>
            <template #next-text>
              <feather-icon icon="ChevronRightIcon" size="18" />
            </template>
          </b-pagination>
        </b-col>
      </b-row>
    </div>
    <b-modal
      hide-footer
      id="modal-transfer-to-other-shop"
      scrollable
      title="Register"
      size="lg"
      cancel-variant="outline-secondary"
    >
      <transfer-to-other-shop-wizard :productId="productId" />
    </b-modal>
  </b-card>
</template>

<script>
import {
  BCard,
  BRow,
  BCol,
  BFormInput,
  BButton,
  BTable,
  BMedia,
  BAvatar,
  BLink,
  BBadge,
  BDropdown,
  BDropdownItem,
  BPagination,
  BModal,
  VBModal,
} from "bootstrap-vue";
import vSelect from "vue-select";
import store from "@/store";
import { ref, onUnmounted } from "@vue/composition-api";
import { avatarText } from "@core/utils/filter";
import useProductStocks from "./useProductStocks";
import productStoreModule from "../../product/productStoreModule";
import TransferToOtherShopWizard from "@views/apps/stock/stocks-list/TransferToOtherShopWizard.vue";

export default {
  directives: {
    "b-modal": VBModal,
  },
  components: {
    BModal,
    BCard,
    BRow,
    BCol,
    BFormInput,
    BButton,
    BTable,
    BMedia,
    BAvatar,
    BLink,
    BBadge,
    BDropdown,
    BDropdownItem,
    BPagination,
    vSelect,
    TransferToOtherShopWizard,
  },
  data() {
    return {
      stockClick: {},
    };
  },
  methods: {
    changeRows(index, type) {
      this.stockClick[index] = type;
    },
    rows(index) {
      return this.stockClick[index];
    },
  },
  props: ["productId"],
  setup(props) {
    const Product_Stock_APP_STORE_MODULE_NAME = "app-product";

    // Register module
    if (!store.hasModule(Product_Stock_APP_STORE_MODULE_NAME))
      store.registerModule(
        Product_Stock_APP_STORE_MODULE_NAME,
        productStoreModule
      );

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(Product_Stock_APP_STORE_MODULE_NAME))
        store.unregisterModule(Product_Stock_APP_STORE_MODULE_NAME);
    });

    const {
      fetchProductStocks,
      tableColumns,
      perPage,
      currentPage,
      totalProductStocks,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refStockListTable,
      refetchData,

      // UI
    } = useProductStocks(props.productId);

    return {
      // Sidebar

      fetchProductStocks,
      tableColumns,
      perPage,
      currentPage,
      totalProductStocks,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refStockListTable,
      refetchData,

      // Filter
      avatarText,
    };
  },
};
</script>

<style lang="scss" scoped>
.per-page-selector {
  width: 90px;
}
</style>

<style lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";
</style>
