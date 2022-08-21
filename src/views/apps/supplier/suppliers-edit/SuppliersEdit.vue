<template>
  <component :is="supplierData === undefined ? 'div' : 'b-card'">
    <!-- Alert: No item found -->
    <b-alert variant="danger" :show="supplierData === undefined">
      <h4 class="alert-heading">Error fetching supplier data</h4>
      <div class="alert-body">
        No supplier found with this supplier id. Check
        <b-link class="alert-link" :to="{ name: 'apps-suppliers-list' }">
          Supplier List
        </b-link>
        for other suppliers.
      </div>
    </b-alert>

    <b-tabs v-if="supplierData" pills>
      <!-- Tab: Account -->
      <b-tab active>
        <template #title>
          <feather-icon icon="SupplierIcon" supplier="16" class="mr-0 mr-sm-50" />
          <span class="d-none d-sm-inline">Supplier</span>
        </template>
        <supplier-edit-tab :supplier-data="supplierData" class="mt-2 pt-75" />
      </b-tab>
    </b-tabs>
  </component>
</template>

<script>
import { BTab, BTabs, BCard, BAlert, BLink } from "bootstrap-vue";
import { ref, onUnmounted } from "@vue/composition-api";
import router from "@/router";
import store from "@/store";
import supplierStoreModule from "../supplierStoreModule";
import SupplierEditTab from "./SupplierEditTab.vue";

export default {
  components: {
    BTab,
    BTabs,
    BCard,
    BAlert,
    BLink,
    SupplierEditTab,
  },
  setup() {
    const supplierData = ref(null);

    const Supplier_APP_STORE_MODULE_NAME = "app-supplier";

    // Register module
    if (!store.hasModule(Supplier_APP_STORE_MODULE_NAME))
      store.registerModule(Supplier_APP_STORE_MODULE_NAME, supplierStoreModule);

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(Supplier_APP_STORE_MODULE_NAME))
        store.unregisterModule(Supplier_APP_STORE_MODULE_NAME);
    });

    store
      .dispatch("app-supplier/fetchSupplier", { id: router.currentRoute.params.id })
      .then((response) => {
        supplierData.value = response.data;
      })
      .catch((error) => {
        if (error.response.status === 404) {
          supplierData.value = undefined;
        }
      });

    return {
      supplierData,
    };
  },
};
</script>

<style>
</style>
