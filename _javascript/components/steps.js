
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Payment from './payment'
import Shipping from './shipping'
import Confirmation from './confirmation'
import { connect } from 'react-redux';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableFooter from '@material-ui/core/TableFooter';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import utils from '../../pdf-recibo';

const styles = theme => ({
    button: {
      marginTop: theme.spacing.unit,
      marginRight: theme.spacing.unit,
    },
    actionsContainer: {
      marginBottom: theme.spacing.unit * 2,
    },
    resetContainer: {
      padding: theme.spacing.unit * 3,
    },
    th: {
        border: '1px solid black'
    },
    td: {
        border: '1px solid black'
    },
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
        overflowX: 'auto',
        width: '100%',  
        display: 'flex',
        flexDirection: 'column'
    },
    row: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.background.default,
        },
    },
    details: {
        position: 'relative'
    },
    fixedwidget: {
        width: '100%'
    },
    sidebar: {
        padding: '10px',
    },

    '@media (min-width: 992px)': {
        root: {
            flexDirection: 'row'
        },
        button: {
          width: '200'
        },
        checkout: {
            width: '60%'   
        },
        details: {
            width:'40%'
        },
        sidebar: {
            position: 'absolute',
        },
        fixedwidget: {
            position: 'fixed',
            bottom: 'unset',
            width: '388px'
        },
        table: {
            minWidth: '700',
          },
        textBold:{
            fontWeight: '600',
        },
      }
});

const CustomTableCell = withStyles(theme => ({
    head: {
      fontSize: 11,
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
      padding:'0px',
      textAlign: 'center'
      
    },
    body: {
        fontSize: 11,
        padding: '0 2px 0 2px',
        lineHeight: 'normal',
        textAlign: 'center'
    },
    footer: {
        fontSize: 12,
        color: theme.palette.common.black,
        padding: '0 2px 0 2px',
        textAlign: 'center'
    },
}))(TableCell);

class Steps extends React.Component { 
    getStepContent(step) {
        switch (step) {
          case 0:
            return <Shipping />
          case 1: 
            return <Payment />
          case 2:
            return <Confirmation />;
          default:
            return 'Unknown step';
        }
    }
    getSteps() {
        return ['Datos de Envío', 'Datos de Pago', 'Confirmación'];
    }
    render() { 
        const { classes, activeStep, cart } = this.props;
        let total = cart.reduce((prev,cur,i) => { 
            return prev+cur.value.amount
        },0)
        const steps = this.getSteps();
        return (
            <div className={classes.root}>
                <div className={classes.details}>
                    <div className={classes.sidebar}>
                        <div className={classes.fixedwidget}>
                           <span className={classes.textBold}>RESUMEN DE LA COMPRA</span>  
                            <Paper className={classes.root}>
                            <Table style={{tableLayout: "fixed" }} >
                                <TableHead>
                                    <TableRow>
                                        <CustomTableCell>Producto</CustomTableCell>
                                        <CustomTableCell numeric>Q</CustomTableCell>
                                        <CustomTableCell numeric>Precio</CustomTableCell>
                                        <CustomTableCell numeric>Total</CustomTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {cart.filter((product)=>product.sku != "envio").map((item,i) => {
                                            
                                        return (<TableRow className={classes.row} key={i}>
                                            <CustomTableCell>
                                            {item.name}
                                            </CustomTableCell>
                                            <CustomTableCell numeric>{item.quantity}</CustomTableCell>
                                            <CustomTableCell numeric>${utils.formatMoney(item.unit_price.amount,0,0)}</CustomTableCell>
                                            <CustomTableCell numeric> ${utils.formatMoney(item.value.amount,0,0)} </CustomTableCell>
                                        </TableRow>)
                                    }
                                    )} 
                                </TableBody>
                                <TableFooter >
                                    <TableRow style={{ height:'35px' }}>
                                        <CustomTableCell></CustomTableCell>
                                        <CustomTableCell></CustomTableCell>
                                        <CustomTableCell numeric>Envío</CustomTableCell>
                                        <CustomTableCell numeric>${utils.formatMoney(7000,0,0)}</CustomTableCell>        
                                    </TableRow>
                                    <TableRow style={{ height:'35px' }}>
                                        <CustomTableCell></CustomTableCell>
                                        <CustomTableCell></CustomTableCell>
                                        <CustomTableCell numeric>Total</CustomTableCell>
                                        <CustomTableCell numeric> ${utils.formatMoney(total,0,0)}</CustomTableCell>
                                    </TableRow>
                                </TableFooter>  
                            </Table>
                            </Paper> 
                        </div>
                    </div>
                </div>
                <div className={classes.checkout}>
                    <Stepper style={{padding:'10px'}}  activeStep={activeStep} orientation="vertical">
                    {steps.map((label, index) => {
                        return (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                            <StepContent>
                            {this.getStepContent(index)}
                            </StepContent>
                        </Step>
                        );
                    })}
                    </Stepper>
                </div>
        </div>
        )
    }
}
const mapStateToProps = state => ({
    activeStep: state.activeStep,
    cart: state.cart.items
});

export default connect(mapStateToProps)(withStyles(styles)(Steps));
