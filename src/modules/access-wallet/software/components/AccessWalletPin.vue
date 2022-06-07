<template>
  <div class="full-width">
    <v-container class="bg-z w-100">
      <v-layout row justify-center>
        <v-flex xs12 sm7 md5 lg4>
          <v-layout row wrap justify-center>
            <v-flex xs12 class="text-xs-center mt-4">
              <v-icon size="40" dark class="material-icons-outlined"
                >lock</v-icon
              >
            </v-flex>
            <v-flex xs12 mt-4>
              <p class="text-center">
                กรุณายืนยันรหัสผ่านความปลอดภัย 6 หลัก 
              </p>
            </v-flex>
            
            <v-flex xs12 class="text-xs-center mt-2">
              <v-container grid-list-xs px-3>
                <v-layout row wrap>
                  <v-flex xs4>
                    <v-btn
                      fab
                      dark
                      :disabled="Pin.length >= 6"
                      :ripple="true"
                      @click="addVerify('1')"
                    >
                      <label class="text-btn">1</label>
                    </v-btn>
                  </v-flex>
                  <v-flex xs4>
                    <v-btn
                      fab
                      dark
                      :disabled="Pin.length >= 6"
                      :ripple="true"
                      @click="addVerify('2')"
                    >
                      <label class="text-btn">2</label>
                    </v-btn>
                  </v-flex>
                  <v-flex xs4>
                    <v-btn
                      fab
                      dark
                      :disabled="Pin.length >= 6"
                      :ripple="true"
                      @click="addVerify('3')"
                    >
                      <label class="text-btn">3</label>
                    </v-btn>
                  </v-flex>
                  <v-flex xs4>
                    <v-btn
                      fab
                      dark
                      :disabled="Pin.length >= 6"
                      :ripple="true"
                      @click="addVerify('4')"
                    >
                      <label class="text-btn">4</label>
                    </v-btn>
                  </v-flex>
                  <v-flex xs4>
                    <v-btn
                      fab
                      dark
                      :disabled="Pin.length >= 6"
                      :ripple="true"
                      @click="addVerify('5')"
                    >
                      <label class="text-btn">5</label>
                    </v-btn>
                  </v-flex>
                  <v-flex xs4>
                    <v-btn
                      fab
                      dark
                      :disabled="Pin.length >= 6"
                      :ripple="true"
                      @click="addVerify('6')"
                    >
                      <label class="text-btn">6</label>
                    </v-btn>
                  </v-flex>
                  <v-flex xs4>
                    <v-btn
                      fab
                      dark
                      :disabled="Pin.length >= 6"
                      :ripple="true"
                      @click="addVerify('7')"
                    >
                      <label class="text-btn">7</label>
                    </v-btn>
                  </v-flex>
                  <v-flex xs4>
                    <v-btn
                      fab
                      dark
                      :disabled="Pin.length >= 6"
                      :ripple="true"
                      @click="addVerify('8')"
                    >
                      <label class="text-btn">8</label>
                    </v-btn>
                  </v-flex>
                  <v-flex xs4>
                    <v-btn
                      fab
                      dark
                      :disabled="Pin.length >= 6"
                      :ripple="true"
                      @click="addVerify('9')"
                    >
                      <label class="text-btn">9</label>
                    </v-btn>
                  </v-flex>
                  <v-flex xs4></v-flex>
                  <v-flex xs4>
                    <v-btn
                      fab
                      dark
                      :disabled="Pin.length >= 6"
                      :ripple="true"
                      @click="addVerify('0')"
                    >
                      <label class="text-btn">0</label>
                    </v-btn>
                  </v-flex>
                  <v-flex xs4>
                    <div class="d-flex justify-center align-center h-100 w-100">
                      <v-icon
                        x-large
                        dark
                        :ripple="false"
                        @click="decrementVerify()"
                        >backspace</v-icon
                      >
                    </div>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-container>

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
  name: 'AccessWalletPin',
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
      Pin: '',
      email: store.getters['wallet/getEmail'],
      otpRef: store.getters['wallet/getOTPRef'],
      token: store.getters['wallet/getToken'],
      isProcess: false,
      otp: '',
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
         value => this.isValidOTP || 'Please enter valid mobile number'
      ];
    }
  },
  methods: {
    /**
     * Method unlocks private key wallet,
     * Emits to the parent module to enter wallet route
     */
    addVerify(val) {
      this.Pin += val;
    },
    decrementVerify() {
      this.Pin = this.Pin.substring(0, this.Pin.length - 1);
    },
     
    nextBtn() {
      console.log('nextBtn')
      
      // this.handlerAccessWallet.unlockPrivateKeyWallet(this.actualPrivateKey);
      //  this.$emit('unlock');
      this.isProcess = true;

      axios({
        method: 'post',
        url: 'https://api-wallet.abx.one/verify_pin',
        data: { 
          email: this.email,
          token: this.token,
          pin: this.Pin,
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
