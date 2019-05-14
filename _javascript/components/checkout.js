import React from 'react';
import Steps from './steps'
import Loading from './loading';

class Checkout extends React.Component {
  constructor(props) { 
    super(props)
  }
  render() {
    return (
      <div>
         <Loading/>
         <Steps />
        </div>
    );
  }
}
 
export default Checkout;