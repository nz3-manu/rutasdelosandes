import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { updateOrder } from '../actions';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const styles = theme => ({
  container: {
    width: '900px',
    margin: 'auto',
    padding: '30px 10px'
  },
  tittle: {
    textAlign: 'center'
  },
  bold: {
    fontWeight: 'bold'
  },
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto'
  },
  table: {
    minWidth: 700
  }
});

class OrdersList extends React.Component {
  render() {
      const { classes, orders, updateOrder } = this.props;
      console.log(orders)
    return (
      <Paper className={classes.root}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell align="right">Creacion</TableCell>
              <TableCell align="right">Nombre</TableCell>
              <TableCell align="right">Estado</TableCell>
              <TableCell align="right">Metodo Pago</TableCell>
              <TableCell align="right">valor</TableCell>
              <TableCell>Errores</TableCell>
              <TableCell align="right">Enviada</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order, key) => (
              <TableRow key={key}>
                <TableCell align="right">
                  {order.meta.timestamps.created_at}
                </TableCell>
                <TableCell align="right">
                  {order.shipping_address.first_name}
                </TableCell>
                <TableCell align="right">{order.status}</TableCell>
                <TableCell component="th" scope="row">
                  {order.shipping_address.line_2}
                </TableCell>
                <TableCell align="right">
                  {order.meta.display_price.with_tax.formatted}
                </TableCell>
                <TableCell component="th" scope="row">
                  {order.shipping_address.last_name}
                </TableCell>
                <TableCell align="right">
                  <input
                    type="checkbox"
                    name="name"
                    checked={order.shipping == 'fulfilled'}
                    onChange={updateOrder(order.id, 'shipping', order)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    );
  }
}
const mapDispatchToProps = dispatch => ({
  updateOrder: (orderId, property, order) => {
    return e => {
      let dataToupdate = {};
      if (property == 'shipping') {
        if (order.status == 'complete') {
          let update = confirm('Esta seguro que desea actualizar la orden');
          if (update) {
            dataToupdate[property] =
              e.target.value == 'on' ? 'fulfilled' : 'unfulfilled';
            dispatch(updateOrder(orderId, dataToupdate));
          }
        } else {
          alert('no se puede enviar una orden que no ha sido pagada');
        }
      }
    };
  }
});

const mapStateToProps = state => ({
  orders: state.orders
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(OrdersList));
