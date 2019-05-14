import { SETINITIAL, EXPANSIONCHANGE, SETSTEP, SETSPAYMENT, SETSHIPPING, SETPRODUCT, SETORDER, SETLOADING, SETCARTITEMS, SETPRODUCTS } from './actions';
export default (state , action) => {
    switch (action.type) {
      case EXPANSIONCHANGE:
        return Object.assign({}, state, {
          expanded: action.index
        }) 
      case SETSTEP: 
        return Object.assign({}, state, {
          activeStep: action.index
        })
      case SETSPAYMENT:
        return Object.assign({}, state, action.data)  
      case SETSHIPPING:
        return Object.assign({}, state, action.data)  
      case SETPRODUCT:
        return Object.assign({}, state, action.data)  
      case SETORDER:
        return Object.assign({}, state, action.data)  
      case SETLOADING:
        return Object.assign({}, state, action.data)  
      case SETCARTITEMS:
        return Object.assign({}, state, action.data)  
      case SETPRODUCTS:
        return Object.assign({}, state, action.data)
      default:
        return state;
    }
};

