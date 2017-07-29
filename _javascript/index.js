import { Router, Route, browserHistory } from 'react-router';
import AMPDocument from './components/amp-document/amp-document';
import React from 'react';
import ReactDOM from 'react-dom';
import Shell from './components/shell';


/**
 * @see https://github.com/ampproject/amphtml/blob/master/extensions/amp-install-serviceworker/amp-install-serviceworker.md#shell-url-rewrite
 */
function redirectSWFallbackURL(nextState, replace) {
  var hash = window.location.hash;
  if (hash && hash.indexOf('#href=') === 0) {
    var href = decodeURIComponent(hash.substr(6));
    replace({pathname: href});
  }
}

ReactDOM.render((
  <Router history={browserHistory}>
    <Route path='/' component={Shell} onEnter={redirectSWFallbackURL}>
     <Route path=':page' component={
        props => <AMPDocument src={`/${props.params.page}/`} />
      } />  
      <Route path=':category/:document' component={
        props => <AMPDocument src={`/${props.params.category}/${props.params.document}/`} />
      } />
    </Route>
  </Router>
), document.getElementById('root'));
