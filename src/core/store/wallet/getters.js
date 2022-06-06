import { fromWei, toBN } from 'web3-utils';
const balanceInETH = function (state) {
  if (!state.balance) state.balance = '0';
  return fromWei(state.balance);
};

const balanceInWei = function (state) {
  if (!state.balance) state.balance = '0';
  return state.balance.toString();
};

const totalOwnedDomains = function (state) {
  return state.ensDomains ? state.ensDomains.length : 0;
};

const tokensList = function (state) {
  const tokens = state.tokens;
  return tokens.length > 0
    ? tokens.map(item => {
        if (!item.hasOwnProperty('balance')) {
          item.balance = toBN(0);
        } else {
          item.balance = toBN(item.balance);
        }
        return item;
      })
    : [];
};

const initialLoad = function (state) {
  return state.loadingWalletInfo;
};

const getEmail = function (state) {
  return state.email;
};
const getPin = function (state) {
  return state.pin;
};
const getOTP = function (state) {
  return state.otp;
};
const getOTPRef = function (state) {
  return state.otpRef;
};
const getToken = function (state) {
  return state.token;
};

export default {
  balanceInETH,
  balanceInWei,
  totalOwnedDomains,
  tokensList,
  initialLoad,
  getEmail,
  getPin,
  getOTP,
  getOTPRef,
  getToken
};
