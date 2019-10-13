const request = require('request');
const { flatten,
        buildButtonMessage,
        buildButton,
        buildTextMessage,
        buildElement,
        buildGenericMessage } = require('./utils.js');
const  { getDocs ,callSendAPI, getUserProfileData } = require('./facebook')
const  { write,update } = require('./db')
var     users = {}, docsData ={}, documents=[];
var chatbotOptionsAndQuestions = [
										{field: "region", question: "a donde quieres ir para tu proxima aventura 📍🗺" },
									  {field: "dificultad",question:"que nivel de dificultad piensas que tu y tu grupo pueden asumir en la caminata 👪 - 🚶🏽🎒"},
										{field: "duracion", question: "que tipo de aventura estas buscando  ⛺️ - 🚴🏻  " }]
var payloads = chatbotOptionsAndQuestions.map((t)=>t.field)

let quickReplies =[
      {
        "content_type":"text",
        "title":"Suscribirme",
        "payload": "subscribirse",
        "image_url":"https://cdn.pixabay.com/photo/2015/12/16/17/41/bell-1096280_1280.png"
      }
  ]
function webhookResponse(req, res) {
  var data = req.body;
  // Make sure this is a page subscription
  if (data.object === 'page') {
    // Iterate over each entry - there may be multiple if batched
    data.entry.forEach(function(entry) {
      var pageID = entry.id;
      var timeOfEvent = entry.time;
      // Iterate over each messaging event
      entry.messaging.forEach(function (event) {
				var senderID = event.sender.id;
			console.log("estado de la variable users",users)	
			if (!users[senderID]) {
				
				Promise.all([getDocs("https://rutasdelosandes.com/documents.json"),getUserProfileData(senderID)])
				.then((res)=>{
					return{docs:JSON.parse(res[0]),user:JSON.parse(res[1])}
				})
				.then(({ docs, user }) => {
					update(`/users/${senderID}`, user)
					console.log("senderID", senderID)	
					console.log("informacion de usario desde facebook",user)
					users[senderID] = {
						first_name:user.first_name,
						last_name: user.last_name,
						gender: user.gender,
						state:{
							lastState:""
						}
					} 
				documents = docs.docs
				chatbotOptionsAndQuestions.forEach(({field,question})=>{
					docsData[field]={
						question: question,
						buttons: flatten(field, documents).map(buildButton("postback",field))
					}
				})
				processMessage(event)
			})
			.catch((e)=>{
				console.log("something went wrong",e)
			})
		}
		else{
			processMessage(event)
		}
      });
    });
	res.sendStatus(200);
  }
}
function processMessage(event) {
	var recipientID = event.recipient.id;
	var timeOfMessage = event.timestamp;
	var message = event.message;
	var senderID = event.sender.id;
	console.log("last state", users[senderID].state.lastState)
	if (event.message) {
		receivedMessage(senderID,recipientID,message);
	} else if (event.postback) {
		receivedPostback(senderID,recipientID,event.postback);   
	} else {
		console.log("Webhook received unknown event: ", event);
	}
}
// Incoming events handling
// message function handler
function receivedMessage(senderID,recipientID,message) {
  var messageId = message.mid;
  var messageText = message.text;
  var messageAttachments = message.attachments;
  var quickReply = message.quick_reply
  if (quickReply) { 
    receivedPostback(senderID, recipientID,quickReply)
  }
  else if (messageText) {  
	  let lastState = users[senderID].state.lastState,
		  indexCurrent = payloads.indexOf(lastState)
		  console.log(lastState,indexCurrent,payloads,"debugging")
		  if (lastState == "start" || indexCurrent != -1){ 
			  callSendAPI(buildTextMessage(
						  senderID,
						  `${users[senderID].first_name} aun no tenemos rutas ${payloads[++indexCurrent]} ${messageText} puedes suscribirte y te enviaremos lindas rutas cercanas`,
						  quickReplies))
				  .catch(e => console.log(e))
		  }
		  else if(users[senderID].state.lastState != "contact"){
			  callSendAPI(buildTextMessage(
						  senderID,
						  `no te entendi 😕 ${users[senderID].first_name} click en alguna de las opciones de abajo o si quieres comunicarte con nosotros deja tus mensajes`,
						  quickReplies)).catch(e=>console.log(e))
				  users[senderID].state = {lastState : "contact"}
		  }
		  else if(users[senderID].state.lastState == "contact"){
			  callSendAPI(buildTextMessage(senderID,`${users[senderID].first_name} gracias por tu mensaje nos estaremos comunicando pronto,toca alguna de las opciones para ver que podemos hacer por ti`, quickReplies))
		  }
  } 
  else if (messageAttachments) {
      messageAttachments.forEach(function(attachment){
        if(attachment.type == "location"){
          let coordinates =  attachment.payload.coordinates,
              mapurl      =  attachment.url;
	      callSendAPI(buildTextMessage(senderID, "hemos guardado tu localizacion y te estaremos enviando rutas cercanas, que quieres hace ahora?", quickReplies));
	      update(`/users/${senderID}`,{coordinates, mapurl})
        }
        else{
          callSendAPI(buildTextMessage(senderID, "Gracias por compartir con nosotros tus fotos o videos los tendremos en cuenta, click en alguna de las opciones para ver que podemos hacer por ti", quickReplies));
        }
      })
    
  }
}
// postback function handler
function receivedPostback(senderID, recipientID, postback) {
	var payload = postback.payload
	users[senderID].state.lastState = payload;
	if (payload == 'GET_STARTED_PAYLOAD') { 
	  callSendAPI(buildTextMessage(
			senderID,
					`hola ${users[senderID].first_name} soy el guia turistico	🤖 virtual, te hare una serie de preguntas las cuales puedes contestar dando click en las opciones que apareceran justo debajo 👇  de los mensajes, al final te mostrare las rutas perfectas para ti. no encontraste tu ruta? suscribete, te enviaremos rutas cercanas📍.`,
          quickReplies)); 
  }
  else if (payload == 'subscribirse'){ 
	callSendAPI(buildTextMessage(
    senderID, 
    "indica tu localizacion asi podremos enviarte rutas cercanas",
    [{"content_type":"location","payload":"location"}])); 
	}
	else if (payload == "borrarsuscripcion") { 
		callSendAPI(buildTextMessage(senderID, "🙁 nos entristece que ya no te vamos a notificar cuando bellas rutas sean publicadas"));
		callSendAPI(buildTextMessage(senderID, "fuiste eliminado con exito, que quieres hacer ahora?",quickReplies));}
  else if (payload == 'location'){
		callSendAPI(buildTextMessage(
				senderID, "hemos guardado tu localizacion y te estaremos enviando rutas cercanas, que quieres hace ahora?", quickReplies));
		}
  else if(payload == 'start'){
	  // start asking from the first payload value
	const response = docsData[payloads[0]]
    callSendAPI(buildButtonMessage(senderID,response.question,response.buttons));
  }
  else {
	const title = postback.title
	//save user preferences
	var actualUserState = users[senderID].state
	actualUserState[payload] = title;
	console.log(actualUserState,"prefered user options")
	console.log(payloads)
	var actualAnswerIndex= payloads.indexOf(payload);
	// payload is a field of the objects and was sent we need to reply with the next
	const response = docsData[payloads[++actualAnswerIndex]]
		// do we need to continue asking to the user?
		if(response){
			callSendAPI(buildButtonMessage(senderID,response.question,response.buttons));
		}
		//it seems like the user answered all the questions it's time to give a result
		else{
			callSendAPI(buildTextMessage(senderID,"hemos encontrado estas rutas para ti 👇🏽")); 
			//filter out what the user didn't choose
			const trails = documents.filter((doc)=>doc.region == actualUserState.region).map(buildElement)
			callSendAPI(buildGenericMessage(senderID, trails)).then(function (response) {
			// clean user state
			users[senderID].state= {}
			callSendAPI(buildTextMessage(senderID, 
								"puedes dar click en cada una de las opciones ☝🏼 para entrar a la ruta o compartir la ruta con alguien que quieras ir, no te gustaron estas rutas? suscribete, te enviaremos rutas cercanas 🔔📍  ", quickReplies)); 
				}); 
		}
  }
}
module.exports = { webhookResponse }
