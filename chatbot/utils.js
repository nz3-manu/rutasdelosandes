//////////////////////////
// Sending helpers
//////////////////////////
function buildTextMessage(recipientId, messageText, quickReplies=[]) {
  let messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText
    }
  };
  messageData.message.quick_replies = quickReplies.length ? quickReplies : undefined;
  return messageData;
}

//////////////////////////
// Data transformation helpers
//////////////////////////

function flatten(property,documents) { 
    return documents.reduce(function (flattenValues, document) {
          if (flattenValues.indexOf(document[property]) == -1) {
            flattenValues.push(document[property])
          }
          return flattenValues; 
          }, [])
}

function buildElement(document) {
    let baseUrl = "https://rutasdelosandes.com"
    return {
            title: document.title,
            subtitle: document.excerpt,
            item_url: `${baseUrl}${document.url}`,               
            image_url: `${baseUrl}${document.image}`,
            buttons: [{
              type: "web_url",
              url: `${baseUrl}${document.url}`,
              title: "entrar a la ruta"
            },
            {
              "type":"element_share"
            }],
    }
}

function buildButton(type,payload) { 
        return (title)=>({
          "type": type,
          "title": title,
          "payload": payload
        })
}

function buildButtonMessage(recipientId,message,arrayButtons) { 
  return {
    "recipient": {
      "id": recipientId
    },
    "message": {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "button",
          "text": message,
          "buttons":arrayButtons
        }
      }
    }
  };
}

function buildGenericMessage(recipientId,elements) {
  return {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: elements
        }
      }
    }
  };  
}

module.exports = { buildTextMessage, buildButtonMessage, flatten, buildButton, buildElement, buildGenericMessage }
