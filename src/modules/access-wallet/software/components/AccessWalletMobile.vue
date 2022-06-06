<template>
  <div class="full-width">
    <h3 class="mb-6">Enter your Mobile</h3>
    <!--
    =====================================================================================
      Private Key Input
    =====================================================================================
    -->
    <mew-input
      v-model="mobile"
      label="Mobile"
      placeholder="Enter your mobile"
      :rules="mobileRulles"
      type="number"
      maxlength="10"
    />
    <!--
    =====================================================================================
      Terms Checkbox & Access Button
    =====================================================================================
    -->
    <div class="text-center">
      <mew-checkbox
        v-model="acceptTerms"
        label="To access my wallet, I accept "
        :link="link"
        class="justify-center"
      />
      <v-row dense class="align-center justify-center pt-4">
        <v-col cols="12" sm="4">
          <mew-button
            has-full-width
            title="Next"
            btn-size="xlarge"
            :disabled="!disableBtn"
            @click.native="unlockBtn"
          />
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import { isValidPrivate } from 'ethereumjs-util';
import {
  getBufferFromHex,
  sanitizeHex
} from '../../../access-wallet/common/helpers';
import { isString } from 'lodash';
export default {
  name: 'AccessWalletMobile',
  props: {
    handlerAccessWallet: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      mobile: '',
      acceptTerms: false,
      link: {
        title: 'Terms',
        url: 'https://www.myetherwallet.com/terms-of-service'
      }
    };
  },
  computed: {
    /**
     * Property that controls Access Wallet button
     * Button is enabled when terms were accepted and
     * private key entered is valid
     * @return boolean
     */
    disableBtn() {
      return this.acceptTerms && this.isValidMobile;
    },
    /**
     * Property validates whether or not entered private key is valid
     * @return booelan
     */
     isValidMobile() {
         console.log(this.mobile)
         return true;
     },

    /**
     * @returns rulles for the email input
     */

    mobileRulles() {
      return [
         value => !!value || 'Required',
         value => this.isValidMobile || 'Please enter valid mobile number'
      ];
    }
  },
  methods: {
    /**
     * Method unlocks private key wallet,
     * Emits to the parent module to enter wallet route
     */
    unlockBtn() {
        console.log('unlock')
      // this.handlerAccessWallet.unlockPrivateKeyWallet(this.actualPrivateKey);
      //  this.$emit('unlock');
       this.$router.push({ query: { type: 'mobile-otp' }});
       this.mobile = '';
    }
  }
};
</script>
