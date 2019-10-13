var admin = require("firebase-admin");


var serviceAccount = require("./rutasdelosandes-174002-firebase-adminsdk-dj251-2aec64faa5.json");
		
admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://rutasdelosandes-174002.firebaseio.com"
});

var defaultAuth = admin.auth();
var defaultDatabase = admin.database();

function write(path, data) {
	console.log(path,data, "this values will be written to the db");
  defaultDatabase.ref(path).set(data).then(function() {
    console.log('Synchronization succeeded to the path',path);
  })
  .catch(function(error) {
    console.log('Synchronization failed',e);
  });
}
function push(path,data) { 
 return defaultDatabase.ref(path).push().set(data)
}
function read(path){
	// Loop through users in order with the forEach() method. The callback
	// provided to forEach() will be called synchronously with a DataSnapshot
  // for each child:
	var query = defaultDatabase.ref(path).orderByKey();
	return query.once("value")
}
function remove(path){ 
  return defaultDatabase.ref(path).remove()
}
function update(path,data){
	console.log(path,data, "this values will be updated to the db");
	defaultDatabase.ref(path).update(data).then(function() {
    console.log('update succeeded to the path',path);
  })
  .catch(function(error) {
    console.log('update failed',e);
  });
}


module.exports = {defaultAuth, defaultDatabase, write, push, read, update, remove}
