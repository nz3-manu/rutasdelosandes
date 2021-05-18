import React from "react";

export default ({ staticContext = {} }) => {
  staticContext.status = 404;
  return <h1>Oops, pagina no encontrada</h1>;
};
