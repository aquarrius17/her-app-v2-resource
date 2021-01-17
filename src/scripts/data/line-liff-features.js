import liff from '@line/liff';
import CONFIG from '../globals/config';

class LiffFeatures {
  static init() {
    try {
      return liff.init({ liffId: CONFIG.LIFF_ID });
    } catch (error) {
      return error;
    }
  }

  static isInClient() {
    try {
      return liff.isInClient();
    } catch (error) {
      return error;
    }
  }

  static isLoggedIn() {
    try {
      return liff.isLoggedIn();
    } catch (error) {
      return error;
    }
  }

  static login() {
    try {
      return liff.login();
    } catch (error) {
      return error;
    }
  }

  static logout() {
    try {
      return liff.logout();
    } catch (error) {
      return error;
    }
  }

  static async getProfile() {
    try {
      const getProfile = await liff.getProfile();
      return getProfile;
    } catch (error) {
      return error;
    }
  }

  static getLanguage() {
    try {
      return liff.getLanguage();
    } catch (error) {
      return error;
    }
  }

  static openWindow(urlValue, externalValue) {
    try {
      return liff.openWindow({
        url: urlValue,
        external: externalValue,
      });
    } catch (error) {
      return error;
    }
  }

  static async scanCode() {
    try {
      const scanCode = await liff.scanCode();
      const resultObject = await JSON.stringify(scanCode);
      const result = await JSON.parse(resultObject);
      return result.value;
    } catch (error) {
      return error;
    }
  }

  static async sendMessages(name, message) {
    try {
      return await liff.sendMessages(
        [
          {
            type: 'text',
            text: `From ${name},\n${message}`,
          },
        ],
      );
    } catch (error) {
      return error;
    }
  }

  static async order({
    name, listFood, listDrink, restaurantApi,
  }) {
    try {
      const paymentFood = listFood.length * 23000;
      const paymentDrink = listDrink.length * 10000;
      const payment = paymentFood + paymentDrink;
      return await liff.sendMessages(
        [
          {
            type: 'text',
            text: `Dari lestoran ${restaurantApi.name},\n${restaurantApi.address}, ${restaurantApi.city}\n\nHi ${name},\n\nTerima kasih telah memesan di lestoran kami, berikut adalah review pesanannya:\n\n${listFood.join(', ')}\n\n${listDrink.join(', ')}\n\nDengan total pembayaran senilai:\n\nRp ${payment.toString()}\n\nPesanan anda akan segera diproses dan segeralah diambil ke lestoran kami dengan alamat yang tertera diatas.\n\nMohon diambil segera ya!`,
          },
        ],
      );
    } catch (error) {
      return error;
    }
  }

  static async orderDelivery({
    name, listFood, listDrink, restaurantApi, address,
  }) {
    try {
      const paymentFood = listFood.length * 23000;
      const paymentDrink = listDrink.length * 10000;
      const payment = paymentFood + paymentDrink;
      return await liff.sendMessages(
        [
          {
            type: 'text',
            text: `Dari lestoran ${restaurantApi.name},\n${restaurantApi.address}, ${restaurantApi.city}\n\nHi ${name},\n\nTerima kasih telah memesan di lestoran kami, berikut adalah review pesanannya:\n\n${listFood.join(', ')}\n\n${listDrink.join(', ')}\n\nDengan total pembayaran senilai:\n\nRp ${payment.toString()}\n\nPesanan anda akan segera diproses dan akan langsung dikirim ke tempat anda yang berlokasi di ${address}.\n\nMohon ditunggu ya!`,
          },
        ],
      );
    } catch (error) {
      return error;
    }
  }
}

export default LiffFeatures;
