import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Coupon from './payment-methods/coupon';
import Cash from './payment-methods/cash';
import Credit from './payment-methods/credit';
import Pse from './payment-methods/pse';
import Button from '@material-ui/core/Button';
import {setStep} from '../actions';
import {connect} from 'react-redux';
import {scrollToTargetAdjusted} from '../utils';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
});

class ControlledExpansionPanels extends React.Component {
  constructor(props) {
    super(props);
    this.el = React.createRef();
    this.state = {
      expanded: null,
    };
  }
  handleChange(panel) {
    return (event, expanded) => {
      this.setState({
        expanded: expanded ? panel : false,
      });
    };
  }

  componentDidMount() {
    if (window.innerWidth < 600) {
      scrollToTargetAdjusted(this.el.current, 167);
    }
  }

  render() {
    const {classes, handleSet, activeStep, payment} = this.props;
    const {expanded} = this.state;

    return (
      <div ref={this.el} className={classes.root}>
        <Cash />
        <Credit />
        <Pse />
        <Button
          disabled={activeStep === 0}
          onClick={() => {
            handleSet(activeStep - 1);
          }}
          className={classes.button}>
          Atras
        </Button>
        <Button
          variant="raised"
          disabled={Object.keys(payment).length == 0}
          color="primary"
          onClick={() => {
            window.scrollTo(0, 0);
            handleSet(activeStep + 1);
          }}
          className={classes.button}>
          Siguiente
        </Button>
      </div>
    );
  }
}
ControlledExpansionPanels.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapDispatchToProps = dispatch => ({
  handleSet: index => {
    dispatch(setStep(index));
  },
});

const mapStateToProps = state => ({
  activeStep: state.activeStep,
  payment: state.payment,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(ControlledExpansionPanels));
