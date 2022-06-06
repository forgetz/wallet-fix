<template>
  <div class="full-width">
    <h3 class="mb-6">Enter your Email</h3>
    <!--
    =====================================================================================
      Private Key Input
    =====================================================================================
    -->
    <mew-input
      v-model="email"
      label="Email"
      placeholder="Enter your Email"
      :rules="emailRulles"
      type="text"
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
            @click.native="nextBtn"
          />
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
// import { isValidEmail } from '../handlers/helpers';
// import { isValidPrivate } from 'ethereumjs-util';
import axios from 'axios';
import store from '@/core/store';
import {
  getBufferFromHex,
  sanitizeHex
} from '../../../access-wallet/common/helpers';
import { sendOTP } from '../../../../utils/wallet-helpers';
import { isString } from 'lodash';
export default {
  name: 'AccessWalletEmail',
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
      email: '',
      privateKey: '',
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
      return this.acceptTerms && this.isValidEmail && this.isValidMobile;
    },
    /**
     * Property validates whether or not entered private key is valid
     * @return booelan
     */
     isValidEmail() {
         console.log(this.email)
         return this.email.match(
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
         );
     },

     isValidMobile() {
         console.log(this.mobile)
         return true;
     },


    /**
     * @returns rulles for the email input
     */

    emailRulles() {
      return [
         value => !!value || 'Required',
         value => this.isValidEmail || 'Please enter valid email'
      ];
    },
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

    nextBtn() {

      store.dispatch('wallet/setEmail', this.email, { root: true })
      store.dispatch('wallet/setOTPRef', 'ABCDEF', { root: true })
      this.email = '';
      this.$router.push({ query: { type: 'mobile-otp' }});
      //return;

      axios({
        method: 'post',
        url: 'https://api-wallet.abx.one/send_otp',
        data: { email: this.email },
        headers: { 'Content-Type': 'application/json' }
      })
        .then(() => {
          store.dispatch('wallet/setEmail', this.email, { root: true })
          this.email = '';
          this.$router.push({ query: { type: 'mobile-otp' }});

          // get otp ref
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }
};
</script>
