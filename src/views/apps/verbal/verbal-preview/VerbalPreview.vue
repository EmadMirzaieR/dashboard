<template>
  <section class="invoice-preview-wrapper">
    <!-- Alert: No item found -->
    <b-alert variant="danger" :show="invoice === undefined">
      <h4 class="alert-heading">Error fetching invoice data</h4>
    </b-alert>

    <b-row v-if="invoice" class="invoice-preview">
      <!-- Col: Left (Invoice Container) -->
      <b-col cols="12" xl="9" md="8">
        <b-card no-body class="invoice-preview-card">
          <!-- Header -->
          <b-card-body class="invoice-padding pb-0">
            <div
              class="
                d-flex
                justify-content-between
                flex-md-row flex-column
                invoice-spacing
                mt-0
              "
            >
              <!-- Header: Left Content -->
              <!-- <div>
                <div class="logo-wrapper">
                  <logo />
                  <h3 class="text-primary invoice-logo">Vuexy</h3>
                </div>
                <p class="card-text mb-25">
                  Office 149, 450 South Brand Brooklyn
                </p>
                <p class="card-text mb-25">San Diego County, CA 91905, USA</p>
                <p class="card-text mb-0">
                  +1 (123) 456 7891, +44 (876) 543 2198
                </p>
              </div> -->

              <!-- Header: Right Content -->
              <div class="mt-md-0 mt-2">
                <h4 class="invoice-title">
                  Invoice
                  <span class="invoice-number">#{{ invoice.id }}</span>
                </h4>
                <div class="invoice-date-wrapper">
                  <p class="invoice-date-title">Date Issued:</p>
                  <p class="invoice-date">
                    {{ new Date(invoice.created_at) }}
                  </p>
                </div>
                <!-- <div class="invoice-date-wrapper">
                  <p class="invoice-date-title">Due Date:</p>
                  <p class="invoice-date">
                    {{ invoice.dueDate }}
                  </p>
                </div> -->
              </div>
            </div>
          </b-card-body>

          <!-- Spacer -->
          <hr class="invoice-spacing" />

          <!-- Invoice Client & Payment Details -->
          <b-card-body v-if="invoice.client" class="invoice-padding pt-0">
            <b-row class="invoice-spacing">
              <!-- Col: Invoice To -->
              <b-col cols="12" xl="6" class="p-0">
                <h6 class="mb-25">
                  {{ invoiceData.client.name }}
                </h6>
                <p class="card-text mb-25">
                  {{ invoiceData.client.address }},
                  {{ invoiceData.client.country }}
                </p>
              </b-col>

              <!-- Col: Payment Details -->
              <b-col
                xl="6"
                cols="12"
                class="p-0 mt-xl-0 mt-2 d-flex justify-content-xl-end"
              >
                <div>
                  <h6 class="mb-2">Payment Details:</h6>
                  <table>
                    <tbody>
                      <tr>
                        <td class="pr-1">Total Due:</td>
                        <td>
                          <span class="font-weight-bold">{{
                            paymentDetails.totalDue
                          }}</span>
                        </td>
                      </tr>
                      <tr>
                        <td class="pr-1">Bank name:</td>
                        <td>{{ paymentDetails.bankName }}</td>
                      </tr>
                      <tr>
                        <td class="pr-1">Country:</td>
                        <td>{{ paymentDetails.country }}</td>
                      </tr>
                      <tr>
                        <td class="pr-1">IBAN:</td>
                        <td>{{ paymentDetails.iban }}</td>
                      </tr>
                      <tr>
                        <td class="pr-1">SWIFT code:</td>
                        <td>{{ paymentDetails.swiftCode }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </b-col>
            </b-row>
          </b-card-body>

          <!-- Invoice Description: Table -->
          <b-table-lite
            responsive
            :items="invoice.order_items"
            :fields="['id', 'name', 'price']"
          >
            <template #cell(name)="data">
              <b-card-text class="font-weight-bold mb-25">
                {{ data.item.stock.product.name }}
              </b-card-text>
            </template>
          </b-table-lite>

          <!-- Invoice Description: Total -->
          <b-card-body class="invoice-padding pb-0">
            <b-row>
              <!-- Col: Sales Persion -->
              <b-col
                cols="12"
                md="6"
                class="mt-md-0 mt-3"
                order="2"
                order-md="1"
              >
                <!-- <b-card-text class="mb-0">
                  <span class="font-weight-bold">Salesperson:</span>
                  <span class="ml-75">Alfie Solomons</span>
                </b-card-text> -->
              </b-col>

              <!-- Col: Total -->
              <b-col
                cols="12"
                md="6"
                class="mt-md-6 d-flex justify-content-end"
                order="1"
                order-md="2"
              >
                <div class="invoice-total-wrapper">
                  <div class="invoice-total-item">
                    <p class="invoice-total-title">Subtotal:</p>
                    <p class="invoice-total-amount">
                      {{ invoice.total_price }}
                    </p>
                  </div>
                  <div class="invoice-total-item">
                    <p class="invoice-total-title">Discount:</p>
                    <p class="invoice-total-amount">
                      ${{ invoice.total_discount }}
                    </p>
                  </div>
                  <hr class="my-50" />
                  <div class="invoice-total-item">
                    <p class="invoice-total-title">Total:</p>
                    <p class="invoice-total-amount">
                      ${{ invoice.final_price }}
                    </p>
                  </div>
                </div>
              </b-col>
            </b-row>
          </b-card-body>

          <!-- Spacer -->
          <hr class="invoice-spacing" />

          <!-- Note -->
          <!-- <b-card-body class="invoice-padding pt-0">
            <span class="font-weight-bold">Note: </span>
            <span
              >It was a pleasure working with you and your team. We hope you
              will keep us in mind for future freelance projects. Thank
              You!</span
            >
          </b-card-body> -->
        </b-card>
      </b-col>

      <!-- Right Col: Card -->
      <b-col cols="12" md="4" xl="3" class="invoice-actions">
        <b-card>
          <!-- Button: Send Invoice -->

          <!-- Button: DOwnload -->

          <!-- Button: Print -->
          <b-button
            v-ripple.400="'rgba(186, 191, 199, 0.15)'"
            variant="outline-secondary"
            class="mb-75"
            block
            @click="printInvoice"
          >
            Print
          </b-button>
        </b-card>
      </b-col>
    </b-row>
  </section>
</template>

<script>
import { ref, onUnmounted } from "@vue/composition-api";
import store from "@/store";
import router from "@/router";
import {
  BRow,
  BCol,
  BCard,
  BCardBody,
  BTableLite,
  BCardText,
  BButton,
  BAlert,
  BLink,
  VBToggle,
} from "bootstrap-vue";
import Logo from "@core/layouts/components/Logo.vue";
import Ripple from "vue-ripple-directive";
import verbalStoreModule from "../verbalStoreModule";

export default {
  directives: {
    Ripple,
    "b-toggle": VBToggle,
  },
  props: ["invoice"],
  components: {
    BRow,
    BCol,
    BCard,
    BCardBody,
    BTableLite,
    BCardText,
    BButton,
    BAlert,
    BLink,

    Logo,
  },
  setup() {
    const invoiceData = ref(null);
    const paymentDetails = ref({});

    // Invoice Description
    // ? Your real data will contain this information
    const invoiceDescription = [
      {
        taskTitle: "Native App Development",
        taskDescription:
          "Developed a full stack native app using React Native, Bootstrap & Python",
        rate: "$60.00",
        hours: "30",
        total: "$1,800.00",
      },
      {
        taskTitle: "UI Kit Design",
        taskDescription:
          "Designed a UI kit for native app using Sketch, Figma & Adobe XD",
        rate: "$60.00",
        hours: "20",
        total: "$1200.00",
      },
    ];

    const INVOICE_APP_STORE_MODULE_NAME = "app-verbal";

    // Register module
    if (!store.hasModule(INVOICE_APP_STORE_MODULE_NAME))
      store.registerModule(INVOICE_APP_STORE_MODULE_NAME, verbalStoreModule);

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(INVOICE_APP_STORE_MODULE_NAME))
        store.unregisterModule(INVOICE_APP_STORE_MODULE_NAME);
    });

    // store.dispatch('app-verbal/fetchInvoice', { id: router.currentRoute.params.id })
    //   .then(response => {
    //     invoiceData.value = response.data.invoice
    //     paymentDetails.value = response.data.paymentDetails
    //   })
    //   .catch(error => {
    //     if (error.response.status === 404) {
    //       invoiceData.value = undefined
    //     }
    //   })

    const printInvoice = () => {
      window.print();
    };

    return {
      invoiceData,
      paymentDetails,
      invoiceDescription,
      printInvoice,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "~@core/scss/base/pages/app-invoice.scss";
</style>

<style lang="scss">
@media print {
  // Global Styles
  body {
    background-color: transparent !important;
  }
  nav.header-navbar {
    display: none;
  }
  .main-menu {
    display: none;
  }
  .header-navbar-shadow {
    display: none !important;
  }
  .content.app-content {
    margin-left: 0;
    padding-top: 2rem !important;
  }
  footer.footer {
    display: none;
  }
  .card {
    background-color: transparent;
    box-shadow: none;
  }
  .customizer-toggle {
    display: none !important;
  }

  // Invoice Specific Styles
  .invoice-preview-wrapper {
    .row.invoice-preview {
      .col-md-8 {
        max-width: 100%;
        flex-grow: 1;
      }

      .invoice-preview-card {
        .card-body:nth-of-type(2) {
          .row {
            > .col-12 {
              max-width: 50% !important;
            }

            .col-12:nth-child(2) {
              display: flex;
              align-items: flex-start;
              justify-content: flex-end;
              margin-top: 0 !important;
            }
          }
        }
      }
    }

    // Action Right Col
    .invoice-actions {
      display: none;
    }
  }
}
</style>
