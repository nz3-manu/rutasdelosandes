import React from 'react';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import { connect } from 'react-redux';
import { changeExpansion, setPse } from '../../actions';
import Autocomplete from '../autocomplete';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import validate from '../../decorators'
import validation from '../../decorators'

let letters = (() => { let regex = /^[a-zA-Z ]+$/; return regex.test.bind(regex) })()
let numbers = (() => { let regex = /^\d+$/; return regex.test.bind(regex) })()

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  advice: {
    fontSize: '11px',
    lineHeight: '1',
    paddingLeft:"10px"
  },
  pselogos: {
    display: 'flex',
    listStyle: 'none',
    margin: 0,
    padding: 0
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  pselogo: {
    backgroundImage: 'url("/images/spritebox-small.png")',
    width: '44px',
    height: '20px',
    backgroundSize: '191px'
  },
  bancolombia: {
    backgroundPosition: '105px 81px'
  },
  davivienda: {
    backgroundPosition: '148px 100px'
  },
  pse: {
    backgroundPosition: '63px 94px'
  },
  bancodebogota: {
    backgroundPosition: '148px 121px'
  }
});
const mapDispatchToProps = dispatch => ({
  handleChange: index => {
    dispatch(changeExpansion(index));
  },
  setPse: data =>{ 
    dispatch(setPse(data))
  }  
});
const mapStateToProps = state => ({
  expanded: state.expanded,
  payment: state.payment
});
const dni = ['CC', 'CE', 'NIT','TI','PP','IDC','CEL','RC','DE'];
const tipoPersona = [{label:'natural', value:'N'}, {label:'juridica',value: 'J'}]
const banks =  [
  {
     "id": "991bfda3-89ff-4e5a-b5ba-47509cbf2b5a",
     "description": "BANCO AV VILLAS",
     "pseCode": "1052"
  },
  {
     "id": "180efbd3-545e-429d-b41f-e0c149020000",
     "description": "BANCO CAJA SOCIAL",
     "pseCode": "1032"
  },
  {
     "id": "0cebcab6-f0e1-4eb0-83cb-9d7948fbfcc6",
     "description": "BANCO COLPATRIA",
     "pseCode": "1019"
  },
  {
     "id": "954285ec-d446-4aa6-9eae-0442dbac3ea2",
     "description": "BANCO CORPBANCA S.A",
     "pseCode": "1006"
  },
  {
     "id": "89672712-c2f8-4cdc-b131-bb424c7ebd5c",
     "description": "BANCO DAVIVIENDA",
     "pseCode": "1051"
  },
  {
     "id": "d8535d19-cab1-477e-b545-38464fb30a69",
     "description": "BANCO DE BOGOTA",
     "pseCode": "1001"
  },
  {
     "id": "f84b16d6-a4ca-43c3-83c2-803c81e24e88",
     "description": "BANCO DE OCCIDENTE",
     "pseCode": "1023"
  },
  {
     "id": "e3aefbe9-bfca-476d-bbb7-f2f0d63adb7d",
     "description": "BANCO FALABELLA ",
     "pseCode": "1062"
  },
  {
     "id": "a2674f77-d994-4dea-b703-01a50eacba64",
     "description": "BANCO GNB SUDAMERIS",
     "pseCode": "1012"
  },
  {
     "id": "b09bfd44-3a98-4383-a7d7-d02a6d35e8c7",
     "description": "BANCO PICHINCHA S.A.",
     "pseCode": "1060"
  },
  {
     "id": "db7ff29f-bbd2-48b2-94be-b29406e9fa03",
     "description": "BANCO POPULAR",
     "pseCode": "1002"
  },
  {
     "id": "94a48ae1-f0ea-45ff-acb1-efd3c6dcfa7e",
     "description": "BANCO PROCREDIT",
     "pseCode": "1058"
  },
  {
     "id": "94cfedbe-da12-4825-b1e0-bec4066f6bf0",
     "description": "BANCOLOMBIA",
     "pseCode": "1007"
  },
  {
     "id": "6d416b46-a165-4cef-9407-3867470e74c9",
     "description": "BANCOOMEVA S.A.",
     "pseCode": "1061"
  },
  {
     "id": "d33c1769-1e32-456e-a866-8406e2652204",
     "description": "BBVA COLOMBIA S.A.",
     "pseCode": "1013"
  },
  {
     "id": "62a4293f-98f0-420e-94d6-6ce34e176f74",
     "description": "CITIBANK ",
     "pseCode": "1009"
  },
  {
     "id": "700cd577-1f8e-4c85-bd45-4d43604c805f",
     "description": "HELM BANK S.A.",
     "pseCode": "1014"
  },
  {
     "id": "4ba59c1c-929b-4d97-b4cc-0416f92715c6",
     "description": "HSBC COLOMBIA ",
     "pseCode": "1010"
  }
]

