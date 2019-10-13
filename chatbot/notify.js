const   { read, update } = require('./db');
const { callSendAPI, getUserProfileData } = require('./facebook');
const { buildTextMessage } = require('./utils.js');
//Push notifications actions
function getFacebookIDs() {
	return new Promise((resolve,reject) => {
		read('users').then(function (snapshot) {
			let subscriptionsRows = []
			snapshot.forEach(function (childSnapshot) {
				subscriptionsRows.push(childSnapshot.key)
			})
			resolve(subscriptionsRows)
		})	
		.catch(reject)
	 })
}

function notify(req, res) {
	if(req.body.secret == "luna"){
		getFacebookIDs().then(function (users) {
			let promiseChain = Promise.resolve();
				// key will be "ada" the first time and "alan" the second time
				// debug ids let userKeys = ['2154914804525544', '1740317949371485', '1387692454613592']
				users.map((key) => { 
					promiseChain = promiseChain.then(() => {
						return callSendAPI({
							"messaging_type": "NON_PROMOTIONAL_SUBSCRIPTION",
							"recipient": {
								"id": key
							},
							"message": {
								"attachment": {
									"type": "template",
									"payload": {
										"template_type": "generic",
										"sharable": true,
										"elements": [
											{
												"title": req.body.title,
												"subtitle": req.body.subtitle,
												"image_url": req.body.image,
												"default_action": {
													"type": "web_url",
													"url": req.body.url
												},
												"buttons": [
													{
														"type": "web_url",
														"url": req.body.url,
														"title": "entrar"
													}, {
														"type": "element_share"
													}
												]
											}
										]
									}
								}
							}
						});
					  });
				})
		});
}
	res.sendStatus(200)
}
module.exports = { notify }
