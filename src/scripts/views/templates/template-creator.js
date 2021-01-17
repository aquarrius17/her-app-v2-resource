import CONFIG from '../../globals/config';

const createRestaurantItemTemplate = (restaurant) => {
  const { description } = restaurant;
  const filterDescription = description.substr(0, 170);
  return `
      <a href="${`/#/detail/${restaurant.id}`}">
        <div class="wrapper">
            <div class="box__picture">
                <img class="lazyload" src="./images/skeleton/placeholder.png" data-src="${CONFIG.BASE_IMAGE_URL}/${restaurant.pictureId}" alt="${restaurant.name}">
            </div>
            <div class="box__name"><b>${restaurant.name}</b></div>
            <div class="box__description description__listrestaurant"><p>${filterDescription}</p></div>
            <div class="box__rating"><p>&#9733; ${restaurant.rating}</p></div>
            <div class="box__city"><p>${restaurant.city}</p></div>
        </div>
      </a>
    `;
};

const createSkeletonRestaurantTemplate = (count) => {
  let template = '';

  for (let i = 0; i < count; i += 1) {
    template += `
      <skeleton-ui></skeleton-ui>
    `;
  }
  return template;
};

const createRestaurantDetailTemplate = (restaurant) => {
  const contentDetailElement = document.createElement('content-detail');
  contentDetailElement.restaurant = restaurant;
  return contentDetailElement;
};

const createRestaurantDetailCategoriesTemplate = (restaurant) => {
  let category = '';
  let i = 0;
  while (i < restaurant.categories.length) {
    category += `${restaurant.categories[i].name} `;
    i += 1;
  }
  return `<figcaption>${category}</figcaption>`;
};

const createRestaurantDetailFoodsTemplate = (restaurant) => {
  let foods = '';
  let i = 0;
  while (i < restaurant.menus.foods.length) {
    foods += `<li class="box__menu foods__menu__btn select__menu"><p>${restaurant.menus.foods[i].name}</p></li>`;
    i += 1;
  }
  return `${foods}`;
};

const createRestaurantDetailDrinksTemplate = (restaurant) => {
  let drinks = '';
  let i = 0;
  while (i < restaurant.menus.drinks.length) {
    drinks += `<li class="box__menu drinks__menu__btn select__menu"><p>${restaurant.menus.drinks[i].name}</p></li>`;
    i += 1;
  }
  return `${drinks}`;
};

const createRestaurantDetailReviewsTemplate = (restaurant) => {
  let review = '';
  let i = 0;
  while (i < restaurant.customerReviews.length) {
    review += `
      <li class="box__review">
        <div class="box__review__header">
          <p><b>${restaurant.customerReviews[i].name}</b></p>
          <p class="review__date">${restaurant.customerReviews[i].date}</p>
        </div>
        <div class="box__review__body">
          <p>${restaurant.customerReviews[i].review}</p>
        </div>
      </li>
    `;
    i += 1;
  }
  return `${review}`;
};

const createLikeRestaurantButtonTemplate = () => `
  <button aria-label="like this restaurant" id="likeButton">
    <i class="material-icons">favorite_border</i>
  </button>
`;

const createUnlikeRestaurantButtonTemplate = () => `
  <button aria-label="unlike this restaurant" id="likeButton">
    <i class="material-icons">favorite</i>
  </button>
`;

const createRequestFailedTemplate = () => `
  <div class="request__failed">
    <i class="material-icons">perm_scan_wifi</i>
    <p class="info__failed">Failed to load data</p>
    <p>Please check your internet connection</p>
  </div>
`;

const createRequestFailedEmptyTemplate = () => `
  <div class="request__failed failed__detail">
    <i class="material-icons">perm_scan_wifi</i>
    <p class="info__failed">Failed to load data</p>
    <p>Please check your internet connection</p>
  </div>
`;

const createFavoriteEmptyTemplate = () => `
  <a href="#/list-restaurant" aria-label="find a restaurant now">
    <div class="favorite__empty">
      <i class="material-icons">playlist_add</i>
      <p>Your don't have a favorite restaurant yet</p>
    </div>
  </a>
`;

const createNotLoginAccountTemplate = () => `
    <div class="account__not__login">
      <i class="material-icons">account_circle</i>
    </div>
    <div class="detail__account">
      <div class="username__account">
        <p>Not Logged In</p>
        <div class="description__login">
          <p>Login with LINE to order and enjoy other features</p>
        </div>
      </div>
      <div class="btn__login__container">
        <button id="btn__login">Login With LINE Account</button>
      </div>
      <div class="other__features"></div>
    </div>
`;

const createSuccessfulLoginAccountTemplate = ({
  picture, name, language, status,
}) => `
    <div class="account__successful__login">
      <img class="lazyload" src="./images/skeleton/placeholder.png" data-src="${picture}" alt="${name} profile picture">
    </div>
    <div class="detail__account">
      <div class="username__account">
        <p>${name}</p>
        <figcaption>${language}</figcaption>
        <div class="description__login">
          <p>${status}</p>
        </div>
      </div>
      <div class="other__features"></div>
      <div class="result__other__features"></div>
      <div class="btn__logout__container">
        <button id="btn__logout">Logout</button>
      </div>
    </div>
`;

const createLiffOtherFeaturesTemplate = () => `
  <button id="btn__feature__openWindow" aria-label="open window">
    <i class="material-icons">north_west</i>
    <figcaption>Open Window</figcaption>
  </button>
  <button id="btn__feature__scan__qr" aria-label="scan qr code">
    <i class="material-icons">qr_code_scanner</i>
    <figcaption>Scan QR Code</figcaption>
  </button>
  <button id="btn__feature__send__message" aria-label="send message">
    <i class="material-icons">textsms</i>
    <figcaption>Send Message</figcaption>
  </button>
`;

const createResultOtherFeaturesTemplate = (result) => `
  <div class="result__feature__container">
    <div class="result__feature">
      <p>${result}</p>
    </div>
    <div class="close__result">
      <i class="material-icons">clear</i>
    </div>
  </div>
`;

const createSendMessagesTemplate = (name) => `
  <div class="send__messages__container">
    <div class="result__feature__container">
      <div class="result__feature">
        <p>From ${name},</p>
      </div>
      <div class="close__result">
        <i class="material-icons">clear</i>
      </div>
    </div>
    <div class="input__send__messages">
      <input id="message" type="text" placeholder="Message" class="rate__input__name">
      <label for="message">Please input your message</label>
      <button id="send__message">Send</button>
    </div>
  </div>
`;

const createResultOtherFeaturesFailedTemplate = () => `
  <div class="result__feature__container failed__result">
    <div class="result__feature">
      <p>Scan code failed!</p>
    </div>
    <div class="close__result">
      <i class="material-icons">clear</i>
    </div>
  </div>
`;

const createMessageNotLoginTemplate = () => `
  <a class="message__not__login" href="#/account" aria-label="Add to login">
    <div class="message__login__container message__not__login">
      <div class="profile__message__not__login">
        <i class="material-icons">account_circle</i>
      </div>
      <div class="description__message__login">
        <p><b>You are not logged in</b></p>
        <p>Login to order and enjoy other features</p>
      </div>
    </div>
  </a>
`;

const createMessageSuccessfulLoginTemplate = (picture, name) => `
  <div class="message__login__container">
    <div class="profile__message__login">
      <img class="lazyload" src="./images/skeleton/placeholder.png" data-src="${picture}" alt="${name} profile picture">
    </div>
    <div class="description__message__login">
      <p><b>Hi, ${name}</b></p>
      <p>You are loggeed in<br>happy ordering and enjoying its features</p>
    </div>
  </div>
`;

const createMessageSuccessfulLoginBuyTemplate = (picture, name) => `
  <div class="message__login__container order__message">
    <div class="profile__message__login">
      <img class="lazyload" src="./images/skeleton/placeholder.png" data-src="${picture}" alt="${name} profile picture">
    </div>
    <div class="description__message__login">
      <p><b>Hi, ${name}</b></p>
      <p>Let's order<br>Select the food and drink menu below</p>
    </div>
  </div>
`;

const createSkeletonMessageLoginTemplate = () => `
  <div class="message__login__container">
    <div class="profile__message__login profile__skeleton"></div>
    <div class="description__message__login">
      <p class="name__skeleton skeleton">Hi Rui Tachibana</p>
      <p class="skeleton">You are loggeed in happy ordering and enjoying its features</p>
    </div>
  </div>
`;

const createMessageLoginFailedTemplate = () => `
  <div class="message__login__container message__not__login">
    <div class="profile__message__not__login">
      <i class="material-icons">account_circle</i>
    </div>
    <div class="description__message__login">
      <p><b>Problematic connection</b></p>
      <p>Please check your internet connection</p>
    </div>
  </div>
`;

const createBuyProcessTemplate = (restaurant) => {
  const contentDetailElement = document.createElement('buy-process');
  contentDetailElement.restaurant = restaurant;
  return contentDetailElement;
};

const createOrderFoodsTemplate = (order) => {
  let foods = '';
  let i = 0;
  while (i < order.length) {
    foods += `
      <li class="box__menu menu__order__foods"><p>${order[i]}</p></li>
    `;
    i += 1;
  }
  return `${foods}`;
};

const createOrderDrinksTemplate = (order) => {
  let drinks = '';
  let i = 0;
  while (i < order.length) {
    drinks += `<li class="box__menu menu__order__drink"><p>${order[i]}</p></li>`;
    i += 1;
  }
  return `${drinks}`;
};

const createOrderEmptyTemplate = () => `
  <li class="box__menu empty__order"><p>Empty Order</p></li>
`;

const createTotalPaymentTemplate = (payment) => `
  <div class="total__payment__container">
    <p>Rp <span class="total__payment">${payment}</span></p>
  </div>
  <div class="btn__remove">
    <button id="remove__item__foods">
      <i class="material-icons">delete_outline</i>
    </button>
  </div>
`;

const createRadioBtnDeliveryTemplate = () => `
  <form class="shipping__method">
    <label class="left__label__radio">  
      <input type="radio" id="taking" name="method__order" value="taking" />
      <span>Taking</span>
    </label>
    <label>
      <input type="radio" id="delivery" name="method__order" value="delivery" />
      <span>Delivery</span>
    </label>
  </form>
`;

export {
  createRestaurantItemTemplate,
  createSkeletonRestaurantTemplate,
  createRestaurantDetailTemplate,
  createRestaurantDetailCategoriesTemplate,
  createRestaurantDetailFoodsTemplate,
  createRestaurantDetailDrinksTemplate,
  createRestaurantDetailReviewsTemplate,
  createLikeRestaurantButtonTemplate,
  createUnlikeRestaurantButtonTemplate,
  createRequestFailedTemplate,
  createRequestFailedEmptyTemplate,
  createFavoriteEmptyTemplate,
  createNotLoginAccountTemplate,
  createSuccessfulLoginAccountTemplate,
  createLiffOtherFeaturesTemplate,
  createResultOtherFeaturesTemplate,
  createSendMessagesTemplate,
  createResultOtherFeaturesFailedTemplate,
  createMessageNotLoginTemplate,
  createMessageSuccessfulLoginTemplate,
  createSkeletonMessageLoginTemplate,
  createMessageLoginFailedTemplate,
  createBuyProcessTemplate,
  createMessageSuccessfulLoginBuyTemplate,
  createOrderFoodsTemplate,
  createOrderDrinksTemplate,
  createOrderEmptyTemplate,
  createTotalPaymentTemplate,
  createRadioBtnDeliveryTemplate,
};
