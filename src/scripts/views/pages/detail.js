import UrlParser from '../../routes/url-parser';
import RestaurantApiSource from '../../data/restaurantapi-source';
import {
  createRestaurantDetailTemplate,
  createRestaurantDetailCategoriesTemplate,
  createRestaurantDetailFoodsTemplate,
  createRestaurantDetailDrinksTemplate,
  createRestaurantDetailReviewsTemplate,
  createRequestFailedEmptyTemplate,
} from '../templates/template-creator';
import LikeButtonInitiator from '../../utils/like-button-presenter';
import popup from '../../data/popup';
import LiffFeatures from '../../data/line-liff-features';

const Detail = {
  async render() {
    return `
      <div id="contentDetail"></div>
    `;
  },

  async afterRender() {
    try {
      const url = UrlParser.parseActiveUrlWithoutCombiner();
      const restaurant = await RestaurantApiSource.detailRestaurant(url.id);

      const restaurantContainer = document.querySelector('#contentDetail');
      restaurantContainer.appendChild(createRestaurantDetailTemplate(restaurant));

      await LikeButtonInitiator.init({
        likeButtonContainer: document.querySelector('.box__favorite__color'),
        restaurant: {
          id: restaurant.id,
          name: restaurant.name,
          rating: restaurant.rating,
          city: restaurant.city,
          description: restaurant.description,
          pictureId: restaurant.pictureId,
        },
      });

      this.renderBuyButton(url.id);

      this.renderContentRestaurant(restaurant);

      this.renderRateRestaurant(url);
    } catch {
      const restaurantContainer = document.querySelector('#contentDetail');
      restaurantContainer.innerHTML = createRequestFailedEmptyTemplate();
      popup.showAlert('Please check your internet connection');
    }
  },

  renderContentRestaurant(restaurant) {
    const categoriesContainer = document.querySelector('.categories');
    categoriesContainer.innerHTML = createRestaurantDetailCategoriesTemplate(restaurant);

    const foodsContainer = document.querySelector('.foods');
    foodsContainer.innerHTML = createRestaurantDetailFoodsTemplate(restaurant);

    const drinksContainer = document.querySelector('.drinks');
    drinksContainer.innerHTML = createRestaurantDetailDrinksTemplate(restaurant);

    const reviewsContainer = document.querySelector('.reviews');
    reviewsContainer.innerHTML = createRestaurantDetailReviewsTemplate(restaurant);
  },

  async renderRateRestaurant(url) {
    const inputName = document.querySelector('#name');
    const inputReview = document.querySelector('#review');
    const btnPostReview = document.querySelector('#btn__post__review');

    if (LiffFeatures.isLoggedIn() || LiffFeatures.isInClient()) {
      try {
        const getProfile = LiffFeatures.getProfile();
        const getName = (await getProfile).displayName;

        if (!(getName === undefined)) {
          inputName.disabled = true;
          inputName.placeholder = getName;
          inputName.value = getName;
        }
      } catch {
        popup.showAlert('Please check your internet connection');
      }
    }

    btnPostReview.addEventListener('click', async () => {
      if (inputName.value.length > 0 && inputReview.value.length > 0) {
        const confirmPost = popup.showConfirm('Do you want to post your review?');
        if (confirmPost) {
          const review = {
            id: url.id,
            name: inputName.value,
            review: inputReview.value,
          };
          try {
            await RestaurantApiSource.postReview(JSON.stringify(review));
            setTimeout(() => {
              popup.showAlert('Reload to see your post!');
              location.reload();
            }, 300);
          } catch {
            popup.showAlert('Failed to post');
          }
        }
      } else {
        popup.showAlert('Please check your input!');
      }
    });
  },

  renderBuyButton(id) {
    const buyBtn = document.querySelector('#buy');
    buyBtn.addEventListener('click', () => {
      if (LiffFeatures.isLoggedIn() || LiffFeatures.isInClient()) {
        location.replace(`#/buy/${id}`);
      } else {
        popup.showAlert('You must login first');
      }
    });
  },
};

export default Detail;
