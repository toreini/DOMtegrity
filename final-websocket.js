var fs = require('fs');
var https = require('https');
var express = require('express');
var crypto = require('crypto');
var bodyParser = require('body-parser');

var app = express();

var urlencodedParser = bodyParser.urlencoded({
    extended: false
});

var options = {
    key: fs.readFileSync('Certificates/server-key.pem'),
    cert: fs.readFileSync('Certificates/server-cert.pem'),
    ca: fs.readFileSync('Certificates/ca-cert.pem'),

    requestCert: true, // ask for a client cert
    rejectUnauthorized: false, // act on unauthorized clients at the app level
};


app.use(express.static('Client'));


var tlsSessionTokenStore = {};
var tlsSessionServerSideData = {};
var test = {};

var pageServer = https.createServer(options, app);

pageServer.listen(8080);

var WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({server: pageServer});


wss.on('connection', function(socket) {
    console.log(" connect request recieved at " + process.hrtime());
    var sessionID = socket.upgradeReq.socket.getSession().toString('hex');


    var p1 = new Promise(

        function(resolve, reject) {
            const pKey = crypto.randomBytes(32);
            const iv = crypto.randomBytes(16);

            tlsSessionTokenStore[sessionID] = {
                "private": pKey,
                "iv": iv
            };

            tlsSessionServerSideData[sessionID] = {
                time: new Date(),
                decide: false
            }

            resolve(JSON.stringify(tlsSessionTokenStore[sessionID]));
        });
    p1.then(
        function(val) {
            socket.send(val);
        }
    )
    .catch(
        function(reason) {
            console.log("The Promise is rejected becuase of " + reason);
        }
    );

    socket.on('message', function(signature) {

        const hmac = crypto.createHmac('sha256', tlsSessionTokenStore[sessionID].private);

        // This is the test PID... you might use other PIDs in your page.
        var pid = '222222222222222222222222222222222222222222222222222222222222211'+(fs.readFileSync("Client/index.html").toString()).replace(/["']+/g, '').replace(/[\n\r]+/g, '').replace(/\s{1,50}/g, '').trim();

        hmac.update(pid);
        
        var temp = hmac.digest();

        var reason = "";

        if (!tlsSessionServerSideData[sessionID].decide) {
            if (timeNow.getTime() < (tlsSessionServerSideData[sessionID].time.getTime() + 1200000)) {
                if (temp.toString("hex") == signature.toString("hex")) {
                    decision = "accept";
                } else {
                    decision = "reject";
                    reason = "The signature was inccorect!";
                }
            } else {
                decision = "reject";
                reason = "Request time bound from your browser is expired!";
            }
        } else {

            decision = "reject";
            reason = "There was another request from your browser!";
        }

        tlsSessionServerSideData[sessionID].decide = true;

        /* ---> If you want, you can encrypt the server decision and send it to the client (not necessary and adds no security to the current protocol)
        socket.emit("final", {
            "content": crypted,
            "reason": reason
        });
        */
        console.log(decision);
     
    });
});