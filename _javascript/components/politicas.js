import React from 'react';
import { withStyles } from '@material-ui/core/styles';

let Whatsapp = () => (<div> 📲 <a href="https://api.whatsapp.com/send?phone=573113403572&text=Me%20gustaría%20saber%20donde%20esta%20mi%20producto">whatsapp</a></div>)

const style = {
    container:{
        margin: 'auto',
        padding:'30px 10px',
    },
    tittle:{
        textAlign: 'center'
    },
    bold:{
        fontWeight: 'bold'
    }

}

class Politicas extends React.Component { 
    render() { 
        const { classes } = this.props;
        return (<div>
            <img src="/images/acerca/featured.jpg" />
            <div className={classes.container}>
                <h2 className={classes.tittle} id="politicasPrivacidad"> POLÍTICA DE PRIVACIDAD</h2>
               <p> 
               El presente Política de Privacidad establece los términos en que Rutas de los Andes usa y protege la información que es proporcionada por sus usuarios al momento de utilizar su sitio web. Rutas de los Andes está comprometida con la seguridad de los datos de sus usuarios. Cuando le pedimos llenar los campos de información personal con la cual usted pueda ser identificado, lo hacemos asegurando que sólo se empleará de acuerdo con los términos de este documento. Sin embargo esta Política de Privacidad puede cambiar con el tiempo o ser actualizada por lo que le recomendamos y enfatizamos revisar continuamente esta página para asegurarse que está de acuerdo con dichos cambios.
               </p> 

               <h3>Información que es recogida</h3>
                 <p> Nuestro sitio web podrá recoger información personal por ejemplo: Nombre,  información de contacto como  su dirección de correo electrónica e información demográfica. Así mismo cuando sea necesario podrá ser requerida información específica para procesar algún pedido o realizar una entrega o facturación. </p> 
                
                 <h3>Uso de la información recogida</h3>
                 <p>Nuestro sitio web emplea la información con el fin de proporcionar el mejor servicio posible, particularmente para mantener un registro de usuarios, de pedidos en caso que aplique, y mejorar nuestros productos y servicios.  Es posible que sean enviados correos electrónicos periódicamente a través de nuestro sitio con ofertas especiales, nuevos productos y otra información publicitaria que consideremos relevante para usted o que pueda brindarles algún beneficio, estos correos electrónicos serán enviados a la dirección que usted proporcione y podrán ser cancelados en cualquier momento.</p>
                <p>Rutas de los Andes está altamente comprometido para cumplir con el compromiso de mantener su información segura. Usamos los sistemas más avanzados y los actualizamos constantemente para asegurarnos que no exista ningún acceso no autorizado.</p>

                 <h3>Cookies</h3>
                 <p>Una cookie se refiere a un fichero que es enviado con la finalidad de solicitar permiso para almacenarse en su ordenador, al aceptar dicho fichero se crea y la cookie sirve entonces para tener información respecto al tráfico web, y también facilita las futuras visitas a una web recurrente. Otra función que tienen las cookies es que con ellas las web pueden reconocerte individualmente y por tanto brindarte el mejor servicio personalizado de su web.</p>
                 <p>Nuestro sitio web emplea las cookies para poder identificar las páginas que son visitadas, su frecuencia y pixel. Esta información es empleada únicamente para análisis estadístico y después la información se elimina de forma permanente. Usted puede eliminar las cookies en cualquier momento desde su ordenador. Sin embargo las cookies ayudan a proporcionar un mejor servicio de los sitios web, estas no dan acceso a información de su ordenador ni de usted, a menos de que usted así lo quiera y la proporcione directamente. Usted puede aceptar o negar el uso de cookies, sin embargo la mayoría de navegadores aceptan cookies automáticamente pues sirve para tener un mejor servicio web. También usted puede cambiar la configuración de su ordenador para declinar las cookies. Si se declinan es posible que no pueda utilizar algunos de nuestros servicios.</p>

                 <h3>Enlaces a Terceros</h3>
                 <p>Este sitio web pudiera contener enlaces a otros sitios que pudieran ser de su interés. Una vez que usted dé clic en estos enlaces y abandone nuestra página, ya no tenemos control sobre al sitio al que es redirigido y por lo tanto no somos responsables de los términos o privacidad ni de la protección de sus datos en esos otros sitios terceros. Dichos sitios están sujetos a sus propias políticas de privacidad por lo cual es recomendable que los consulte para confirmar que usted está de acuerdo con estas.</p>
                
                <h3>Control de su información personal</h3>
                <p>En cualquier momento usted puede restringir la recopilación o el uso de la información personal que es proporcionada a nuestro sitio web.  Cada vez que se le solicite rellenar un formulario, como el de alta de usuario, puede marcar o desmarcar la opción de recibir información por correo electrónico.  En caso de que haya marcado la opción de recibir nuestro boletín o publicidad usted puede cancelarla en cualquier momento.</p>
                <p>Rutas de los Andes no venderá, cederá ni distribuirá la información personal que es recopilada sin su consentimiento, salvo que sea requerido por un juez con un orden judicial.</p>
                <p>Rutas de los Andes Se reserva el derecho de cambiar los términos de la presente Política de Privacidad en cualquier momento.</p>

                <h2 className={classes.tittle} id="politicasEnvio"> ENVÍOS </h2>

                <h3>Formas de envío y plazos de entrega</h3>
                <p> rutasdelosandes.com sólo entregará pedidos en Colombia. El plazo de entrega es de 5 a 8 días hábiles a partir de la fecha de recepción del pedido. </p>
               <p> Los pedidos serán entregados por el servicio de envíos  que el cliente escoja que serán: Servientrega(recomendado) o por el servicio de envíos de 472, el valor de éste será pagado por la persona. </p>
               <p> En el caso de no haber un responsable para la recepción del paquete en la dirección indicada de entrega, el servicio de envíos deberá llamar para confirmar a qué hora pueden entregarle la mercancía, de no poder comunicarse, el servicio de envíos guardará su paquete en sus almacenes aproximadamente 5 días antes de proceder a la devolución a nuestras instalaciones.  </p>
               <p> Si no recibe su compra en el tiempo estimado deberá ponerse en contacto a nuestro whatsapp 3113403572. Desde el momento en el que tengamos su notificación realizaremos las gestiones oportunas para averiguar por qué no lo ha recibido en el tiempo acordado. </p>

                <h3>Devoluciones por parte de la agencia de envios</h3>

                <p>Si el paquete es regresado a nosotros por la agencia de envios manifestando que los datos suministrados no eran correctos, faltaba información o no se encontraba la persona al momento de realizar la entrega. </p>
                <p>
                Si esto llegara a pasar y el producto es regresado de nuevo a nuestras instalaciones, la persona podrá solicitar la devolución del dinero si así lo desea o realizar un nuevo envió con la información correcta, los gastos de envío correrán por cuenta del cliente.
                </p>

                <h2 className={classes.tittle} id="politicasDevolucion">DEVOLUCIONES</h2>       
                <p>
                    Si en el pedido recibido encuentra algún producto defectuoso debe ponerse en contacto al 3113403572 o rutasdelosandes@gmail.com. <br></br> <br></br>
                    Podrá devolvernos la mercancía siempre que comunique su intención en el plazo de una semana después de recibido el pedido y siempre que mantenga en optimo estado su empaque y el producto no debe contar con uso previo, deberás enviarnos las fotos del producto  a través de rutasdelosandes@gmail.com o llamarnos al 3113403572. <br></br> <br></br>
                    Siempre que la devolución responda a defectos del producto, rutas de los andes asume los gastos de envío ocasionados por la devolución. Usted podrá reponerlo ó sustituirlo por otro artículo de los mismos. <br></br> <br></br>
                    Si las razones de devolución son ajenas a rutas de los andes, es decir, si la mercancía se encuentra en perfecto estado pero a pesar de ello quiere devolverla, deberá mandar el producto en su embalaje original y en perfecto estado. Los gastos ocasionados de la devolución, NO serán sufragados por rutas de los andes.
                </p>  

                <h2 className={classes.tittle} id="usoComercialContenido"> USO COMERCIAL DE NUESTRO CONTENIDO </h2>   

                <p>
                  El uso comercial de nuestro contenido como: videos, información de rutas, blogs debe ser previamente consultado con nosotros, de no hacerlos incurrirán en la infracción en la ley No. 23 de 1982 (Legislación de propiedad intelectual en Colombia).
                </p>             

             </div>   
            </div>)
    }
}

export default withStyles(style)(Politicas)