class Pse extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      form: {
        name: "",
        bank: "",
        personType:tipoPersona[0].value,
        dniType: dni[0],
        dniNumber:""
      },
      touched: {}
    }
    
    this.handleBlur = validation.handleBlur
    this.isDisabled = validation.isDisabled
    this.validate = validation.validate({
      name: letters,
      bank: numbers,
      personType:letters,
      dniType: letters,
      dniNumber:numbers,
    })
    this.handleChange = validation.handleChange.bind(this);
  }
  render() {
    let { classes, expanded, handleChange, payment, setPse } = this.props;
    let { form, touched } = this.state
    let { name, email, bank, personType, dniType, dniNumber } = form
    let { isDisabled, shouldMarkError } = this.isDisabled(form, touched)
    
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
      this.props.setPse(this.state.form)
    }
   return (
      <ExpansionPanel
        onChange={(event, expanded) => {
          handleChange('panel3');
        }}
        expanded={expanded === 'panel3'}
      >
        <ExpansionPanelSummary
          style={{ padding: '0' }}
          expandIcon={<ExpandMoreIcon />}
        >
        🏦 PSE
        </ExpansionPanelSummary>
        <ExpansionPanelDetails style={{ padding: '4px 12px 12px' }}>
          <div>
            <ul className={classes.advice}>
              <li>
                {' '}
                Todas las compras y pagos por PSE son realizados en línea y la
                confirmación es inmediata.{' '}
              </li>
              <li>
                {' '}
                Algunos bancos tienen un procedimiento de autenticación en su
                página (por ejemplo, una segunda clave), si nunca has realizado
                pagos por internet con tu cuenta de ahorros o corriente, es
                posible que necesites tramitar una autorización ante tu banco.
                Si tienes dudas, puedes consultar los requisitos de cada banco.{' '}
              </li>
           </ul>
           <sub>los campos marcados con * son obligatorios</sub>
            <TextField
                id="bank"
                select
                fullWidth        
                helperText="escoge un banco"        
                label="banco"
                className={classes.textField}
                error={shouldMarkError("bank")}
                onBlur={this.handleBlur("bank")}
                onChange={this.handleChange("bank")}
                value={bank}
                margin="dense"
                SelectProps={{
                MenuProps: {
                    className: classes.menu
                }
                }}
            >
                {banks.map((option, i) => (
                <MenuItem key={i} value={option.pseCode}>
                    {option.description}
                </MenuItem>
                ))}
            </TextField>  
            <TextField
                required
                id="name"
                label="Nombre"
                fullWidth
                placeholder="Nombres y apellidos"
                error={shouldMarkError("name")}
                onBlur={this.handleBlur("name")}
                onChange={this.handleChange("name")}
                value={name}
                className={classes.textField}
                helperText="Nombre del titular"
                margin="dense"
            />
            <TextField
                id="person-type"
                select
                fullWidth        
                helperText="Tipo de persona"        
                label="tipo"
                className={classes.textField}
                error={shouldMarkError("personType")}
                onBlur={this.handleBlur("personType")}
                onChange={this.handleChange("personType")}
                value={personType}
                margin="dense"
                SelectProps={{
                MenuProps: {
                    className: classes.menu
                }
                }}
            >
                {tipoPersona.map((option, i) => (
                <MenuItem key={i} value={option.value}>
                    {option.label}
                </MenuItem>
                ))}
            </TextField>      
            <TextField
              id="dniType"
              error={shouldMarkError("dniType")}
              onBlur={this.handleBlur("dniType")}
              onChange={this.handleChange("dniType")}
              select
              className={classes.textField}
              value={dniType}
              margin="dense"
              SelectProps={{
                MenuProps: {
                  className: classes.menu
                }
              }}
            >
            {dni.map((option, i) => (
              <MenuItem key={i} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            required
            id="dni-number"
            label="Documento"
            placeholder="Ej: 1089745623"
            helperText="Numero de documento"
            className={classes.textField}
            value={dniNumber}
            error={shouldMarkError("dniNumber")}
            onBlur={this.handleBlur("dniNumber")}
            onChange={this.handleChange("dniNumber")}
            margin="dense"
          />
          </div>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles)(Pse)
);
