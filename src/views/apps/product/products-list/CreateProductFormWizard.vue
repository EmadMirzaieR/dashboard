<template>
  <div>
    <form-wizard
      color="#7367F0"
      :title="null"
      :subtitle="null"
      shape="circle"
      finish-button-text="Submit"
      back-button-text="Previous"
      class="mb-3"
      @on-complete="formSubmitted"
    >
      <tab-content title="Create Product" :before-change="createProduct">
        <validation-observer ref="createRules" tag="form">
          <b-row>
            <b-col cols="12" class="mb-2">
              <h5 class="mb-0">Create Product</h5>
              <!-- <small class="text-muted">
                Enter Your Account Details.
              </small> -->
            </b-col>
            <b-col md="6">
              <b-form-group label="name" label-for="name">
                <validation-provider
                  #default="{ errors }"
                  name="name"
                  rules="required"
                >
                  <b-form-input
                    id="name"
                    v-model="product.name"
                    :state="errors.length > 0 ? false : null"
                    placeholder="name"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group label="slug" label-for="slug">
                <validation-provider
                  #default="{ errors }"
                  name="slug"
                  rules="required"
                >
                  <b-form-input
                    id="slug"
                    v-model="product.slug"
                    type="slug"
                    :state="errors.length > 0 ? false : null"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group label="brand" label-for="brand">
                <validation-provider
                  #default="{ errors }"
                  name="brand"
                  rules="required"
                >
                  <b-form-select
                    v-model="product.brand"
                    :options="brands"
                    :state="product.brand === null ? false : true"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group label="category" label-for="category">
                <validation-provider
                  #default="{ errors }"
                  name="category"
                  rules="required"
                >
                  <b-form-select
                    v-model="product.category"
                    :options="categories"
                    :state="product.category === null ? false : true"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group label="barcode" label-for="barcode">
                <validation-provider #default="{ errors }" name="barcode">
                  <b-form-input
                    id="barcode"
                    v-model="product.barcode"
                    :state="errors.length > 0 ? false : null"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group label="description" label-for="description">
                <validation-provider #default="{ errors }" name="description">
                  <b-form-input
                    id="description"
                    v-model="product.description"
                    :state="errors.length > 0 ? false : null"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group label="tags" label-for="tags">
                <validation-provider #default="{ errors }" name="tags">
                  <b-form-input
                    id="tags"
                    v-model="product.tags"
                    :state="errors.length > 0 ? false : null"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
          </b-row>
        </validation-observer>
      </tab-content>

      <tab-content title="Feature" :before-change="validationFormInfo">
        <validation-observer ref="infoRules" tag="form">
          <b-row>
            <b-col cols="12" class="mb-2">
              <h5 class="mb-0">Feature</h5>
              <small class="text-muted">Enter Your Personal Info.</small>
            </b-col>
            <b-col md="6">
              <b-form-group label="First Name" label-for="first-name">
                <validation-provider
                  #default="{ errors }"
                  name="First Name"
                  rules="required"
                >
                  <b-form-input
                    id="first-name"
                    v-model="first_name"
                    placeholder="John"
                    :state="errors.length > 0 ? false : null"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group label="Last Name" label-for="last-name">
                <validation-provider
                  #default="{ errors }"
                  name="Last Name"
                  rules="required"
                >
                  <b-form-input
                    id="last-name"
                    v-model="last_name"
                    :state="errors.length > 0 ? false : null"
                    placeholder="Doe"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="6">
              <validation-provider
                #default="{ errors }"
                name="Country"
                rules="required"
              >
                <b-form-group
                  label="Country"
                  label-for="country"
                  :state="errors.length > 0 ? false : null"
                >
                  <v-select
                    id="country"
                    v-model="selectedContry"
                    :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                    :options="countryName"
                    :selectable="
                      (option) => !option.value.includes('select_value')
                    "
                    label="text"
                  />
                  <b-form-invalid-feedback
                    :state="errors.length > 0 ? false : null"
                  >
                    {{ errors[0] }}
                  </b-form-invalid-feedback>
                </b-form-group>
              </validation-provider>
            </b-col>
            <b-col md="6">
              <validation-provider
                #default="{ errors }"
                name="Language"
                rules="required"
              >
                <b-form-group
                  label="Language"
                  label-for="language"
                  :state="errors.length > 0 ? false : null"
                >
                  <v-select
                    id="language"
                    v-model="selectedLanguage"
                    :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                    :options="languageName"
                    :selectable="
                      (option) => !option.value.includes('nothing_selected')
                    "
                    label="text"
                  />
                  <b-form-invalid-feedback
                    :state="errors.length > 0 ? false : null"
                  >
                    {{ errors[0] }}
                  </b-form-invalid-feedback>
                </b-form-group>
              </validation-provider>
            </b-col>
          </b-row>
        </validation-observer>
      </tab-content>

      <tab-content title="Color" :before-change="validationFormAddress">
        <validation-observer ref="addressRules" tag="form">
          <b-row>
            <b-col cols="12" class="mb-2">
              <h5 class="mb-0">Color</h5>
              <small class="text-muted">Enter Your Address.</small>
            </b-col>
            <b-col md="6">
              <b-form-group label="Address" label-for="address">
                <validation-provider
                  #default="{ errors }"
                  name="Address"
                  rules="required"
                >
                  <b-form-input
                    id="address"
                    v-model="address"
                    :state="errors.length > 0 ? false : null"
                    placeholder="98 Borough bridge Road, Birmingham"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group label="Landmark" label-for="landmark">
                <validation-provider
                  #default="{ errors }"
                  name="Landmark"
                  rules="required"
                >
                  <b-form-input
                    id="landmark"
                    v-model="landMark"
                    :state="errors.length > 0 ? false : null"
                    placeholder="Borough bridge"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group label="Pincode" label-for="pincode">
                <validation-provider
                  #default="{ errors }"
                  name="Pincode"
                  rules="required"
                >
                  <b-form-input
                    id="pincode"
                    v-model="pincode"
                    :state="errors.length > 0 ? false : null"
                    type="number"
                    placeholder="658921"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group label="City" label-for="city">
                <validation-provider
                  #default="{ errors }"
                  name="City"
                  rules="required"
                >
                  <b-form-input
                    id="city"
                    v-model="city"
                    :state="errors.length > 0 ? false : null"
                    placeholder="Birmingham"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
          </b-row>
        </validation-observer>
      </tab-content>

      <tab-content title="Size" :before-change="validationFormSocial">
        <validation-observer ref="socialRules" tag="form">
          <b-row>
            <b-col cols="12" class="mb-2">
              <h5 class="mb-0">Size</h5>
              <small class="text-muted">Enter Your Social Links</small>
            </b-col>
            <b-col md="6">
              <b-form-group label="Twitter" label-for="twitter">
                <validation-provider
                  #default="{ errors }"
                  name="Twitter"
                  rules="required|url"
                >
                  <b-form-input
                    id="twitter"
                    v-model="twitterUrl"
                    :state="errors.length > 0 ? false : null"
                    placeholder="https://twitter.com/abc"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group label="Facebook" label-for="facebook">
                <validation-provider
                  #default="{ errors }"
                  name="Facebook"
                  rules="required|url"
                >
                  <b-form-input
                    id="facebook"
                    v-model="facebookUrl"
                    :state="errors.length > 0 ? false : null"
                    placeholder="https://facebook.com/abc"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group label="Google+" label-for="google-plus">
                <validation-provider
                  #default="{ errors }"
                  name="Google+"
                  rules="required|url"
                >
                  <b-form-input
                    id="google-plus"
                    v-model="googleUrl"
                    :state="errors.length > 0 ? false : null"
                    placeholder="https://plus.google.com/abc"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group label="LinkedIn" label-for="linked-in">
                <validation-provider
                  #default="{ errors }"
                  name="LinkedIn"
                  rules="required|url"
                >
                  <b-form-input
                    id="linked-in"
                    v-model="linkedinUrl"
                    :state="errors.length > 0 ? false : null"
                    placeholder="https://linkedin.com/abc"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
          </b-row>
        </validation-observer>
      </tab-content>

      <tab-content title="Image" :before-change="validationFormAddress">
        <validation-observer ref="addressRules" tag="form">
          <b-row>
            <b-col cols="12" class="mb-2">
              <h5 class="mb-0">Image</h5>
              <small class="text-muted">Enter Your Address.</small>
            </b-col>
            <b-col md="6">
              <b-form-group label="Address" label-for="address">
                <validation-provider
                  #default="{ errors }"
                  name="Address"
                  rules="required"
                >
                  <b-form-input
                    id="address"
                    v-model="address"
                    :state="errors.length > 0 ? false : null"
                    placeholder="98 Borough bridge Road, Birmingham"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group label="Landmark" label-for="landmark">
                <validation-provider
                  #default="{ errors }"
                  name="Landmark"
                  rules="required"
                >
                  <b-form-input
                    id="landmark"
                    v-model="landMark"
                    :state="errors.length > 0 ? false : null"
                    placeholder="Borough bridge"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group label="Pincode" label-for="pincode">
                <validation-provider
                  #default="{ errors }"
                  name="Pincode"
                  rules="required"
                >
                  <b-form-input
                    id="pincode"
                    v-model="pincode"
                    :state="errors.length > 0 ? false : null"
                    type="number"
                    placeholder="658921"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group label="City" label-for="city">
                <validation-provider
                  #default="{ errors }"
                  name="City"
                  rules="required"
                >
                  <b-form-input
                    id="city"
                    v-model="city"
                    :state="errors.length > 0 ? false : null"
                    placeholder="Birmingham"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
          </b-row>
        </validation-observer>
      </tab-content>

      <tab-content title="Gallery" :before-change="validationFormSocial">
        <validation-observer ref="socialRules" tag="form">
          <b-row>
            <b-col cols="12" class="mb-2">
              <h5 class="mb-0">Gallery</h5>
              <small class="text-muted">Enter Your Social Links</small>
            </b-col>
            <b-col md="6">
              <b-form-group label="Twitter" label-for="twitter">
                <validation-provider
                  #default="{ errors }"
                  name="Twitter"
                  rules="required|url"
                >
                  <b-form-input
                    id="twitter"
                    v-model="twitterUrl"
                    :state="errors.length > 0 ? false : null"
                    placeholder="https://twitter.com/abc"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group label="Facebook" label-for="facebook">
                <validation-provider
                  #default="{ errors }"
                  name="Facebook"
                  rules="required|url"
                >
                  <b-form-input
                    id="facebook"
                    v-model="facebookUrl"
                    :state="errors.length > 0 ? false : null"
                    placeholder="https://facebook.com/abc"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group label="Google+" label-for="google-plus">
                <validation-provider
                  #default="{ errors }"
                  name="Google+"
                  rules="required|url"
                >
                  <b-form-input
                    id="google-plus"
                    v-model="googleUrl"
                    :state="errors.length > 0 ? false : null"
                    placeholder="https://plus.google.com/abc"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group label="LinkedIn" label-for="linked-in">
                <validation-provider
                  #default="{ errors }"
                  name="LinkedIn"
                  rules="required|url"
                >
                  <b-form-input
                    id="linked-in"
                    v-model="linkedinUrl"
                    :state="errors.length > 0 ? false : null"
                    placeholder="https://linkedin.com/abc"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
          </b-row>
        </validation-observer>
      </tab-content>
    </form-wizard>
  </div>
