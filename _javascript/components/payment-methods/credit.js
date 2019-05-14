import React from 'react';
import classNames from 'classnames';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PropTypes from 'prop-types';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import { connect } from 'react-redux';
import { changeExpansion, setCredit } from '../../actions';
import TextField from '@material-ui/core/TextField';
import CreditCard from '@material-ui/icons/CreditCard';
import ButtonBase from '@material-ui/core/ButtonBase';
import validation from '../../decorators'

let letters = (() => { let regex = /^[a-zA-Z ]+$/; return regex.test.bind(regex) })()
let numbers = (() => { let regex = /^\d+$/; return regex.test.bind(regex) })()

let active =  {
  border: '1px solid #A5C407',
  boxShadow: '0 0 6px 1px #A5C407 !important'
}
const styles = theme => ({
  root: {
    flexGrow: 1
  },
  selected:active,
  container: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  menu: {
    width: 200
  },
  creditlogos: {
    display: 'flex',
    listStyle: 'none',
    margin: 0,
    padding: 0,
    flexWrap: 'wrap'
  },
  creditlogo: {
    backgroundImage: 'url("/images/spritebox.png")',
    backgroundSize: '590px',
    width: '75px',
    height: '49px',
    boxShadow:
      '0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)',
    borderRadius: '2px',
    margin: '3px'
  },
  mastercard: {
    backgroundPosition: '112px 162px'
  },
  visa: {
    backgroundPosition: '112px 112px'
  },
  amex: {
    backgroundPosition: '111px 210px'
  },
  dinners: {
    backgroundPosition: '187px 211px'
  },
  codensa: {
    backgroundPosition: '109px 288px'
  }
});

const creditCards = [
  { value: 'VISA', className: 'visa' },
  { value: 'MASTERCARD', className: 'mastercard' },
  { value: 'AMEX', className: 'amex' },
  { value: 'DINERS', className: 'dinners' },
  { value: 'CODENSA', className: 'codensa' }
];

