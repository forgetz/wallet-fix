import { isHexString } from 'ethereumjs-util';

const SOFTWARE_WALLET_TYPES = {
  KEYSTORE: 'keystore',
  MNEMONIC: 'mnemonic',
  PRIVATE_KEY: 'private-key',
  OVERVIEW: 'overview',
  EMAIL: 'email',
  EMAIL_OTP: 'email-otp',
  MOBILE: 'mobile',
  MOBILE_OTP: 'mobile-otp',
  PIN: 'pin',
  CREATE_PIN: 'create-pin'
};

const isPrivateKey = key => {
  const _priv = key ? key.replace('0x', '') : '';
  return key !== '' && isHexString('0x' + _priv, 32);
};

export { SOFTWARE_WALLET_TYPES, isPrivateKey };
