import { Router, Route, browserHistory } from 'react-router';
import AMPDocument from './components/amp-document/amp-document';
import React from 'react';
import ReactDOM from 'react-dom';
import Shell from './components/shell';
import Checkout from "./components/checkout";
import Confirmation from "./components/order-confirmation";
import Products from "./components/products"
import About from "./components/about"
import Politicas from "./components/politicas"
import Blog from "./components/blog"
import Regions from "./components/regions"
import GenericNotFound from "./components/404"  
import contactUs from './components/contact-us';
import OrderList from './components/orderlist';

/**
 * @see https://github.com/ampproject/amphtml/blob/master/extensions/amp-install-serviceworker/amp-install-serviceworker.md#shell-url-rewrite
 */
function redirectSWFallbackURL(nextState, replace) {
  var hash = typeof window !== 'undefined' && window.location.hash;
  if (hash && hash.indexOf('#href=') === 0) {
    var href = decodeURIComponent(hash.substr(6));
    replace({pathname: href});
  }
}

export default (
    <Route path='/' component={Shell} onEnter={redirectSWFallbackURL}>
      <Route path='/checkout' component={
        props => <Checkout query={props.location.query} />
        } />   
      <Route path='/regiones' component={Regions} /> 
      <Route path='/blog' component={Blog} /> 
      <Route path='/tienda' component={Products} /> 
      <Route path='/acerca' component={About} /> 
      <Route path='/politicas' component={Politicas} /> 
      <Route path='/contactenos' component={contactUs} /> 
      <Route path='/confirmation' component={Confirmation} />
      <Route path='/orderslist' component={OrderList} />
      <Route path=':category/:document' component={
          props => <AMPDocument src={`/amp/${props.params.category}/${props.params.document}`} />
        } />
      <Route path=':category/:deparment/:document' component={
        props => <AMPDocument src={`/amp/${props.params.category}/${props.params.deparment}/${props.params.document}`} />
      } />
      <Route path='*' exact={true} component={GenericNotFound} />          
    </Route>
)

