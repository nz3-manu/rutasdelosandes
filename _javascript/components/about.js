import React from 'react';
import {withStyles} from '@material-ui/core/styles';

let Whatsapp = () => (
  <div>
    {' '}
    📲{' '}
    <a href="https://api.whatsapp.com/send?phone=573113403572&text=Me%20gustaría%20saber%20donde%20esta%20mi%20producto">
      whatsapp
    </a>
  </div>
);

const style = {
  container: {
    margin: 'auto',
    padding: '30px 10px',
  },
  tittle: {
    textAlign: 'center',
  },
  bold: {
    fontWeight: 'bold',
  },
};

class About extends React.Component {
  render() {
    const {classes} = this.props;
    return (
      <div>
        <img src="/images/acerca/featured.jpg" />
        <div className={classes.container}>
          <h2 className={classes.tittle}> Nuestros productos </h2>
          <p>
          Todos nuestros productos son hechos con la mejor calidad y tecnología disponibles en el mercado y han sido probados en las condiciones más difíciles  por nuestro equipo.
          </p>
          <h2 className={classes.tittle}> Contactanos </h2>
          <p>
            {' '}
            Si quieres comercializar nuestros productos puedes comunicarte con nosotros por los siguientes medios:
          </p>
          <ul>
            <li>
              {' '}
              📪{' '}
              <a href="mailto:rutasdelosandes@gmail.com">
                correo electronico
              </a>{' '}
            </li>
            <li>
              {' '}
              📱{' '}
              <a href="https://api.whatsapp.com/send?phone=3113403572&text=Quiero%20vender%20sus%20productos">
                Whatsappp
              </a>{' '}
            </li>
            <li>
              {' '}
              📞 {' '}
              <a  href="tel: 3113403572">
                Telefono: 3113403572
              </a>{' '}
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default withStyles(style)(About);
