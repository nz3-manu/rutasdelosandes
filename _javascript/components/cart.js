import React from 'react';
import { connect } from 'react-redux';
import { getCart , deleteItem} from '../actions';

class Cart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cartIsOpen:false
    };
  }
  toggleCart (){
    this.setState({cartIsOpen:!this.state.cartIsOpen})
  }
  render() {
    const { cart , deleteItems } = this.props;
    return (
      <div>
             <a className="wrap-cart"  onClick={this.toggleCart.bind(this)}> 
        <img className="cart-icon" src="/images/cart.svg" height="40" width="40"></img>
        <div className="cart-items productQ">
          <span >
              {cart.number}
          </span>
        </div>  
        </a>
        {this.state.cartIsOpen && (<div className="edit-cart">
          <div className="wrap-shoppingCart">
            <h2> MI CARRITO DE COMPRAS </h2>
            <div className="cart-items table">
              {!cart.number && <p>Aun no agregaste productos a tu carrito de compras.</p>}
              {cart.items.filter((item)=>item.sku != "envio").map((item, i) => {
                return (
                  <div key={i} className="cart-item row">
                    <span className="cart-item-name cell">{item.name}</span>
                    <span className="cart-item-quantity cell">{item.quantity}</span>
                    <span onClick={deleteItems(item.id,item.quantity)} className="cart-item-clear cell" >X</span>
                  </div>
                );
              })}
            </div>
            {
              !cart.number ? (<a href="/tienda" className="buy cartBuy">
                IR A LA TIENDA
            </a>) : (<a href="/checkout" className="buy cartBuy">
                  FINALIZAR COMPRA
            </a>)
            }
          </div>
        </div>)}
      </div>
    );
  }
    
  componentDidMount() {
    this.props.getItems()
  }
}

const mapStateToProps = state => ({
  cart: state.cart
});

const mapDispatchToProps = dispatch => ({
  getItems: () => {
    dispatch(getCart());
  },
  deleteItems: (id,quantity) => {
    return () => { 
      let deleteconfirm = confirm("Esta seguro de eliminar este elemento ?");
      if (deleteconfirm) { 
        dispatch(deleteItem(id,quantity));
      } 
    }
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Cart);
