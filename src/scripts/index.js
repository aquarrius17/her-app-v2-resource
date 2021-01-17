import 'regenerator-runtime';
import 'lazysizes';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';
import '../styles/main.css';
import '../styles/list-restaurant.css';
import '../styles/favorite.css';
import '../styles/detail.css';
import '../styles/buy.css';
import '../styles/account.css';
import '../styles/responsive.css';
import './views/components/app-shell/app-bar';
import './views/components/app-shell/foot-bar';
import './views/components/contents/skip-link';
import './views/components/contents/skeleton-ui';
import './views/components/contents/content-detail';
import './views/components/contents/buy-process';
import LiffFeatures from './data/line-liff-features';
import App from './views/app';
import swRegister from './utils/sw-register';
import popup from './data/popup';

const app = new App({
  button: document.querySelector('#hamburgerButton'),
  drawer: document.querySelector('#navigationDrawer'),
  content: document.querySelector('main'),
});

window.addEventListener('hashchange', () => {
  app.renderPage();
});

window.addEventListener('load', async () => {
  try {
    await LiffFeatures.init();
    app.renderPage();
  } catch {
    app.renderPage();
    popup.showAlert('Your browser does not support the LINE Frontend Framework features!');
  }
  swRegister();
});
