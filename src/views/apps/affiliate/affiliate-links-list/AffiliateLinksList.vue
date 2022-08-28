<template>
  <b-card no-body class="mb-0">
    <b-table
      ref="refAffiliateLinksListTable"
      class="position-relative"
      :items="fetchAffiliateLinksList"
      responsive
      :fields="tableColumns"
      primary-key="id"
      :sort-by.sync="sortBy"
      show-empty
      empty-text="No matching records found"
      :sort-desc.sync="isSortDirDesc"
    >
      <template #cell(user)="data">
        {{ data.item.user.first_name + " " + data.item.user.last_name }}
      </template>

      <template #cell(created_at)="data">
        {{ new Date(data.item.created_at) }}
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
            :total-rows="totalAffiliateLinks"
            :per-page="perPage"
            first-number
            last-number
            class="mb-0 mt-1 mt-sm-0"
            prev-class="prev-item"
            next-class="next-item"
          >
            <template #prev-text>
              <feather-icon icon="ChevronLeftIcon" order="18" />
            </template>
            <template #next-text>
              <feather-icon icon="ChevronRightIcon" order="18" />
            </template>
          </b-pagination>
        </b-col>
      </b-row>
    </div>
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
  BButtonToolbar,
  BButtonGroup,
} from "bootstrap-vue";
import vSelect from "vue-select";
import store from "@/store";
import { ref, onUnmounted } from "@vue/composition-api";
import { avatarText } from "@core/utils/filter";
import useAffiliateLinksList from "./useAffiliateLinksList";
import affiliateStoreModule from "../affiliateStoreModule";

export default {
  components: {
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

    BButtonToolbar,
    BButtonGroup,

    vSelect,
  },
  methods: {},
  setup() {
    const AFFILIATE_APP_STORE_MODULE_NAME = "app-affiliate";

    // Register module
    if (!store.hasModule(AFFILIATE_APP_STORE_MODULE_NAME))
      store.registerModule(
        AFFILIATE_APP_STORE_MODULE_NAME,
        affiliateStoreModule
      );

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(AFFILIATE_APP_STORE_MODULE_NAME))
        store.unregisterModule(AFFILIATE_APP_STORE_MODULE_NAME);
    });

    const {
      fetchAffiliateLinksList,
      tableColumns,
      perPage,
      currentPage,
      totalAffiliateLinks,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refAffiliateLinksListTable,
      refetchData,

      // UI
      resolveStatusVariant,
    } = useAffiliateLinksList();

    return {
      // Sidebar
      fetchAffiliateLinksList,
      tableColumns,
      perPage,
      currentPage,
      totalAffiliateLinks,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refAffiliateLinksListTable,
      refetchData,

      // Filter
      avatarText,

      // UI
      resolveStatusVariant,
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
