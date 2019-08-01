import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import {connect} from 'react-redux';
import Colombia from '../colombia.json';
import Autocomplete from './autocomplete';
import TextField from '@material-ui/core/TextField';
import validation from '../decorators';
import Button from '@material-ui/core/Button';
import {setShipping, setStep, getOrder} from '../actions';

let letters = (() => {
  let regex = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]+$/;
  return regex.test.bind(regex);
})();
let numbers = (() => {
  let regex = /^[0-9 ]+$/;
  return regex.test.bind(regex);
})();
let address = () => {
  let regex = /^[a-zA-Z0-9 ]+$/;
  return regex.test.bind(regex);
};
let email = (() => {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z ]{2,}))$/;
  return re.test.bind(re);
})();

let optional = (() => {
  let regex = /^[a-zA-Z ]*$/;
  return regex.test.bind(regex);
})();

const Alldepartments = Object.keys(Colombia);

const Allcities = Object.keys(Colombia).reduce((acu, cur, i) => {
  let cities = acu.concat(Colombia[cur]);
  return cities;
}, []);

const styles = {
  container: {
    flexGrow: 1,
  },
  textBold: {
    fontWeight: '600',
    color: 'black',
    fontSize: '15px',
  },
  textImportant: {
    color: '#f7412d;',
    fontSize: '18px',
  },
};

class Shipping extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      form: {
        name: '',
        email: '',
        country: 'colombia',
        deparment: '',
        city: '',
        address: '',
        phone: '',
        instructions: '',
      },
      touched: {},
    };
    this.handleBlur = validation.handleBlur;
    this.isDisabled = validation.isDisabled;
    this.validate = validation.validate({
      name: letters,
      email: email,
      country: letters,
      deparment: letters,
      city: letters,
      address: address,
      phone: numbers,
      instructions: optional,
    });
    this.handleChange = validation.handleChange.bind(this);
  }
  render() {
    let {isDisabled, shouldMarkError} = this.isDisabled(
      this.state.form,
      this.state.touched,
    );
    let {cart, shipping, setShipping, activeStep, createOrder} = this.props;

    if (
      !isDisabled &&
      JSON.stringify(this.state.form) !== JSON.stringify(shipping)
    ) {
      setShipping(this.state.form);
    }
    const {classes} = this.props;
    return (
      <div>
        <sub className={classes.textBold}>
          Los campos marcados con{' '}
          <spand className={classes.textImportant}> * </spand> son obligatorios
        </sub>

        <TextField
          required
          id="name"
          label="Nombre"
          fullWidth
          placeholder="Nombre y apellido"
          value={this.state.name}
          onBlur={this.handleBlur('name')}
          onChange={this.handleChange('name')}
          error={shouldMarkError('name')}
          //helperText="Nombre y apellido del destinatario "
          margin="dense"
        />
        <TextField
          required
          id="email"
          label="Email"
          fullWidth
          placeholder="nombre@correo.com"
          value={this.state.email}
          onBlur={this.handleBlur('email')}
          onChange={this.handleChange('email')}
          error={shouldMarkError('email')}
          //helperText="Correo electronico"
          margin="dense"
        />
        <TextField
          fullWidth
          disabled
          id="country"
          value="Colombia"
          fullWidth
          //helperText="País"
          onChange={() => {
            console.log('change');
          }}
          margin="dense"
        />
        {/* <Autocomplete
          label="Departamento*"
          id="departament"
          onChange={(event) => { console.log("there was a change",event.target.value); this.setState({ form: {...this.state.form, deparment: selectedItem}});}}
          error={shouldMarkError("department")}
          onBlur={this.handleBlur("department")}
          suggestions={Alldepartments}
          value={this.state.deparment}
          error={shouldMarkError("deparment")}
          margin="dense"
        /> 
        <Autocomplete
          label="Ciudad*"
          id="city"
          onChange={(event) => { console.log("there was a change",); this.setState({ form: {...this.state.form, city: selectedItem}});}}
          error={shouldMarkError("city")}
          onBlur={this.handleBlur("city")}
          suggestions={ this.state.form.deparment ? Colombia[this.state.form.deparment] : Allcities}
          value={this.state.city}
          error={shouldMarkError("city")}
          margin="dense"
        />*/}

        <TextField
          fullWidth
          required
          id="departament"
          label="Departamento"
          fullWidth
          placeholder="departamento"
          value={this.state.deparment}
          onChange={this.handleChange('deparment')}
          onBlur={this.handleBlur('deparment')}
          error={shouldMarkError('deparment')}
          //helperText="Departamento de envío"
          margin="none"
        />
        <TextField
          fullWidth
          required
          id="city"
          label="Ciudad"
          fullWidth
          placeholder="ciudad o municipio"
          value={this.state.city}
          onChange={this.handleChange('city')}
          onBlur={this.handleBlur('city')}
          error={shouldMarkError('city')}
          //helperText="Ciudad de envío"
          margin="none"
        />
        <TextField
          fullWidth
          required
          id="address"
          label="Dirección"
          fullWidth
          placeholder="Calle, carrera, número de la casa"
          value={this.state.address}
          onChange={this.handleChange('address')}
          onBlur={this.handleBlur('address')}
          error={shouldMarkError('address')}
          //helperText="Dirección de envío"
          margin="dense"
        />
        <TextField
          fullWidth
          required
          id="phone"
          label="Celular"
          fullWidth
          placeholder=""
          value={this.state.phone}
          onChange={this.handleChange('phone')}
          onBlur={this.handleBlur('phone')}
          error={shouldMarkError('phone')}
          //helperText="Numero de contacto"
          margin="dense"
        />
        <TextField
          fullWidth
          id="instructions"
          label="Instrucciones(opcional)"
          fullWidth
          multiline
          rows="3"
          placeholder="Dejanos información que creas necesaria para facilitar el envío."
          value={this.state.instructions}
          onChange={this.handleChange('instructions')}
          onBlur={this.handleBlur('instructions')}
          error={shouldMarkError('instructions')}
          //helperText="Notas para envío"
          margin="normal"
        />
        <Button
          variant="raised"
          color="primary"
          disabled={Object.keys(shipping).length == 0}
          onClick={() => {
            createOrder(shipping, cart, activeStep + 1);
          }}
          className={classes.button}>
          Siguiente
        </Button>
      </div>
    );
  }
}

Shipping.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapDispatchToProps = dispatch => ({
  handleChange: index => {
    dispatch(changeExpansion(index));
  },
  setShipping: data => {
    dispatch(setShipping(data));
  },
  createOrder: (shipping, cart, index) => {
    dispatch(getOrder(shipping, cart, index));
  },
});

const mapStateToProps = state => ({
  activeStep: state.activeStep,
  shipping: state.shipping,
  cart: state.cart,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(Shipping));
