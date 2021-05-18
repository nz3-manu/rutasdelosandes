import React from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import classNames from "classnames";
import Button from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";
import { Link } from "react-router-dom";

const styles = {
  container: {
    flexGrow: 1,
  },
  order: {
    margin: "10px 8px",
    fontSize: "14px",
    padding: "3px",
    backgroundColor: "#8a8a8a4d",
    color: "#000000",
    fontWeight: "400",
  },
  wrapPage__gracias: {
    margin: "auto",
    maxWidth: "500px",
    padding: "5px",
    fontSize: "15px",
  },
  gracias_tittle: {
    color: "#000000",
    textAlign: "center",
    fontFamily: "Helvetica",
    fontSize: "28px",
    fontWeight: "500",
  },
  shippingData: {
    color: "#0c0c0c",
    backgroundColor: "#ffffff;",
    borderColor: "#ffffff",
    padding: "7px 9px",
    border: "2px solid transparent",
    borderRadius: "4px",
    fontSize: "17px",
    fontFamily: "Helvetica",
    fontWeight: "300",
    fontSize: "12px",
    lineHeight: "normal",
    textAlign: "center",
  },
  shippingData__tittle: {
    textAlign: "center",
    fontWeight: "600",
    fontSize: "17px",
    padding: "0px",
    margin: "0",
  },
  shippingData__text: {
    fontSize: "15px",
    textTransform: "capitalize",
  },
  shippingData__text_bold: {
    fontWeight: "600",
    padding: "0px",
    display: "contents",
  },
  imgCustomized: {
    width: "100%",
    height: "auto",
    padding: "6px",
    textAlign: "center",
    padding: "5px",
    borderTop: "1px dashed black",
  },
  imgCustomized__tittle: {
    textAlign: "initial",
    fontFamily: "monospace",
    textAlign: "center",
    fontWeight: "500",
    color: "black",
    fontSize: "14px",
  },
  imgCustomized__wrapButton: {
    display: "block",
    marginBottom: "10px",
    textAlign: "center",
  },
  linkForm: {
    textAlign: "center",
  },
};

let Whatsapp = () => (
  <div
    style={{
      display: "inline",
      fontWeight: "500",
      color: "black",
      fontWeight: "bold",
    }}
  >
    <a href="https://api.whatsapp.com/send?phone=573113403572&text=Hola%20Ruteros%20acabo%20de%20comprar%20un%20producto">
      whatsapp
    </a>
  </div>
);

