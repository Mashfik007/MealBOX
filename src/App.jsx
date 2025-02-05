import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Home_page from './Pages/Home_Page/Home_page';
import MealDetailPage from './Pages/Meal_details_page/MealDetailPage ';
import MealListPage from './Pages/Meals List/MealListPage ';
import Admin_Dashboard from './Pages/Admin Dashboard/Admin_Dashboard ';
import Admin_profile from './Pages/Admin Dashboard/layouts/Admin Profile/Admin_profile';
import Manage_User from './Pages/Admin Dashboard/layouts/Manage users/Manage_User';
import Add_meal from './Pages/Admin Dashboard/layouts/Add Meal/Add_meal';
import AllMeals from './Pages/Admin Dashboard/layouts/All_meals_/AllMeals ';
import AllReviews from './Pages/Admin Dashboard/layouts/All reviews/AllReviews ';
import ServeMeals from "../../pro12/src/Pages/Admin Dashboard/layouts/Serve Meals/ServeMeals ";
import UpcomingMeals from "../src/Pages/Admin Dashboard/layouts/Upcoming_Meals/UpcomingMeals ";
import USer_Dashboard from './Pages/User/USer_Dashboard/USer_Dashboard';

import USer_Profile from "../src/Pages/User/Layout/User Profile/USer_Profile";
import RequestedMeals from "../src/Pages/User/Layout/Requested meal/RequestedMeals ";
import MyReviews from "../src/Pages/User/Layout/Review by user/MyReviews ";
import PaymentHistory from "../src/Pages/User/Layout/ALL payments/PaymentHistory ";
import CheckoutPage from "../src/Pages/CheckoutPages/CheckoutPage ";
import Register from './Pages/Register/Register';
import Login from "../src/Pages/Login/Login";
import Upcoming from './Components/UpcomingMeals/UpcomingMeals';
import PurchasePackage from './Components/PurchasePackages/PurchasePackage ';
import PRivate_Route from './PRivate_Routes/PRivate_Route ';
const App = () => {
  return (
    <Routes>
      {/* TODO: PUBLIC ROUTES */}
      <Route path='/' element={<Home_page></Home_page>} />
      <Route path='/meal' element={<MealDetailPage></MealDetailPage>} />
      <Route path='/meals' element={<MealListPage></MealListPage>} />
      <Route path='/meal/:id' element={<MealDetailPage></MealDetailPage>}></Route>
      <Route path='/upcoming_meals' element={<Upcoming></Upcoming>}></Route>
      <Route path='/checkout' element={<PRivate_Route><PurchasePackage></PurchasePackage></PRivate_Route>}></Route>
      <Route path='/register' element={<Register></Register>}></Route>
      <Route path='/login' element={<Login></Login>}></Route>



      {/*TODO: admin routes */}
      <Route path='/admin_dashboard' element={<PRivate_Route><Admin_Dashboard></Admin_Dashboard></PRivate_Route>}>
        <Route index element={<Navigate to="profile" replace />} />
        <Route path='profile' element={<Admin_profile></Admin_profile>} ></Route>
        <Route path='manage_user' element={<Manage_User></Manage_User>}></Route>
        <Route path='add_meal' element={<Add_meal></Add_meal>}></Route>
        <Route path='all_meal' element={<AllMeals></AllMeals>}></Route>
        <Route path='all_reviews' element={<AllReviews></AllReviews>}></Route>
        <Route path='serve_meal' element={<ServeMeals></ServeMeals>}></Route>
        <Route path='upcoming_meal' element={<UpcomingMeals></UpcomingMeals>}></Route>
      </Route>



      {/*TODO: USer routes */}
      <Route path='/user_dashboard' element={<PRivate_Route><USer_Dashboard></USer_Dashboard></PRivate_Route>}>
      <Route index element={<Navigate to="profile" replace />} />
        <Route path='profile' element={<USer_Profile></USer_Profile>} ></Route>
        <Route path='requested_meal' element={<RequestedMeals></RequestedMeals>} ></Route>
        <Route path='user_review' element={<MyReviews></MyReviews>} ></Route>
        <Route path='payment_history' element={<PaymentHistory></PaymentHistory>} ></Route>
      </Route>

    </Routes>
  );
};

export default App;


{/* <Route path='/checkout' element={<CheckoutPage></CheckoutPage>}></Route> */}