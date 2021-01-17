import UrlParser from '../../routes/url-parser';
import RestaurantApiSource from '../../data/restaurantapi-source';
import {
  createBuyProcessTemplate,
  createRestaurantDetailCategoriesTemplate,
  createRestaurantDetailFoodsTemplate,
  createRestaurantDetailDrinksTemplate,
  createMessageSuccessfulLoginBuyTemplate,
  createRequestFailedEmptyTemplate,
  createMessageLoginFailedTemplate,
  createSkeletonMessageLoginTemplate,
  createOrderFoodsTemplate,
  createOrderDrinksTemplate,
  createOrderEmptyTemplate,
  createTotalPaymentTemplate,
  createRadioBtnDeliveryTemplate,
} from '../templates/template-creator';
import LiffFeatures from '../../data/line-liff-features';
import popup from '../../data/popup';

const Buy = {
  async render() {
    return `
      <div id="buy"></div>
    `;
  },

  async afterRender() {
    try {
      const url = UrlParser.parseActiveUrlWithoutCombiner();
      const restaurant = await RestaurantApiSource.detailRestaurant(url.id);
      const buyContainer = document.querySelector('#buy');
      buyContainer.appendChild(createBuyProcessTemplate(restaurant));
      this.renderContentRestaurant(restaurant);
      this.orderLogic(restaurant);
    } catch (error) {
      const restaurantContainer = document.querySelector('#buy');
      restaurantContainer.innerHTML = createRequestFailedEmptyTemplate();
      popup.showAlert(error.message, 'Please check your internet connection');
    }
  },

  async renderContentRestaurant(restaurant) {
    const categoriesContainer = document.querySelector('.categories');
    categoriesContainer.innerHTML = createRestaurantDetailCategoriesTemplate(restaurant);

    const foodsContainer = document.querySelector('.foods');
    foodsContainer.innerHTML = createRestaurantDetailFoodsTemplate(restaurant);

    const drinksContainer = document.querySelector('.drinks');
    drinksContainer.innerHTML = createRestaurantDetailDrinksTemplate(restaurant);

    const messageSuccessfulLoginContainer = document.querySelector('.box__message__login');
    messageSuccessfulLoginContainer.innerHTML = createSkeletonMessageLoginTemplate();

    try {
      const getProfile = LiffFeatures.getProfile();
      const getPicture = (await getProfile).pictureUrl;
      const getName = (await getProfile).displayName;

      if (getName === undefined) {
        messageSuccessfulLoginContainer.innerHTML = createMessageLoginFailedTemplate();
      } else {
        messageSuccessfulLoginContainer.innerHTML = createMessageSuccessfulLoginBuyTemplate(getPicture, getName);
      }
    } catch {
      messageSuccessfulLoginContainer.innerHTML = createMessageLoginFailedTemplate();
    }
  },

  async orderLogic(restaurant) {
    const listOrder = [];
    const listOrderDrinks = [];

    if (listOrder.length <= 0) {
      this.emptyFoodsOrder();
    } else {
      this.orderFoodsTemplate(listOrder);
    }

    const btnFoodsMenu = document.querySelectorAll('.foods__menu__btn');
    const btnDrinksMenu = document.querySelectorAll('.drinks__menu__btn');

    for (const btnFoods of btnFoodsMenu) {
      btnFoods.addEventListener('click', (event) => {
        const targetEvent = event.target;
        const targetText = targetEvent.innerText;
        this.orderFoodsLogic({ listFoods: listOrder, target: targetText, listDrinks: listOrderDrinks });
      });
    }

    for (const btnDrinks of btnDrinksMenu) {
      btnDrinks.addEventListener('click', (event) => {
        const targetEvent = event.target;
        const targetText = targetEvent.innerText;
        this.orderDrinksLogic({ listDrinks: listOrderDrinks, target: targetText, listFoods: listOrder });
      });
    }

    this.btnOrder({ listFoods: listOrder, listDrinks: listOrderDrinks, restaurantData: restaurant });

    this.totalPaymentTemplate();
  },

  orderFoodsLogic({ listFoods, target, listDrinks }) {
    listFoods.push(target);

    this.orderFoodsTemplate(listFoods);

    this.totalPaymentTemplate(listFoods.length * 23000, listDrinks.length * 10000);

    this.btnRemove(listFoods, listDrinks);

    this.radioBtnDeliveryTemplate();
  },

  orderDrinksLogic({ listDrinks, target, listFoods }) {
    listDrinks.push(target);

    this.orderDrinksTemplate(listDrinks);

    this.totalPaymentTemplate(listFoods.length * 23000, listDrinks.length * 10000);

    this.btnRemove(listFoods, listDrinks);

    this.radioBtnDeliveryTemplate();
  },

  btnRemove(listOrder, listOrderDrinks) {
    const btnRemove = document.querySelector('#remove__item__foods');
    btnRemove.addEventListener('click', () => {
      if (listOrder.length > 0 || listOrderDrinks.length > 0) {
        listOrder.splice(0, listOrder.length);
        listOrderDrinks.splice(0, listOrderDrinks.length);
        this.emptyFoodsOrder();
        this.totalPaymentTemplate();
        this.radioBtnDeliveryHiddenTemplate();
      }
    });
  },

  btnOrder({ listFoods, listDrinks, restaurantData }) {
    const btnOrder = document.querySelector('#order__foods');
    const methodOrder = document.getElementsByName('method__order');

    btnOrder.addEventListener('click', async () => {
      if (LiffFeatures.isInClient()) {
        if (listFoods.length > 0 || listDrinks.length > 0) {
          if (methodOrder[0].checked || methodOrder[1].checked) {
            const confirm = popup.showConfirm('Are you sure to order it?');
            if (confirm) {
              for (let i = 0; i < methodOrder.length; i += 1) {
                if (methodOrder[i].checked) {
                  if (methodOrder[i].value === 'taking') {
                    try {
                      const getProfile = LiffFeatures.getProfile();
                      const getName = (await getProfile).displayName;
                      LiffFeatures.order({
                        name: getName,
                        listFood: listFoods,
                        listDrink: listDrinks,
                        restaurantApi: restaurantData,
                      });
                      popup.showAlert('Successfully order');
                      listFoods.splice(0, listFoods.length);
                      listDrinks.splice(0, listDrinks.length);
                      this.emptyFoodsOrder();
                      this.totalPaymentTemplate();
                      this.radioBtnDeliveryHiddenTemplate();
                    } catch {
                      popup.showAlert('Failed order');
                    }
                  } else {
                    try {
                      const getProfile = LiffFeatures.getProfile();
                      const getName = (await getProfile).displayName;
                      const getAddress = popup.showPrompt('Please input your address: ');
                      if (getAddress === '') throw 'Please check your input address';
                      if (getAddress === null) throw TypeError;
                      if (getAddress.length > 10) {
                        const confirmOrder = popup.showConfirm(`Your address: ${getAddress}\n\nAre you sure with your address?`);
                        if (confirmOrder) {
                          LiffFeatures.orderDelivery({
                            name: getName,
                            listFood: listFoods,
                            listDrink: listDrinks,
                            restaurantApi: restaurantData,
                            address: getAddress,
                          });
                          popup.showAlert('Successfully order');
                          listFoods.splice(0, listFoods.length);
                          listDrinks.splice(0, listDrinks.length);
                          this.emptyFoodsOrder();
                          this.totalPaymentTemplate();
                          this.radioBtnDeliveryHiddenTemplate();
                        }
                      } else {
                        throw 'Your input address less than 10 please check again';
                      }
                    } catch (e) {
                      if (typeof e === 'string') popup.showAlert(`Failed order, ${e}`);
                      else popup.showAlert('You have canceled the order');
                    }
                  }
                }
              }
            }
          } else {
            popup.showAlert('You have not chosen mothod taking or delivery');
          }
        } else {
          popup.showAlert('You have not chosen food or drink');
        }
      } else {
        popup.showAlert('You must open on Line Aplication');
      }
    });
  },

  emptyFoodsOrder() {
    const orderContainer = document.querySelector('.order');
    const orderDrinkContainer = document.querySelector('.order__drinks');
    orderContainer.innerHTML = createOrderEmptyTemplate();
    orderDrinkContainer.innerHTML = createOrderEmptyTemplate();
  },

  orderFoodsTemplate(listOrder) {
    const orderContainer = document.querySelector('.order');
    orderContainer.innerHTML = createOrderFoodsTemplate(listOrder);
  },

  orderDrinksTemplate(listOrder) {
    const orderContainer = document.querySelector('.order__drinks');
    orderContainer.innerHTML = createOrderDrinksTemplate(listOrder);
  },

  totalPaymentTemplate(paymentFoods = 0, paymentDrinks = 0) {
    const payment = paymentFoods + paymentDrinks;
    const totalContainer = document.querySelector('.total');
    totalContainer.innerHTML = createTotalPaymentTemplate(payment);
  },

  radioBtnDeliveryTemplate() {
    const radioBtnContainer = document.querySelector('.radio__btn__delivery');
    radioBtnContainer.innerHTML = createRadioBtnDeliveryTemplate();
  },

  radioBtnDeliveryHiddenTemplate() {
    const radioBtnContainer = document.querySelector('.shipping__method');
    radioBtnContainer.classList.toggle('hidden');
  },
};

export default Buy;
