import React from "react";
import "./style.css";
import logo from "../../../images/boare_ai-logo_white.jpg";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../../../authConfig";

const LoginView = ({ setIsLoggedIn }) => {
  const { instance } = useMsal();
  const handleLogin = () => {
    localStorage.setItem("isLogin", "Yes");
    // localStorage.setItem("donotShow", "No");
    setIsLoggedIn(true);
  //   instance.loginRedirect(loginRequest).catch(e => {
  //     console.log('e',e);
  // });
  };
  return (
    <div className="row">
      <div className="heading-section">
        <h1>Login to your account</h1>
        {/* <span className="signup-link-section">
          Need an account <a href="#">Sign Up</a>
        </span> */}
      </div>
      <div className="col-md-6">
        <div className="login-container-right">
          {/* <h2>With your Document View enjoy:</h2> */}
          <img src={logo} alt="logo" />
          {/* <ul>
            <li>
              <em>
                <i className="fa fa-money" aria-hidden="true"></i>
              </em>
              <small>Earn points for shopping and prescriptions</small>
            </li>
            <li>
              <em>
                <i className="fa fa-credit-card-alt" aria-hidden="true"></i>
              </em>
              <small>Redeem points for BonusCash</small>
            </li>
            <li>
              <em>
                <i className="fa fa-usd" aria-hidden="true"></i>
              </em>
              <small>
                Save more with exclusive digital coupons, personalized offers,
                and BonusCash promotions
              </small>
            </li>
            <li>
              <em>
                <i className="fa fa-hospital-o" aria-hidden="true"></i>
              </em>
              <small> Manage your prescriptions</small>
            </li>
            <li>
              <em>
                <i className="fa fa-shopping-cart" aria-hidden="true"></i>
              </em>
              <small>Faster checkout</small>
            </li>
          </ul> */}
        </div>
      </div>
      <div className="col-md-6 login-left-border">
        <div className="login-container-left">
          {/* <span>* Indicates a required field</span>
          <div>
            <label className="heading-common">Email Address *</label>
            <input type="text" className="form-control" />
          </div>
          <div>
            <label className="heading-common">Password *</label>
            <input type="password" className="form-control" />
          </div> */}
          <div className="button-section">
            <button
              className="btn btn-primary btn-login"
              onClick={() => handleLogin()}
            >
              Please sign-in to continue.
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
