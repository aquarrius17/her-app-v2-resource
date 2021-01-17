import RestaurantApiSource from '../../data/restaurantapi-source';
import {
  createRestaurantItemTemplate,
  createRequestFailedTemplate,
  createSkeletonRestaurantTemplate,
  createMessageNotLoginTemplate,
  createMessageSuccessfulLoginTemplate,
  createSkeletonMessageLoginTemplate,
  createMessageLoginFailedTemplate,
} from '../templates/template-creator';
import LiffFeatures from '../../data/line-liff-features';
import popup from '../../data/popup';

const ListRestaurant = {
  async render() {
    return `
    <img class="heros heros-list lazyload"
      src="./images/skeleton/placeholder.png"
      data-src="./images/heros-build/hero-image_4-large.jpg"
      data-srcset="./images/heros-build/hero-image_4-small.jpg 480w, ./images/heros-build/hero-image_4-large.jpg 920w"
      data-sizes="(max-width: 600px) 480px, 920px"
      alt="">
    <p>List Restaurant</p>

    <div class="fragment">
      <a href="#/list-restaurant" aria-label="Add to home">
        <div class="box__fragment">
            <i class="material-icons icon">home</i>
            <figcaption>Home</figcaption>
        </div>
      </a>
      <a href="#/favorite" aria-label="Add to favorite">
        <div class="box__fragment">
            <i class="material-icons icon">favorite</i>
            <figcaption>Favorite</figcaption>
        </div>
      </a>
      <a href="#/account" aria-label="Add to my account">
        <div class="box__fragment">
            <i class="material-icons icon">account_circle</i>
            <figcaption>Account</figcaption>
        </div>
      </a>
    </div>

    <div id="message__login">
      ${createSkeletonMessageLoginTemplate()}
    </div>

    <div id="content">
      ${createSkeletonRestaurantTemplate(20)}
    </div>
    `;
  },

  async afterRender() {
    this.renderMessageLogin();
    try {
      const restaurants = await RestaurantApiSource.listRestaurant();
      const restaurantsContainer = document.querySelector('#content');
      restaurantsContainer.innerHTML = '';
      restaurants.forEach((restaurant) => {
        restaurantsContainer.innerHTML += createRestaurantItemTemplate(restaurant);
      });
    } catch {
      const restaurantsContainer = document.querySelector('#content');
      restaurantsContainer.innerHTML = createRequestFailedTemplate();
      popup.showAlert('Please check your internet connection');
    }
  },

  async renderMessageLogin() {
    const messageLoginContainer = document.querySelector('#message__login');
    if (LiffFeatures.isInClient() || LiffFeatures.isLoggedIn()) {
      try {
        const getProfile = LiffFeatures.getProfile();
        const getPicture = (await getProfile).pictureUrl;
        const getName = (await getProfile).displayName;

        if (getName === undefined) {
          messageLoginContainer.innerHTML = createMessageLoginFailedTemplate();
        } else {
          messageLoginContainer.innerHTML = createMessageSuccessfulLoginTemplate(getPicture, getName);
        }
      } catch {
        messageLoginContainer.innerHTML = createMessageLoginFailedTemplate();
      }
    } else {
      messageLoginContainer.innerHTML = createMessageNotLoginTemplate();
    }
  },
};

export default ListRestaurant;
