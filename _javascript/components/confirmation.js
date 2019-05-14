import React from 'react';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { setStep, checkoutToServer } from '../actions';
import moment from 'moment'
import 'moment/locale/es'  // without this line it didn't work
import { scrollToTargetAdjusted } from '../utils';


/**
 * A snippet of an AMP document that links to the full content.
 */



const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    advice: {
        padding: '10px 0'
    }
});

class Confirmation extends React.Component {
    constructor(props) { 
        super(props)
        this.element = React.createRef();
        this.state = {
            loading:false
        }
    } 
    componentDidMount() { 
        if (window.innerWidth < 600) { 
            this.element.current.scrollIntoView({block: "end", behavior: "smooth"});
        }
    }
    showAdvice(type) { 
        let advice=``
        switch (type) {
            case "cash":
                var today = new Date();
                today.setHours(today.getHours() + 120);
                let dueDate = moment(today).format("dddd, DD MMMM, h:mm a");
                advice = `Después de hacer clic en pagar tendrás hasta el <b>${dueDate} (5 dias)</b>  para realizar el pago en efectivo en la oficina que elegiste,<b> pasado este tiempo la factura vencerá.</b>`
                break;
            case "pse":
                advice = `Después de hacer clic en pagar, serás dirigido al sitio web de PSE en el cual continuarás el proceso.`
                break;
            case "credit":
                advice = `Después de hacer clic en pagar, procederemos el proceso de pago con tarjeta de crédito.`
                break;
            default:
                console.log("not sure what to do i'm lost")
        }  
        return {__html: advice}
    }
    render() {
        const { handleSet, handleSend, activeStep, classes, order, payment, shipping, cart } = this.props;

        return (
            <div>
                <div ref = {this.element} className={classes.advice} dangerouslySetInnerHTML={this.showAdvice(payment.type)} />
                <Button
                    disabled={activeStep === 0}
                    onClick={() => {handleSet(activeStep-1)}}
                    className={classes.button}
                >
                    Atras
                </Button>
                <Button
                    variant="raised"
                    color="primary"
                    onClick={() => { handleSend(order, payment, shipping, cart);}}
                    className={classes.button}
                >
                Pagar
                </Button>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    handleSet: (index) => {
      dispatch(setStep(index));
    },
    handleSend: (order, payment, shipping, cart) => { 
        dispatch(checkoutToServer(order, payment, shipping, cart ))
    }
});

const mapStateToProps = state => ({
  activeStep: state.activeStep,
  payment: state.payment,
  shipping: state.shipping,
  order: state.order,
  cart:  state.cart
}); 
  
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Confirmation));
