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
          <h2 className={classes.tittle}> ¿Quienes somos? </h2>
          <p>
            En rutas de los andes compartimos tu misma pasión descubrir nuevas
            rutas ecológicas en Colombia. Todas nuestras rutas fueron creadas
            con la información necesaria para que puedas llegar fácilmente. Lo
            único que te pedimos es que cuides de estos bellos lugares y que
            tengas en cuenta todas las recomendaciones que hacemos.
          </p>

          <h2 className={classes.tittle}> Información de nuestras rutas</h2>

          <p>
            {' '}
            Toda la información que referenciamos en nuestra ruta como:
            hostales, apartamentos, restaurantes, entre otros. Fueron lugares en
            los cuales estuvimos y nos parecieron buenos: en precio, comodidad y
            ubicación. Sólo les hemos pedido a estos establecimiento dar un buen
            trato a todos los viajeros de Rutas de los Andes. Si la información
            suministrada no concuerda, no dudes en informarnos para
            actualizarla.{' '}
          </p>

          <h3>Rutas Gps 📱</h3>

          <p>
            {' '}
            Al momento de descargar la traza gps y seguirla en tu celular,
            tienes que tener en cuenta que muchos de los celulares no fueron
            diseñados para seguir rutas gps por lo que puede tener un ángulo de
            desfase mayor a lo que tendría un GPS. La ruta en gps nos ayudará a
            conocer los kilómetros que tiene la ruta y su elevación. Si
            presentan algún inconveniente con la ruta gps puedes informarnos.{' '}
          </p>

          <h2 className={classes.tittle}>
            {' '}
            Uso de información de nuestra página
          </h2>
          <p>
            {' '}
            El uso comercial de nuestro contenido debe ser previamente
            consultado.
          </p>

          <h2 className={classes.tittle}> Contactanos </h2>
          <p>
            {' '}
            Tienes alguna propuesta o ruta para compartir con nosotros
            contactanos via:
          </p>
          <ul>
            <li>
              {' '}
              📪{' '}
              <a href="mailto:rutasdelosandes@gmail.com">
                correo electronico
              </a>{' '}
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default withStyles(style)(About);