</template>

<script>
import { FormWizard, TabContent } from "vue-form-wizard";
import vSelect from "vue-select";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
import "vue-form-wizard/dist/vue-form-wizard.min.css";
import {
  BRow,
  BCol,
  BFormGroup,
  BFormInput,
  BFormInvalidFeedback,
  BFormSelect,
} from "bootstrap-vue";
import { required, email } from "@validations";
import axios from "@axios";

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
    FormWizard,
    TabContent,
    BRow,
    BCol,
    BFormGroup,
    BFormInput,
    vSelect,
    BFormInvalidFeedback,
    // eslint-disable-next-line vue/no-unused-components
    ToastificationContent,
    BFormSelect,
  },
  data() {
    return {
      product: {
        category: null,
        brand: null,
        tags: "",
        barcode: "",
        slug: "",
        name: "",
      },
      productId:1,
      brands: [
        { value: null, text: "Nothing Selected" },
        { value: 1, text: "1" },
      ],
      categories: [
        { value: null, text: "Nothing Selected" },
        { value: 1, text: "1" },
      ],
      selectedContry: "",
      selectedLanguage: "",
      emailValue: "",
      PasswordValue: "",
      passwordCon: "",
      first_name: "",
      last_name: "",
      address: "",
      landMark: "",
      pincode: "",
      twitterUrl: "",
      facebookUrl: "",
      googleUrl: "",
      linkedinUrl: "",
      city: "",
      required,
      email,
    };
  },
  methods: {
    formSubmitted() {
      this.$toast({
        component: ToastificationContent,
        props: {
          title: "Form Submitted",
          icon: "EditIcon",
          variant: "success",
        },
      });
    },
    validationFormCreate() {
      return new Promise((resolve, reject) => {
        this.$refs.createRules.validate().then((success) => {
          if (success) {
            resolve(true);
          } else {
            reject();
          }
        });
      });
    },
    async createProduct() {
      const validate = await this.validationFormCreate();
      if (validate) {
        return new Promise((resolve, reject) => {
          axios
            .post("/dashboard/products/create-product/", this.$data.product)
            .then((response) => {
              if (response.status === 201) {
                this.$data.productId = response.data.id;
                resolve(true);
              }
              resolve(false);
            })
            .catch(() => reject(false));
        });
      } else return false;
    },
    async editProduct(field) {
        return new Promise((resolve, reject) => {
          axios
            .patch("/dashboard/products/create-product/", this.$data.product)
            .then((response) => {
              if (response.status === 201) {
                this.$data.productId = response.data.id;
                resolve(true);
              }
              resolve(false);
            })
            .catch(() => reject(false));
        });
    },
    validationFormInfo() {
      return new Promise((resolve, reject) => {
        this.$refs.infoRules.validate().then((success) => {
          if (success) {
            resolve(true);
          } else {
            reject();
          }
        });
      });
    },
    validationFormAddress() {
      return new Promise((resolve, reject) => {
        this.$refs.addressRules.validate().then((success) => {
          if (success) {
            resolve(true);
          } else {
            reject();
          }
        });
      });
    },
    validationFormSocial() {
      return new Promise((resolve, reject) => {
        this.$refs.socialRules.validate().then((success) => {
          if (success) {
            resolve(true);
          } else {
            reject();
          }
        });
      });
    },
  },
};
</script>
