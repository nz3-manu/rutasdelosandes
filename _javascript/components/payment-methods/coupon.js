import React from 'react';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import { connect } from 'react-redux';
import { changeExpansion } from '../../actions';

const styles = theme => ({
    root: {
      flexGrow: 1,
    }
});

const mapDispatchToProps = dispatch => ({
    handleChange: (index) => {
      dispatch(changeExpansion(index));
    }
  });
  const mapStateToProps = state => ({
    expanded: state.expanded
  });
  
class Coupon extends React.Component { 
    render() { 
        const { classes, expanded ,handleChange  } = this.props;
        return (
            <ExpansionPanel onChange={(event,expanded) => { handleChange('panel4') }} expanded={expanded === 'panel4'} >
                <ExpansionPanelSummary  style={{ padding: "0" }} expandIcon={<ExpandMoreIcon />}>
                codigo descuento
                </ExpansionPanelSummary>
                <ExpansionPanelDetails style={{ padding: "4px 12px 12px" }} > 
                tienes un codigo de descuento? agregalo aqui   
                </ExpansionPanelDetails>
            </ExpansionPanel>
        )
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Coupon));