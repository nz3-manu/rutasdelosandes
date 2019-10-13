const request = require('request');
let  PAGE_ACCESS_TOKEN = "EAAat3shVcGIBAP0laZC19H7IyU5l6qHn8oREyJ9iii27mTqeVuNTlLTHlr3QoNU3rveINvLyyXVpkDVNY4ga5egFvwxqokY95E3AtziQ4CZBWgjAfAWRqzdHZBgpyEjxrO0XERnkhgqwutsHVr1eZCfrU4QgmRCSaepIkyKHh1MkeyDxzTYh"
function callSendAPI(messageData) {
 //console.log("message structure tobe send",JSON.stringify(messageData.message))
 return new Promise((resolve,reject)=>{
	 request({
		 uri: 'https://graph.facebook.com/v2.6/me/messages',
		 qs: { access_token: PAGE_ACCESS_TOKEN },
		 method: 'POST',
		 json: messageData,
		 headers:{'content-type': 'application/json'}
	 },(error, response, body)=>{
		 if(error){
			 console.log("error",error)
		 }
		 else{
			 console.log("success",response.body.error)
			resolve(response)
		 }
	 })
 });  
}
function getUserProfileData(senderID) {
	console.log("actual access token", PAGE_ACCESS_TOKEN)
	return new Promise((resolve,reject)=>{
		request({
			uri: `https://graph.facebook.com/v2.6/${senderID}`,
			qs: { access_token: PAGE_ACCESS_TOKEN },
			headers:{'content-type': 'application/json'}
		},function(error,response,body){
			if(error){
				reject(error)
			}
			else{
				resolve(body)
			}
		});
	});  
}
function getDocs(url){
	return new Promise((resolve,reject)=>{
		request({
			uri:url,
			headers:{'content-type': 'application/json'}
		},function(error,response,body){
			if(error){
				reject(error);
			}
			else{
				resolve(body);
			}
		})
	})
}

module.exports = { getDocs , callSendAPI, getUserProfileData }
