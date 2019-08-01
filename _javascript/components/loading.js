import React from 'react';
import {connect} from 'react-redux';
import {withStyles} from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  advice: {
    padding: '10px 0',
  },
  loading: {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    zIndex: '1000000',
    background: '#988a8a9e',
  },
  loadingImage: {
    position: 'absolute',
    zIndex: '1000',
    top: '50%',
    left: '50%',
  },
});

const Loading = ({loading, classes}) => {
  let output;
  if (loading) {
    output = (
      <div className={classes.loading}>
        <img className={classes.loadingImage} src="/images/ajax-loader.gif" />
      </div>
    );
  } else {
    output = <div></div>;
  }
  return output;
};

const mapStateToProps = state => ({
  loading: state.loading,
});

export default connect(mapStateToProps)(withStyles(styles)(Loading));
