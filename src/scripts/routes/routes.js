import ListRestaurant from '../views/pages/list-restaurant';
import Favorite from '../views/pages/favorite';
import Account from '../views/pages/account';
import Detail from '../views/pages/detail';
import Buy from '../views/pages/buy';

const routes = {
  '/': ListRestaurant, // default page
  '/list-restaurant': ListRestaurant,
  '/favorite': Favorite,
  '/account': Account,
  '/detail/:id': Detail,
  '/buy/:id': Buy,
};

export default routes;
