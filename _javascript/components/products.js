import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { getProducts } from '../actions';

const styles = {
  container: {
    flexGrow: 1
  },
  products: {
    listStyle: 'none',
    padding: 0
  },
  '@media (min-width: 768px)': {
    products: {
      display: 'flex',
      flexWrap: 'wrap'
    }
  },
  product: {
    position: 'relative',
    display: 'block'
  },
  wrapper: {
    flexBasis: '50%',
    border: 'solid white 2px'
  },
  producttitle: {
    position: 'absolute',
    top: 0,
    textAlign: 'center',
    fontFamily: 'monospace',
    fontSize: '25px',
    fontWeight: 'bold',
    top: '10%',
    left: '10%',
    zIndex: '2000',
    color: 'white'
  }
};

class Products extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    const { products, classes } = this.props;
    return (
      <div>
        <ul className={classes.products}>
          {products.length == 0 ? (<div className="loading"><img src="/images/loading.gif" /></div>) : ""}  
          {products.map((product, key) => (
            <li className={classes.wrapper} key={key}>
              <Link className={classes.product} to={`/producto`}>
                <div className="article" style={{  backgroundImage: 'url('+(product.attrs.images.length && product.attrs.images[0].attrs.src.value)+')' }}>
                  <div className="scrim-top" />
                  <div className="scrim-bottom" />
                  <div className={classes.producttitle}>{product.attrs.title.value}</div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  componentDidMount() { 
    this.props.getProducts();
  }
}

const mapStateToProps = state => ({
  products: state.products
});
const mapDispatchToProps = dispatch => ({
  getProducts: () => {
    dispatch(getProducts());
  }
})

export default connect(mapStateToProps,mapDispatchToProps)(withStyles(styles)(Products));
