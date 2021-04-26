import React from "react";
import AMPDocument from "./components/amp-document/amp-document";
import Shell from "./components/shell";
import Checkout from "./components/checkout";
import Confirmation from "./components/order-confirmation";
import Products from "./components/products";
import About from "./components/about";
import Politicas from "./components/politicas";
import Blog from "./components/blog";
import Regions from "./components/regions";
import GenericNotFound from "./components/404";
import OrderList from "./components/orderlist";

function loadData(match) {
  console.log(match.params);
  return fetch(`https://jsonplaceholder.typicode.com/${resourceType}`)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      // only keep 10 first results
      return data.filter((_, idx) => idx < 10);
    });
}
//<Route path="/blog" component={Blog} />
//<Route path="/tienda" component={Products} />
//<Route path="/contacto" component={About} />
//<Route path="/politicas" component={Politicas} />
//<Route path="/confirmation" component={Confirmation} />
//<Route path="/orderslist" component={OrderList} />
//<Route path="*" exact={true} component={GenericNotFound} />
/**
 * @see https://github.com/ampproject/amphtml/blob/master/extensions/amp-install-serviceworker/amp-install-serviceworker.md#shell-url-rewrite
 */
function redirectSWFallbackURL(_nextState, replace) {
  var hash = typeof window !== "undefined" && window.location.hash;
  if (hash && hash.indexOf("#href=") === 0) {
    var href = decodeURIComponent(hash.substr(6));
    replace({ pathname: href });
  }
}

const Routes = [
  {
    path: "/",
    component: Shell,
    onEnter: redirectSWFallbackURL,
  },
  {
    path: "/regiones",
    component: Regions,
  },
  {
    path: "/blog",
    component: Blog,
  },
  {
    path: "/tienda",
    component: Blog,
  },
  {
    path: ":category/:document",
    component: (props) => (
      <AMPDocument
        src={`/amp/${props.params.category}/${props.params.document}`}
      />
    ),
    loadData: loadData,
  },
  {
    path: ":category/:deparment/:document",
    component: (props) => (
      <AMPDocument
        src={`/amp/${props.params.category}/${props.params.deparment}/${props.params.document}`}
      />
    ),
    loadData: loadData,
  },
  {
    path: "/checkout",
    component: (props) => {
      return <Checkout query={props.location.query} />;
    },
  },
  {
    component: GenericNotFound,
  },
];

export default Routes;