class Confirmation extends React.Component {
  constructor(props) {
    super(props);
    if (typeof window != "undefined" && window.document) {
      if (this.props.location.query.polTransactionState == "4") {
        console.log(this.props.order);
        fbq("track", "Purchase", {
          value: this.props.order.meta.display_price.with_tax.amount,
          currency: "COP",
        });
      } else {
        fbq("track", "Lead", {
          value: this.props.order.meta.display_price.with_tax.amount,
          currency: "COP",
        });
      }
    }
  }
  countGap(nameCustomer) {
    let nombreCompleto = "";
    if (nameCustomer.split(" ").length > 2) {
      let primerNombre = nameCustomer.split(" ")[0];
      let segundoNombre = nameCustomer.split(" ")[1];
      nombreCompleto = String(primerNombre) + " " + String(segundoNombre);
    } else {
      nombreCompleto = nameCustomer;
    }
    var uri = nombreCompleto;
    var res = encodeURI(uri);
    return res;
  }
  /*Capitalized text*/
  capitalize_Words(str) {
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

  render() {
    let { shipping_address, id, meta, customer } = this.props.order;
    let {
      lapPaymentMethodType,
      polTransactionState,
    } = this.props.location.query;
    let { classes } = this.props;
    if (polTransactionState == "4") {
      return (
        <div className={classes.wrapPage__gracias}>
          <h1 className={classes.gracias_tittle}>
            {" "}
            ¡Gracias Por Tu Compra <br></br>{" "}
            {this.capitalize_Words(shipping_address.first_name)}!{" "}
          </h1>

          <div className={classes.shippingData}>
            {/*<p className={classes.shippingData__tittle}> Los datos para el envío son los siguientes:</p> 
                            <p className={classes.shippingData__text}> <span className={classes.shippingData__text_bold}> Dirección de envío: </span>  {shipping_address.line_1}, {shipping_address.instructions}, {shipping_address.city}, {shipping_address.county} en  {shipping_address.country}</p>  
                            <p className={classes.shippingData__text}> <span className={classes.shippingData__text_bold}> Numero de contacto: </span> {shipping_address.phone_number}  </p> 
                             <br></br> */}
            <Paper className={classes.order} elevation={4}>
              Hemos envíado el recibo de compra al correo:{" "}
              <span className={classes.shippingData__text_bold}>
                {" "}
                {customer.email}{" "}
              </span>{" "}
              <br></br>
              Si tienes alguna pregunta puedes escribenos a nuestro <Whatsapp />
            </Paper>
          </div>
          <div className={classes.imgCustomized}>
            {/* <p className={classes.imgCustomized__tittle}> Recuerda siempre cuidar de la naturaleza ⛰ y disfrutar de la tranquilidad que esta nos brinda 🍃. Etiquetanos en las redes sociales usando #rutasdelosandes  </p> */}
            <img
              src={`/image/${this.countGap(
                shipping_address.first_name
              )}/thanks.jpg`}
            />
          </div>
          <div className={classes.imgCustomized__wrapButton}>
            <Button variant="contained" size="small" className={classes.button}>
              <SaveIcon
                className={classNames(classes.leftIcon, classes.iconSmall)}
              />
              <a
                download={"rutero.jpg"}
                href={`/image/${this.countGap(
                  shipping_address.first_name
                )}/thanks.jpg`}
                target="_blank"
              >
                {" "}
                Descargar Imagen{" "}
              </a>
            </Button>
          </div>
          <p className={classes.linkForm}>
            {" "}
            Etiquetanos en las redes sociales usando{" "}
            <span className={classes.shippingData__text_bold}>
              {" "}
              #rutasdelosandes{" "}
            </span>{" "}
            y participa en el concurso para acompañarnos en una de nuestras
            próximas rutas. Ver terminos y condiciones{" "}
            <span className={classes.shippingData__text_bold}>
              {" "}
              <a
                target="_blank"
                href="https://rutasdelosandes.com/politicas-video.html"
              >
                aquí
              </a>
            </span>
            .
          </p>
          {/*<p className={classes.linkForm}>¿Quieres acompañarnos en una de nuestras rutas y ser parte del vídeo 🎥⛰? click <a href="https://rutasdelosandes.com/politicas-video.html" target='_blank' style={{ fontWeight:"bold"}}> aquí</a></p>*/}
        </div>
      );
    } else if (polTransactionState == "6") {
      return (
        <div className={classes.wrapPage__gracias}>
          <h1 className={classes.gracias_tittle}>
            {" "}
            Los sentimos {shipping_address.first_name}
          </h1>{" "}
          <br></br>
          <h2>
            Tu transacción fue declinada, si tienes alguna pregunta puedes
            escribirnos a nuestro <Whatsapp /> y con gusto te atenderemos.{" "}
          </h2>
        </div>
      );
    } else if (polTransactionState == "104") {
      return (
        <div className={classes.wrapPage__gracias}>
          <h1 className={classes.gracias_tittle}>
            {" "}
            Los sentimos {shipping_address.first_name}, hubo un error{" "}
          </h1>
          <h2>
            ¿Tienes alguna pregunta? escribenos a nuestro <Whatsapp /> y con
            gusto te atenderemos.
          </h2>
        </div>
      );
    } else {
      return (
        <div className={classes.wrapPage__gracias}>
          <h1 className={classes.gracias_tittle}>
            {" "}
            Los sentimos {shipping_address.first_name}, <br></br> no sabemos que
            salió mal 😟{" "}
          </h1>
          <h2>
            Contactanos para mayor información <Whatsapp /> .
          </h2>
        </div>
      );
    }
  }
}

const mapStateToProps = (state) => ({
  order: state.order,
});

export default connect(mapStateToProps)(withStyles(styles)(Confirmation));
