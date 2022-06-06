<template>
  <div class="full-width">
    <h3 class="mb-6">Enter your OTP we send to {{email}} Ref: {{otpRef}}</h3>
    <!--
    =====================================================================================
      Private Key Input
    =====================================================================================
    -->
    <mew-input
      v-model="otp"
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
import axios from 'axios';
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
      isProcess: false,
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
      return this.isValidOTP && !this.isProcess;
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
         value => this.isValidOTP || 'Please enter valid OTP'
      ];
    }
  },
  methods: {
    /**
     * Method unlocks private key wallet,
     * Emits to the parent module to enter wallet route
     */
    verifyOtp() {
      console.log('verifyOtp')

      this.isProcess = true;

      axios({
        method: 'post',
        url: 'https://api-wallet.abx.one/verify_otp',
        data: { 
          email: this.email,
          otp_ref: this.otpRef,
          otp: this.otp
        },
        headers: { 'Content-Type': 'application/json' }
      })
        .then((res) => {
          console.log('res', res);
          const response = res.data.data;
          const token = response.user_token;
          console.log('token', token);

          store.dispatch('wallet/setToken', token, { root: true })

          this.otp = '';
          this.token = token;
          this.checkUser();
          // get otp ref
        })
        .catch((e) => {
          console.log('error', e);
          this.isProcess = false;
        });
    },
    
    checkUser() {
      axios({
        method: 'post',
        url: 'https://api-wallet.abx.one/check_user',
        data: { 
          email: this.email,
          token: this.token
        },
        headers: { 'Content-Type': 'application/json' }
      })
       .then((res) => {
          console.log('checkuser', res);

          const response = res.data.data;
          const pinned = response.pinned;

          if (pinned) {
            console.log('pinned')
            this.$router.push({ query: { type: 'pin' }});
            return;

          } else {
            console.log('not pinned')
            this.$router.push({ query: { type: 'pin' }});
            return;
          }


          this.isProcess = false;

          //this.$router.push({ query: { type: 'pin' }});
          // get otp ref
        })
        .catch((e) => {
          console.log('error', e);
          this.isProcess = false;
        });
    }
  }
};
</script>