const years = ["2018", "2019", "2020", "2021", "2022", "2023", "2024"];
const months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
const cuotas = ["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20"];
const dniLabels = ['cc', 'dni', 'passport'];
const generateForm = function (classes, medium) {

  let {  dni, dniNumber, cardName,cardNumber, cardMonth, cardYear, cvv, cardQuotas, phone} = this.state.form 
  let { isDisabled, shouldMarkError } = this.isDisabled(this.state.form, this.state.touched)
  let { payment, setCredit } = this.props
  let creditParams = {
    cvcMaxlength:3
  }
  if (medium == "AMEX") { 
    creditParams.cvcMaxlength = 4;
  }

  payment = Object.keys(payment).reduce((acu, cur, i) => {
    if (cur != "type") {
      let filtered = Object.assign(acu, { [cur]: payment[cur] })
      return filtered
    }
    else { 
      return acu
    }
  }, {})

  if (!isDisabled && (JSON.stringify(this.state.form )!== JSON.stringify(payment))) { 
    setCredit(this.state.form)
  }
 
  return (
    <div>
      <sub>Los campos marcados con * son obligatorios</sub>
      <TextField
        required
        error={shouldMarkError("cardName")}
        onBlur={this.handleBlur("cardName")}
        onChange={this.handleChange("cardName")}
        value={cardName}
        id="name-card"   
        label="Nombre"
        fullWidth
        placeholder="Nombres y apellidos"
        className={classes.textField}
        helperText="Ingresa tu nombre"
        margin="dense"
      />
      <TextField
        id="dni"
        select
        className={classes.textField}
        value={dni}
        error={shouldMarkError("dni")}
        onBlur={this.handleBlur("dni")}
        onChange={this.handleChange("dni")}
        margin="dense"
        SelectProps={{
          MenuProps: {
            className: classes.menu
          }
        }}
      >
        {dniLabels.map((option, i) => (
          <MenuItem key={i} value={option}>
            {option}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        required
        id="dni-number"
        label="Documento"
        type="number"
        placeholder="Ej: 1089745623"
        helperText="Numero de documento"
        className={classes.textField}
        value={dniNumber}
        onBlur={this.handleBlur("dniNumber")}
        error={shouldMarkError("dniNumber")}
        onChange={this.handleChange("dniNumber")}
        margin="dense"
      />
      <FormControl fullWidth margin="dense" className={classNames(classes.margin)}>
        <InputLabel htmlFor="cardNumber">Numero en la tarjera</InputLabel>
        <Input
          id="cardNumber"        
          type="number"
          placeholder="5412 7512 3412 3456"
          onBlur={this.handleBlur("cardNumber")}
          error={shouldMarkError("cardNumber")}
          onChange={this.handleChange("cardNumber")}
          value={cardNumber}
          endAdornment={
            <InputAdornment position="end">
              <IconButton>
                <CreditCard />
              </IconButton>
            </InputAdornment>
          }
        />
      </FormControl>
      <TextField
        id="cvv"
        style={{width:"60px"}}      
        label="Codigo"    
        placeholder="000"
        className={classes.textField}
        inputProps={{ maxLength: creditParams.cvcMaxlength }}
        value=""
        helperText="CVV / CVC"
        onBlur={this.handleBlur("cvv")}
        error={shouldMarkError("cvv")}
        onChange={this.handleChange("cvv")}
        value={cvv}
        margin="dense"
      />
      <TextField
        id="cardMonth"
        select
        label="Mes"
        className={classes.textField}
        onBlur={this.handleBlur("cardMonth")}
        error={shouldMarkError("cardMonth")}
        onChange={this.handleChange("cardMonth")}
        value={cardMonth}
        margin="dense"
        SelectProps={{
          MenuProps: {
            className: classes.menu
          }
        }}
      >
        {months.map((option, i) => (
          <MenuItem key={i} value={option}>
            {option}
          </MenuItem>
        ))}
      </TextField>
      /
      <TextField
        id="card-year"
        select
        label="Año"
        className={classes.textField}
        onBlur={this.handleBlur("cardYear")}
        error={shouldMarkError("cardYear")}
        onChange={this.handleChange("cardYear")}
        value={cardYear}
        margin="dense"
        SelectProps={{
          MenuProps: {
            className: classes.menu
          }
        }}
      >
        {years.map((option, i) => (
          <MenuItem key={i} value={option}>
            {option}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        id="cardQuotas"
        select
        label="Cuotas"
        className={classes.textField}
        onBlur={this.handleBlur("cardQuotas")}
        error={shouldMarkError("cardQuotas")}
        onChange={this.handleChange("cardQuotas")}
        value={cardQuotas}
        helperText="Numero de Cuotas"    
        margin="dense"
        SelectProps={{
          MenuProps: {
            className: classes.menu
          }
        }}
      >
        {cuotas.map((option, i) => (
          <MenuItem key={i} value={option}>
            {option}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        required
        fullWidth
        id="phone"
        label="Telefono"
        placeholder="Ej: 3112222222"
        className={classes.textField}
        onBlur={this.handleBlur("phone")}
        error={shouldMarkError("phone")}
        onChange={this.handleChange("phone")}
        value={phone}
        margin="dense"
      />
    </div>
  );
};
class Credit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      form: {
        medium:"",
        cardName: "",
        dni: dniLabels[0],
        dniNumber: "",
        cardMonth:months[0],
        cardYear: years[0],
        cvv:"",
        cardNumber:"",
        cardQuotas: cuotas[0],
        phone:""
      },
      touched: {}
    }
    
    this.generateForm = generateForm.bind(this)
    this.handleBlur = validation.handleBlur
    this.isDisabled = validation.isDisabled
    this.validate = validation.validate({
      medium: letters,
      cardName: letters,
      dni: letters,
      dniNumber: numbers,
      cardMonth:numbers,
      cardYear: numbers,
      cvv:numbers,
      cardNumber: this.valid_credit_card,
      cardQuotas: numbers,
      phone:numbers
    })
    this.handleChange = validation.handleChange.bind(this);

  }
  // takes the form field value and returns true on valid number
  valid_credit_card(value) {
    // accept only digits, dashes or spaces
    if (/[^0-9-\s]+/.test(value)|| value.length == 0) {
      return false;
    } 
    // The Luhn Algorithm. It's so pretty.
    var nCheck = 0, nDigit = 0, bEven = false;
    value = value.replace(/\D/g, "");

    for (var n = value.length - 1; n >= 0; n--) {
      var cDigit = value.charAt(n),
          nDigit = parseInt(cDigit, 10);

      if (bEven) {
        if ((nDigit *= 2) > 9) nDigit -= 9;
      }

      nCheck += nDigit;
      bEven = !bEven;
    }

    return (nCheck % 10) == 0;
  }
  render() {
    const { classes, expanded, handleChange } = this.props;
    return (
      <ExpansionPanel
        onChange={(event, expanded) => {
          handleChange('panel2');
        }}
        expanded={expanded === 'panel2'}
      >
        <ExpansionPanelSummary
          style={{ padding: '0' }}
          expandIcon={<ExpandMoreIcon />}
        >
        💳 credito
        </ExpansionPanelSummary>
        <ExpansionPanelDetails style={{ padding: '4px 12px 12px' }}>  
          <div>
            <div className={classes.creditlogos}>
                {creditCards.map((obj, i) => {
                  let selected = (this.state.selected == obj.className) ? classes['selected'] : '';
                  return (
                    <ButtonBase
                      key={i}
                      onClick={(e) => { this.setState({ form: { ...this.state.form, medium: e.target.dataset.medium } }); this.setState({ selected: obj.className }) }}
                      focusRipple
                      data-medium={obj.value}
                      className={[classes.creditlogo, classes[obj.className], selected].join(
                        ' '
                      )}
                    />
                  );
                })}
            </div>
            {this.state.form.medium && this.generateForm(classes,this.state.form.medium)}
          </div>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }
}
Credit.propTypes = {
  classes: PropTypes.object
};


const mapStateToProps = state => ({
  expanded: state.expanded,
  payment: state.payment
});
const mapDispatchToProps = dispatch => ({
  handleChange: index => {
    dispatch(changeExpansion(index));
  },
  setCredit: (data) => { 
    dispatch(setCredit(data))
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles)(Credit)
);
