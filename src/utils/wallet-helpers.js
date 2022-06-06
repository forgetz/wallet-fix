import axios from 'axios';

export default {
   actions: {
      async sendOTP({ commit, getters }) {
         console.log('snedotp')
         try {
            let config = {
               headers: {},
               params: {
                  email: getters.email,
               },
             };
            let data = await axios.post(process.env.WALLET_SERVICE_ENDPOINT, config);
            console.log('sendOTP', data);
            return data;
         } catch (err) {
            console.log(err);
         }
      }
   }
}

