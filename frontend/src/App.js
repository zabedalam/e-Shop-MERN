import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Home from "./components/Home/Home";
import Cart from "./components/cart/Cart";
import Shipping from "./components/cart/Shipping";
import ConfirmOrder from "./components/cart/ConfirmOrder";
import Payment from "./components/cart/Payment";
import OrderSuccess from "./components/cart/OrderSuccess";

import ListOrders from "./components/order/ListOrders";
import OrderDetails from "./components/order/OrderDetails";

import ProductDetails from "./components/product/ProductDetails";
import Login from "./components/user/Login";
import Register from "./components/user/Register";
import Profile from "./components/user/Profile";
import NewPassword from "./components/user/NewPassword";

import UpdateProfile from "./components/user/UpdateProfile";
import UpdatePassword from "./components/user/UpdatePassword";
import ForgotPassword from "./components/user/ForgotPassword";

import Dashboard from "./components/admin/Dashboard";

import ProtectedRoute from "./components/route/ProtectedRoute";
import { loadUser } from "./actions/userActions";
import store from "./store";
import axios from "axios";

//Payment
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

function App() {
  const [stripeApiKey, setStripeApiKey] = useState("");

  useEffect(() => {
    store.dispatch(loadUser());

    async function getStripeApiKey() {
      const { data } = await axios.get("/api/stripeapi");

      setStripeApiKey(data.stripeApiKey);
    }

    getStripeApiKey();
  }, []);
  return (
    <Router>
      <div className="App">
        <Header />
        <div className="container container-fluid">
          <Route path="/" component={Home} exact />
          <Route path="/cart" component={Cart} exact />
          <ProtectedRoute path="/shipping" component={Shipping} />
          <ProtectedRoute path="/order/confirm" component={ConfirmOrder} />
          <ProtectedRoute path="/success" component={OrderSuccess} />

          {stripeApiKey && (
            <Elements stripe={loadStripe(stripeApiKey)}>
              <ProtectedRoute path="/payment" component={Payment} />
            </Elements>
          )}

          <Route path="/search/:keyword" component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/password/forgot" component={ForgotPassword} exact />
          <Route path="/password/reset/:token" component={NewPassword} exact />

          <ProtectedRoute path="/me" component={Profile} exact />
          <ProtectedRoute path="/me/update" component={UpdateProfile} exact />
          <ProtectedRoute
            path="/password/update"
            component={UpdatePassword}
            exact
          />

          <ProtectedRoute path="/orders/me" component={ListOrders} exact />
          <ProtectedRoute path="/order/:id" component={OrderDetails} exact />

          <Route path="/product/:id" component={ProductDetails} exact />
        </div>

        <ProtectedRoute
          path="/dashboard"
          isAdmin={true}
          component={Dashboard}
          exact
        />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
