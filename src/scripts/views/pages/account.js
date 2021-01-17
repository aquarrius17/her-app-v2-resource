import {
  createNotLoginAccountTemplate,
  createSuccessfulLoginAccountTemplate,
  createLiffOtherFeaturesTemplate,
  createRequestFailedEmptyTemplate,
  createResultOtherFeaturesTemplate,
  createSendMessagesTemplate,
  createResultOtherFeaturesFailedTemplate,
} from '../templates/template-creator';
import LiffFeatures from '../../data/line-liff-features';
import popup from '../../data/popup';
import CONFIG from '../../globals/config';

const Account = {
  async render() {
    return `
      <div id="accountContent">
        <div class="loader"></div>
      </div>
    `;
  },

  async afterRender() {
    const loaderContainer = document.querySelector('.loader');
    const accountContainer = document.querySelector('#accountContent');

    if (LiffFeatures.isInClient() || LiffFeatures.isLoggedIn()) {
      try {
        const getProfile = LiffFeatures.getProfile();
        const getPicture = (await getProfile).pictureUrl;
        const getName = (await getProfile).displayName;
        let getStatus = (await getProfile).statusMessage;

        if (getStatus === undefined) {
          getStatus = '-';
        }

        if (getName === undefined) {
          popup.showAlert('An error has occurred, please check your internet connection');
          accountContainer.innerHTML = createRequestFailedEmptyTemplate();
        } else {
          accountContainer.innerHTML = createSuccessfulLoginAccountTemplate({
            picture: getPicture,
            name: getName,
            language: LiffFeatures.getLanguage(),
            status: getStatus,
          });

          this.renderLiffOtherFeatures();

          if (LiffFeatures.isInClient()) {
            this.hiddenBtnLogout();
          }

          this.btnLogoutLogic();

          this.btnOpenWindowLogic();
          this.btnScanQrLogic();
          this.btnSendMessagesLogic(getName);
        }
      } catch (error) {
        accountContainer.innerHTML = createRequestFailedEmptyTemplate();
        accountContainer.addEventListener('click', () => {
          setTimeout(() => {
            popup.showAlert(`${error.message}, Please check your internet connection`);
          }, 500);
        });
      }
    } else {
      try {
        accountContainer.innerHTML = createNotLoginAccountTemplate();
        this.renderLiffOtherFeatures();
        this.btnLoggedInLogic();

        const btnFeatureFavorite = document.querySelector('#btn__feature__openWindow');
        const btnFeatureScanQr = document.querySelector('#btn__feature__scan__qr');
        const btnFeatureSendMessage = document.querySelector('#btn__feature__send__message');

        const btnOtherFeatures = [btnFeatureFavorite, btnFeatureScanQr, btnFeatureSendMessage];

        btnOtherFeatures.forEach((btn) => {
          btn.addEventListener('click', () => {
            popup.showAlert('You must be logged in to be able to use this feature!');
          });
        });
      } catch {
        accountContainer.innerHTML = createRequestFailedEmptyTemplate();
        accountContainer.addEventListener('click', () => {
          setTimeout(() => {
            popup.showAlert('Please check your internet connection');
          }, 500);
        });
      }
    }
    loaderContainer.style.display = 'none';
  },

  async renderLiffOtherFeatures() {
    const liffOtherFeatures = document.querySelector('.other__features');
    liffOtherFeatures.innerHTML = createLiffOtherFeaturesTemplate();
  },

  async btnLoggedInLogic() {
    const btnLoginContainer = document.querySelector('#btn__login');
    btnLoginContainer.addEventListener('click', () => {
      LiffFeatures.login();
    });
  },

  async btnLogoutLogic() {
    const btnLogoutContainer = document.querySelector('#btn__logout');
    btnLogoutContainer.addEventListener('click', () => {
      if (popup.showConfirm('Are you sure you want to logout?')) {
        LiffFeatures.logout();
        location.reload();
      }
    });
  },

  async hiddenBtnLogout() {
    const btnLogoutContainer = document.querySelector('#btn__logout');
    btnLogoutContainer.classList.toggle('hidden');
  },

  async btnOpenWindowLogic() {
    const btnOpenWindow = document.querySelector('#btn__feature__openWindow');
    let urlValue = CONFIG.URL_LIFF;
    let externalValue = false;
    if (LiffFeatures.isInClient()) {
      urlValue = CONFIG.URL_WEB;
      externalValue = true;
    }
    btnOpenWindow.addEventListener('click', () => {
      LiffFeatures.openWindow(urlValue, externalValue);
    });
  },

  async btnScanQrLogic() {
    const btnScanQr = document.querySelector('#btn__feature__scan__qr');
    const resultOtherFeaturesContainer = document.querySelector('.result__other__features');
    btnScanQr.addEventListener('click', async () => {
      if (LiffFeatures.isInClient()) {
        try {
          const resultScanCode = await LiffFeatures.scanCode();
          resultOtherFeaturesContainer.innerHTML = createResultOtherFeaturesTemplate(resultScanCode);
        } catch {
          resultOtherFeaturesContainer.innerHTML = createResultOtherFeaturesFailedTemplate();
        }
        const closeResult = document.querySelector('.close__result');
        closeResult.addEventListener('click', () => {
          this.toggleCloseResult('.result__feature__container');
        });
      } else {
        popup.showAlert('This feature is available when opened in LINE application using LIFF, you can open it by clicking the open window button on the left');
      }
    });
  },

  btnSendMessagesLogic(name) {
    const btnSendMessages = document.querySelector('#btn__feature__send__message');
    const resultOtherFeaturesContainer = document.querySelector('.result__other__features');
    btnSendMessages.addEventListener('click', () => {
      if (LiffFeatures.isInClient()) {
        resultOtherFeaturesContainer.innerHTML = createSendMessagesTemplate(name);
        const closeResult = document.querySelector('.close__result');
        closeResult.addEventListener('click', () => {
          this.toggleCloseResult('.send__messages__container');
        });
        const message = document.querySelector('#message');
        const btnSend = document.querySelector('#send__message');
        btnSend.addEventListener('click', () => {
          if (message.value.length > 0) {
            const confirmSend = popup.showConfirm('Are you sure you want to send this message?');
            if (confirmSend) {
              try {
                LiffFeatures.sendMessages(name, message.value);
                popup.showAlert('Successfully sent the message');
                this.toggleCloseResult('.send__messages__container');
              } catch {
                popup.showAlert('Failed to send message');
              }
            }
          } else {
            popup.showAlert('Your input is empty, please check your input');
          }
        });
      } else {
        popup.showAlert('This feature is available when opened in LINE application using LIFF, you can open it by clicking the open window button on the left');
      }
    });
  },

  toggleCloseResult(element) {
    const elem = document.querySelector(element);
    if (elem.offsetWidth > 0 && elem.offsetHeight > 0) {
      elem.style.display = 'none';
    } else {
      elem.style.display = 'block';
    }
  },
};

export default Account;
