import React from 'react';
import {connect} from 'react-redux';
import {getCart, deleteItem} from '../actions';

class Cart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      cartIsOpen: this.props.cart.open,
    };
  }
  toggleCart() {
    this.setState({cartIsOpen: !this.state.cartIsOpen});
  }
  render() {
    const {cart, deleteItems} = this.props;
    console.log(this.state, cart);
    return (
      <div>
        <a className="wrap-cart" onClick={this.toggleCart.bind(this)}>
          <img
            className="cart-icon"
            src="/images/cart.svg"
            height="40"
            width="40"></img>
          <div className="cart-items productQ">
            <span>{cart.number}</span>
          </div>
        </a>
        {this.state.cartIsOpen && (
          <div className="edit-cart">
            <div className="wrap-shoppingCart">
              <button
                onClick={this.toggleCart.bind(this)}
                type="button"
                className="close">
                <span>×</span>
              </button>
              <h2> MI CARRITO DE COMPRAS </h2>
              <div className="cart-items table">
                {!cart.number && (
                  <p>Aun no agregaste productos a tu carrito de compras.</p>
                )}
                {cart.items.map((item, i) => {
                  let {variant} = item;

                  return (
                    <div key={i} className="cart-item row">
                      <div className="cart-item-name cell">
                        {' '}
                        <img width="100px" src={variant.image.src} />{' '}
                      </div>
                      <div className="cart-item-name cell">
                        {item.title}
                        <br />
                        <sub>{variant.title}</sub>
                      </div>
                      <div className="cart-item-quantity cell">
                        {item.quantity}
                      </div>
                      <div
                        onClick={deleteItems(item.id, item.quantity)}
                        className="cart-item-clear cell">
                        ×
                      </div>
                    </div>
                  );
                })}
              </div>
              {!cart.number ? (
                <a href="https://randes-store.myshopify.com/" className="buy cartBuy">
                  IR A LA TIENDA
                </a>
              ) : (
                <a
                  href={`/checkout?checkoutId=${cart.checkoutId}`}
                  className="buy cartBuy">
                  FINALIZAR COMPRA
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  componentDidMount() {
    this.props.getItems();
  }
}

const mapStateToProps = state => ({
  cart: state.cart,
});

const mapDispatchToProps = dispatch => ({
  getItems: () => {
    dispatch(getCart());
  },
  deleteItems: (id, quantity) => {
    return () => {
      let deleteconfirm = confirm('Esta seguro de eliminar este elemento ?');
      if (deleteconfirm) {
        dispatch(deleteItem(id, quantity));
      }
    };
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Cart);
