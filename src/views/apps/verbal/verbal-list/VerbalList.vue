<template>
  <div>
    <b-row>
      <b-col cols="8">
        <b-card no-body class="mb-0">
          <div class="m-2">
            <b-row>
              <b-col
                cols="12"
                md="6"
                class="
                  d-flex
                  align-items-center
                  justify-content-start
                  mb-1 mb-md-0
                "
              >
                <label>Show</label>
                <v-select
                  v-model="perPage"
                  :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                  :options="perPageOptions"
                  :clearable="false"
                  class="per-page-selector d-inline-block mx-50"
                />
                <label>entries</label>
              </b-col>

              <!-- Search -->
              <b-col cols="12" md="6">
                <div class="d-flex align-items-center justify-content-end">
                  <b-form-input
                    v-model="searchQuery"
                    class="d-inline-block mr-1"
                    placeholder="Search..."
                  />
                </div>
              </b-col>
            </b-row>
          </div>

          <b-table
            ref="refVerbalStockListTable"
            class="position-relative"
            :items="fetchVerbalStocks"
            responsive
            :fields="tableColumns"
            primary-key="id"
            :sort-by.sync="sortBy"
            show-empty
            empty-text="No matching records found"
            :sort-desc.sync="isSortDirDesc"
          >
            <template #cell(image)="data">
              <b-media vertical-align="center">
                <b-img
                  width="100"
                  :src="data.item.image"
                  :text="avatarText(data.item.product)"
                />
              </b-media>
            </template>

            <template #cell(count)="data">
              <div class="item-quantity">
                <b-form-spinbutton
                  @change="changeCount(data.item, data.item.id, $event)"
                  min="0"
                  :max="data.item.quantity"
                  size="sm"
                  class="ml-75"
                  inline
                />
              </div>
            </template>

            <template #cell(add)="data">
              <b-button @click="addToCart(data.item.id)"> ADD </b-button>
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
                  :total-rows="totalVerbalStocks"
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
        </b-card>
      </b-col>
      <b-col cols="4">
        <b-card>
          <div class="mb-5">
            <b-row>
              <b-col cols="12" md="6">
                <b-button
                  class="mb-1 mb-sm-0 mr-0 mr-sm-1"
                  v-b-modal.modal-finish-cart
                  variant="primary"
                >
                  Finish cart
                </b-button>
              </b-col>
              <b-col cols="12" md="6">
                <h3>${{ totalCart }}</h3>
              </b-col>
            </b-row>
          </div>
          <b-card
            v-for="cartItem in cart"
            :key="cartItem.id"
            class="ecommerce-card"
            no-body
          >
            <b-row>
              <b-col cols="2">
                <b-img width="50" :src="cartItem.stock.image" />
              </b-col>
              <b-col cols="3">
                <h6>
                  {{ cartItem.stock.product }}
                </h6>
              </b-col>
              <b-col cols="3">
                <b-form-spinbutton
                  v-model="cartItem.count"
                  @change="makeTotal"
                  min="1"
                  :max="cartItem.stock.quantity"
                  size="sm"
                  inline
                />
              </b-col>
              <b-col cols="2"> ${{ cartItem.stock.price }} </b-col>
              <b-col cols="2">
                <b-button variant="light" @click="removeFromCart(cartItem.id)">
                  <feather-icon icon="XIcon" />
                </b-button>
              </b-col>
            </b-row>
          </b-card>
        </b-card>
      </b-col>
    </b-row>
    {{ cart }}
    <b-modal
      hide-footer
      id="modal-finish-cart"
      scrollable
      title="Finish Cart"
      size="lg"
      cancel-variant="outline-secondary"
    >
      <b-form class="list-view product-checkout">
        <!-- Left Form -->
        <b-card no-body>
          <b-card-body>
            <b-row>
              <b-col cols="12" md="6">
                <b-form-group
                  label="Email"
                  label-for="customer_email"
                  class="mb-2"
                >
                  <b-form-input
                    id="customer_email"
                    v-model="verbal.customer_email"
                    trim
                  />
                </b-form-group>
              </b-col>
              <b-col cols="12" md="6">
                <b-form-group
                  label="First Name"
                  label-for="customer_first_name"
                  class="mb-2"
                >
                  <b-form-input
                    id="customer_first_name"
                    v-model="verbal.customer_first_name"
                    trim
                  />
                </b-form-group>
              </b-col>
              <b-col cols="12" md="6">
                <b-form-group
                  label="Last Name"
                  label-for="customer_last_name"
                  class="mb-2"
                >
                  <b-form-input
                    id="customer_last_name"
                    v-model="verbal.customer_last_name"
                    trim
                  />
                </b-form-group>
              </b-col>
              <b-col cols="12" md="6">
                <b-form-group
                  label="Phone"
                  label-for="customer_phone"
                  class="mb-2"
                >
                  <b-form-input
                    id="customer_phone"
                    v-model="verbal.customer_phone"
                    trim
                  />
                </b-form-group>
              </b-col>
              <b-col cols="12" md="6">
                <b-form-group
                  label="Referral Code"
                  label-for="referral_code"
                  class="mb-2"
                >
                  <b-form-input
                    id="referral_code"
                    v-model="verbal.referral_code"
                    trim
                  />
                </b-form-group>
              </b-col>
            </b-row>
            <b-row>
              <b-col cols="12" md="4">
                <b-button
                  variant="primary"
                  class="mb-1 mb-sm-0 mr-0 mr-sm-1"
                  @click="finishCart"
                >
                  Finish
                </b-button>
              </b-col>
            </b-row>
          </b-card-body>
        </b-card>
      </b-form>
    </b-modal>
  </div>
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
  BFormSpinbutton,
  BImg,
  BLink,
  BBadge,
  BDropdown,
  BDropdownItem,
  BPagination,
  BModal,
  VBModal,
  BFormGroup,
} from "bootstrap-vue";
import vSelect from "vue-select";
import store from "@/store";
import { ref, onUnmounted } from "@vue/composition-api";
import { avatarText } from "@core/utils/filter";
import useVerbal from "./useVerbal";
import verbalStoreModule from "../verbalStoreModule";

