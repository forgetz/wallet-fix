<template>
  <div class="full-width">
    <h3 class="mb-6">Enter your OTP we send to {{email}} Ref:{{otpRef}}</h3>
    <!--
    =====================================================================================
      Private Key Input
    =====================================================================================
    -->
    <mew-input
      v-model="mobile"
      label="OTP"
      placeholder="Enter your otp"
      :rules="otpRulles"
      type="number"
    />

    <!--
    =====================================================================================
      Terms Checkbox & Access Button
    =====================================================================================
    -->
    <div class="text-center">
      <v-row dense class="align-center justify-center pt-4">
        <v-col cols="12" sm="4">
          <mew-button
            has-full-width
            title="Verify OTP"
            btn-size="xlarge"
            :disabled="!disableBtn"
            @click.native="verifyOtp"
          />
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>

import store from '@/core/store';
import { isValidPrivate } from 'ethereumjs-util';
import {
  getBufferFromHex,
  sanitizeHex
} from '../../../access-wallet/common/helpers';
import { isString } from 'lodash';
export default {
  name: 'AccessWalletMobileOtp',
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
      email: store.getters['wallet/getEmail'],
      otpRef: store.getters['wallet/getOTPRef'],
      otp: '',
      token: '',
      acceptTerms: true,
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
      return this.acceptTerms && this.isValidOTP;
    },
    /**
     * Property validates whether or not entered private key is valid
     * @return booelan
     */
    isValidOTP() {
        console.log(this.otp)
        return this.otp.match(
          /^[0-9]*$/
        );
        return true;
    },

    /**
     * @returns rulles for the email input
     */

    otpRulles() {
      return [
         value => !!value || 'Required',
         value => this.isValidOTP || 'Please enter valid mobile number'
      ];
    }
  },
  methods: {
    /**
     * Method unlocks private key wallet,
     * Emits to the parent module to enter wallet route
     */
    verifyOtp() {
      console.log('unlock')
      
      // this.handlerAccessWallet.unlockPrivateKeyWallet(this.actualPrivateKey);
      //  this.$emit('unlock');

      
      this.email = '';
      this.$router.push({ query: { type: 'mobile-otp' }});

      axios({
        method: 'post',
        url: 'http://65.21.76.96:3077/verify_otp',
        data: { 
          email: this.email,
          otp_ref: this.otpRef,
          otp: this.otp
        },
        headers: { 'Content-Type': 'application/json' }
      })
        .then((res) => {
          console.log(res);

          store.dispatch('wallet/setToken', res.user_token, { root: true })
          this.otp = '';
          this.token = res.user_token;
          
          
          // get otp ref
        })
        .catch((e) => {
          console.log(e);
        });
    },
    checkUser() {
      axios({
        method: 'post',
        url: 'http://65.21.76.96:3077/check_user',
        data: { 
          email: this.email,
          token: this.token
        },
        headers: { 'Content-Type': 'application/json' }
      })
       .then((res) => {
          console.log(res);

          store.dispatch('wallet/setToken', res.user_token, { root: true })
          this.otp = '';

          this.$router.push({ query: { type: 'pin' }});
          
          // get otp ref
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }
};
</script>
