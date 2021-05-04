import React, { useState } from "react";
import { Switch, Route } from "react-router-dom";
import routes from "./routes.js";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Home from "./components/home";
import Social from "./components/social";
import Cart from "./components/cart";

//TODO allow query params in the router url
const App = ({ jekyll }) => {
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  return (
    <div>
      <div className="side-bar" open={sidebarIsOpen}>
        <button
          onClick={() => {
            setSidebarIsOpen(false);
          }}
          className="side-bar__close"
        >
          <img
            src="/images/ic_close_black_18dp_2x.png"
            alt="close sidebar"
            className="fill-content"
          />
        </button>
        <Social />
        <ul className="main-menu">
          {jekyll.pages.map((page, index) => (
            <li key={index}>
              <Link
                onClick={() => {
                  setSidebarIsOpen(false);
                }}
                to={page.url}
              >
                {page.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      {sidebarIsOpen && (
        <div
          className="side-bar__mask"
          onClick={() => {
            setSidebarIsOpen(false);
          }}
        ></div>
      )}
      <header
        className="site-header"
        style={{
          backgroundColor: jekyll.brandColor,
          borderBottom: "solid 1px black",
        }}
      >
        <div className="header-wrapper page-content">
          <Link className="site-logo" to="/">
            <img src={jekyll.logo} height="50" width="50"></img>
          </Link>
          <div>
            <Cart />
          </div>
          <button
            onClick={() => {
              setSidebarIsOpen(true);
            }}
            className="ampstart-btn caps m2 menu-button"
          >
            <svg viewBox="0 0 18 15" width="35px" height="45px">
              <path
                fill="#424242"
                d="M18,1.484c0,0.82-0.665,1.484-1.484,1.484H1.484C0.665,2.969,0,2.304,0,1.484l0,0C0,0.665,0.665,0,1.484,0 h15.031C17.335,0,18,0.665,18,1.484L18,1.484z"
              />
              <path
                fill="#424242"
                d="M18,7.516C18,8.335,17.335,9,16.516,9H1.484C0.665,9,0,8.335,0,7.516l0,0c0-0.82,0.665-1.484,1.484-1.484 h15.031C17.335,6.031,18,6.696,18,7.516L18,7.516z"
              />
              <path
                fill="#424242"
                d="M18,13.516C18,14.335,17.335,15,16.516,15H1.484C0.665,15,0,14.335,0,13.516l0,0 c0-0.82,0.665-1.484,1.484-1.484h15.031C17.335,12.031,18,12.696,18,13.516L18,13.516z"
              />
            </svg>
          </button>
        </div>
      </header>
      <div className="container main">
        <div className="categories">
          <ul>
            <li>
              <Link to="/" key="1">
                <span>Rutas</span>
              </Link>
            </li>
            <li>
              <Link to="/blog" key="2">
                <span>Blog</span>
              </Link>
            </li>
            <li>
              {
                <a
                  target="_blank"
                  href="https://randes-store.myshopify.com/"
                  key="3"
                >
                  <span className="tienda-title">Tienda</span>
                </a>
              }
            </li>
          </ul>
        </div>
        <Switch>
          {routes.map((route, index) => (
            <Route {...route} key={index} />
          ))}
        </Switch>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  jekyll: state.jekyll,
});

export default connect(mapStateToProps)(App);
