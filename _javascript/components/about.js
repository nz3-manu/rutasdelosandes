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
          <h2 className={classes.tittle}> ¿Quienes somos ? </h2>
          <p>
          Rutas de los andes  es una comunidad de viajes que busca mostrar los mejores lugares de Colombia  a medida que muestra los productos de senderismo comercializados por su marca Randes. Todos los productos son hechos con la mejor calidad y tecnología disponibles en el mercado y son  probados en las condiciones más difíciles por todo su equipo de trabajo.
          </p>
          <h2 className={classes.tittle}> Trabajemos juntos 🤝</h2>
            {' '}
            <ul>
            <li>
              📢 Quieres potenciar tu negocio; Hotel, Hostal o Agencia de turismo escribenos.
            </li>
            <li>🏬 Tienes una tienda deportiva y quieres vender nuestros productos escribenos.</li>
          </ul>
             <p>{' '} {' '} {' '}📪 Correo electrónico: rutasdelosandes@gmail.com</p>
        </div>
      </div>
    );
  }
}

export default withStyles(style)(About);
