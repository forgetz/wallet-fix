<template>
  <div class="full-width">


    <mew-input
      v-model="pin"
      label="Pin"
      placeholder="Enter your Pin"
      :rules="pinRules"
      type="text"
    />

    <mew-input
      v-model="confirmpin"
      label="Confirm Pin"
      placeholder="Confirm your Pin"
      :rules="pinRules"
      type="text"
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
            title="Access Wallet"
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

import axios from 'axios';
import store from '@/core/store';
import { isValidPrivate } from 'ethereumjs-util';
import {
  getBufferFromHex,
  sanitizeHex
} from '../../../access-wallet/common/helpers';
import { isString } from 'lodash';
export default {
  name: 'AccessWalletCreatePin',
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
      pin: '',
      confirmpin: '',
      email: store.getters['wallet/getEmail'],
      otpRef: store.getters['wallet/getOTPRef'],
      token: store.getters['wallet/getToken'],
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
      return this.isValidPin && !this.isProcess && this.pin == this.confirmpin;
    },
    /**
     * Property validates whether or not entered private key is valid
     * @return booelan
     */
    isValidPin() {
        console.log(this.pin)
        return this.pin.match(
          /^[0-9]*$/
        );
        return true;
    },

    /**
     * @returns rulles for the email input
     */

    pinRules() {
      return [
         value => !!value || 'Required',
         value => this.isValidPin || 'Please enter valid mobile number'
      ];
    }
  },
  methods: {
    /**
     * Method unlocks private key wallet,
     * Emits to the parent module to enter wallet route
     */

    nextBtn() {
      console.log('nextBtn')
      
      // this.handlerAccessWallet.unlockPrivateKeyWallet(this.actualPrivateKey);
      //  this.$emit('unlock');
      this.isProcess = true;

      axios({
        method: 'post',
        url: 'https://api-wallet.abx.one/set_new_pin',
        data: { 
          email: this.email,
          token: this.token,
          pin: this.pin,
        },
        headers: { 'Content-Type': 'application/json' }
      })
       .then((res) => {
          console.log('set_new_pin', res);

          const response = res.data;
          if (response.message == 'success.') {
            this.verifyPin();
          }

        })
        .catch((e) => {
          console.log('error', e);
          this.isProcess = false;
        });

    },
    verifyPin() {
       axios({
        method: 'post',
        url: 'https://api-wallet.abx.one/verify_pin',
        data: { 
          email: this.email,
          token: this.token,
          pin: this.pin,
        },
        headers: { 'Content-Type': 'application/json' }
      })
       .then((res) => {
          console.log('checkuser', res);

          const response = res.data;
          const privateKey = response.data.key;
          const message = response.message;

          console.log('key', privateKey);
          console.log('msg', message);

          //this.$router.push({ query: { type: 'pin' }});
          // get otp ref

          this.handlerAccessWallet.unlockPrivateKeyWallet(privateKey);
          this.$emit('unlock');

          this.isProcess = false;
        })
        .catch((e) => {
          console.log('error', e);
          this.isProcess = false;
        });

    }
  }
};
</script>
