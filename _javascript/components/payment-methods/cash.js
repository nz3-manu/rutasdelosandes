import React from 'react';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import { connect } from 'react-redux';
import { changeExpansion, setCash } from '../../actions';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import Divider from '@material-ui/core/Divider';

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  selected:{
    border: `1px solid ${theme.palette.primary.main}`,
    boxShadow: `0 0 6px 1px ${theme.palette.primary.main} !important`
  },
  cashlogos: {
    '&: hover':{
      border: `1px solid ${theme.palette.primary.main}`,
      boxShadow: `0 0 6px 1px ${theme.palette.primary.main} !important`
    },
    display: 'flex',
    listStyle: 'none',
    margin: 0,
    padding: 0,
    flexWrap: 'wrap'
  },
  cashlogo: {
    backgroundImage: 'url("/images/spritebox-small.png")',
    width: '108px',
    height: '50px',
    boxShadow:
      '0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)',
    borderRadius: '2px',
    margin: '3px'
  },
  baloto: {
    backgroundPosition: '-214px -50px'
  },
  pagatodo: {
    backgroundPosition: '-216px 0px'
  },
  cucuta: {
    backgroundPosition: '-216px -150px'
  },
  gana: {
    backgroundPosition: '365px 99px'
  },
  ganagana: {
    backgroundPosition: '258px 99px'
  },
  suchance: {
    backgroundPosition: '366px 150px'
  },
  acertemos: {
    backgroundPosition: '0 0'
  },
  laperla: {
    backgroundPosition: '366px 50px'
  },
  unidas: {
    backgroundPosition: '0 100px'
  },
  jer: {
    backgroundPosition: '0 50px'
  },
  efecty: {
    backgroundPosition: '-109px 202px'
  },
  bancolombia: {
    backgroundPosition: '260px 201px'
  },
  bogota: {
    backgroundPosition: '-108px 0'
  },
  davivienda: {
    backgroundPosition: '367px 249px'
  }
});
const cashCompanies = [
  { value: 'BALOTO', className: 'baloto' },
  { value: 'OTHERS_CASH', className: 'pagatodo' },
  { value: 'OTHERS_CASH', className: 'cucuta' },
  { value: 'OTHERS_CASH', className: 'gana' },
  { value: 'OTHERS_CASH', className: 'ganagana' },
  { value: 'OTHERS_CASH', className: 'suchance' },
  { value: 'OTHERS_CASH', className: 'acertemos' },
  { value: 'OTHERS_CASH', className: 'laperla' },
  { value: 'OTHERS_CASH', className: 'unidas' },
  { value: 'OTHERS_CASH', className: 'jer' },
  { value: 'EFECTY', className: 'efecty' }
];
const cashBanks = [
  { value: 'BANK_REFERENCED', className: 'bancolombia' },
  { value: 'BANK_REFERENCED', className: 'bogota' },
  { value: 'BANK_REFERENCED', className: 'davivienda' }
];

class Cash extends React.Component {
  constructor(props) {
    super(props);
    this.state = {selected:""}
  }
  render() {
    const { classes, expanded, handleChange, setCash } = this.props;
    return (
      <ExpansionPanel
        onChange={(event, expanded) => {
          handleChange('panel1');
        }}
        expanded={expanded === 'panel1'}
      >
        <ExpansionPanelSummary
          style={{ padding: '0' }}
          expandIcon={<ExpandMoreIcon />}
        >
          <Typography>💵 Efectivo</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails style={{ padding: '4px 12px 12px' }}>
          <div>
            <Typography>Elige una de las opciones</Typography>
            <Typography>Pagos en efectivo en oficinas</Typography>
            <div className={classes.cashlogos}>
              {cashCompanies.map((obj, i) => {
                let selected = (this.state.selected == obj.className) ? classes['selected'] : '';
                return (
                  <ButtonBase
                    key={i}
                    onClick={(e) => { setCash({ paymentMethod: e.target.dataset.medium }); this.setState({selected: obj.className}) }}
                    focusRipple
                    data-medium = {obj.value}
                    className = {[classes.cashlogo, classes[obj.className],selected].join(
                      ' '
                    )}
                  />
                );
              })}
            </div>
            <Divider style={{ margin: '10px 0' }} />
            <Typography>Pagos en efectivo en bancos</Typography>
            <div className={classes.cashlogos}>
              {cashBanks.map((obj, i) => {
                let selected = (this.state.selected == obj.className) ? classes['selected'] : '';
                return (
                  <ButtonBase
                    key={i}
                    onClick={(e) => { setCash({ paymentMethod: e.target.dataset.medium }); this.setState({selected: obj.className}) }}
                    focusRipple
                    selected= {this.state.selected == obj.className}
                    data-medium={obj.value}
                    className = {[classes.cashlogo, classes[obj.className],selected].join(
                      ' '
                    )}
                  />
                );
              })}
            </div>
          </div>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }
}
const mapDispatchToProps = dispatch => ({
  handleChange: index => {
    dispatch(changeExpansion(index));
  },
  setCash: data => { 
    dispatch(setCash(data))
  }  
});
const mapStateToProps = state => ({
  expanded: state.expanded
});
export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles)(Cash)
);
