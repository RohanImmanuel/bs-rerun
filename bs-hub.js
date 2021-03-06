const request = require('sync-request');

var HUB = "http://hub-cloud.browserstack.com/wd/hub";
var session;

// Base  quest function
function sendRequest(method, url, body) {
  return request(method, url, {
    json: body,
    headers : {
      "user-agent": "rohanimmanuel/bs-rerun",
      "Authorization" : "Basic " + new Buffer.from(process.env.BROWSERSTACK_USERNAME + ":" + process.env.BROWSERSTACK_ACCESS_KEY).toString("base64")
    }
  });
}

// Start Session
function startSession(capabilities) {
  console.log("STARTING SESSION");
  var res = sendRequest("POST", HUB + "/session", {
    desiredCapabilities: capabilities
  });
  
  var body = JSON.parse(res.getBody('utf8'))
  
  session = body.sessionId;
  console.log("SESSION STARTED AT: " + getSessionLink() + "");
  return res;
}

// Stop Session
function stopSession() {
  var res = sessionCommand("DELETE", "", {});
  
  session = null;
  console.log("SESSION STOPED");
  return res;
}

// Session Command
function sessionCommand(method, endpoint, body) {
  if(method != "DELETE" && endpoint != "") console.log(method + "\t" + endpoint);
  return sendRequest(method, HUB + "/session/" + session + endpoint, body);
}

// Get Session Link
function getSessionLink() {
  return "https://automate.browserstack.com/dashboard/v2/sessions/" + session;
}

// Module exports
module.exports.sendRequest = sendRequest;
module.exports.startSession = startSession;
module.exports.stopSession = stopSession;
module.exports.sessionCommand = sessionCommand;
module.exports.getSessionLink = getSessionLink;