export default {
  directives: {
    "b-modal": VBModal,
  },
  components: {
    BFormGroup,
    BModal,
    BCard,
    BRow,
    BCol,
    BFormInput,
    BButton,
    BTable,
    BMedia,
    BAvatar,
    BFormSpinbutton,
    BImg,
    BLink,
    BBadge,
    BDropdown,
    BDropdownItem,
    BPagination,

    vSelect,
  },
  computed: {},
  methods: {},
  data() {
    return {};
  },
  setup() {
    const VERBAL_APP_STORE_MODULE_NAME = "app-verbal";

    // Register module
    if (!store.hasModule(VERBAL_APP_STORE_MODULE_NAME))
      store.registerModule(VERBAL_APP_STORE_MODULE_NAME, verbalStoreModule);

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(VERBAL_APP_STORE_MODULE_NAME))
        store.unregisterModule(VERBAL_APP_STORE_MODULE_NAME);
    });

    const emptyVerbal = {
      shop: 0,
      customer_email: "",
      customer_first_name: "",
      customer_last_name: "",
      customer_phone: "",
      order_items: [],
      referral_code: "",
    };

    const totalCart = ref(0);
    const verbal = ref(emptyVerbal);
    const verbalStockList = ref(false);
    const stocks = ref([]);
    const cart = ref([]);

    const makeTotal = () => {
      let res = 0;
      cart.value.forEach((element) => {
        const a = element.stock.price * element.count;
        res += a;
      });
      totalCart.value = res;
    };

    const changeCount = (stock, id, e) => {
      const obj = { id, count: e, stock };
      const allExept = stocks.value.filter((item) => item.id != id);
      if (e != 0) {
        stocks.value = [...allExept, obj];
      } else stocks.value = [...allExept];
    };

    const addToCart = (id) => {
      const fetch = stocks.value.filter((item) => item.id == id);
      if (fetch.length == 0) return;

      const stock = fetch[0];

      if (cart.value.filter((item) => item.id == id).length == 0) {
        cart.value = [...cart.value, stock];
      } else {
        const oldStock = cart.value.filter((item) => item.id == id)[0];
        oldStock.count = oldStock.count + stock.count;
        const allExept = cart.value.filter((item) => item.id != id);
        cart.value = [...allExept, oldStock];
      }
      makeTotal();
    };

    const removeFromCart = (id) => {
      const newCart = cart.value.filter((item) => item.id != id);

      cart.value = newCart;

      makeTotal();
    };

    const {
      fetchVerbalStocks,
      tableColumns,
      perPage,
      currentPage,
      totalVerbalStocks,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refVerbalStockListTable,
      refetchData,
    } = useVerbal();

    return {
      makeTotal,
      totalCart,
      verbal,
      removeFromCart,
      addToCart,
      cart,
      changeCount,
      stocks,
      verbalStockList,
      // Sidebar

      fetchVerbalStocks,
      tableColumns,
      perPage,
      currentPage,
      totalVerbalStocks,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refVerbalStockListTable,
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
