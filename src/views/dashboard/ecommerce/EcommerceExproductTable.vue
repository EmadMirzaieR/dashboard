<template>
  <b-card v-if="data" no-body class="card-company-table">
    <b-card-header>
      <b-card-title>Expensive Products</b-card-title>
    </b-card-header>
    <b-table :items="data" responsive :fields="fields" class="mb-0">
      <!-- company -->

      <!-- category -->
      <template #cell(category)="data">
        <div class="d-flex align-items-center">
          <b-avatar class="mr-1" :variant="data.item.avatarColor">
            <feather-icon size="18" :icon="data.item.avatarIcon" />
          </b-avatar>
          <span>{{ data.item.avatarTitle }}</span>
        </div>
      </template>   
      

      <!-- views -->
      <template #cell(views)="data">
        <div class="d-flex flex-column">
          <span class="font-weight-bolder mb-25">{{
            data.item.viewTitle
          }}</span>
          <span class="font-small-2 text-muted text-nowrap">{{
            data.item.viewsub
          }}</span>
        </div>
      </template>

      <!-- revenue -->
      <template #cell(revenue)="data">
        {{ "$" + data.item.revenue }}
      </template>

      <!-- sales -->
      <template #cell(sales)="data">
        <div class="d-flex align-items-center">
          <span class="font-weight-bolder mr-1">{{
            data.item.sales + "%"
          }}</span>
          <feather-icon
            :icon="data.item.loss ? 'TrendingDownIcon' : 'TrendingUpIcon'"
            :class="data.item.loss ? 'text-danger' : 'text-success'"
          />
        </div>
      </template>
    </b-table>
  </b-card>
</template>

<script>
import {
  BCard,
  BTable,
  BAvatar,
  BImg,
  BCardHeader,
  BCardTitle,
} from "bootstrap-vue";

export default {
  components: {
    BCard,
    BTable,
    BAvatar,
    BImg,
    BCardTitle,
    BCardHeader,
  },
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    title: {
      type: String,
      default: "",
    },
  },

  data() {
    return {
      fields: [
        { key: "id" },
        { key: "name", label: "Name" },
        { key: "color__name", label: "Color" },
        { key: "size__name", label:"Size" },
        { key: "total_purchase_price" },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
@import "~@core/scss/base/bootstrap-extended/include";
@import "~@core/scss/base/components/variables-dark";

.card-company-table ::v-deep td .b-avatar.badge-light-company {
  .dark-layout & {
    background: $theme-dark-body-bg !important;
  }
}
</style>
