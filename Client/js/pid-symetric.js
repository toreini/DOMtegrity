function _ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint8Array(buf));
}

function _arrayBufferToJwkBase64(buffer) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    var base64 = window.btoa(binary);
    var jwk_base64 = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/\=+$/, '');
    return jwk_base64;
}

function _str2ab(str) {
    var buf = new ArrayBuffer(str.length);
    var bufView = new Uint8Array(buf);
    for (var i = 0; i < str.length; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}

function _appendBuffer(buffer1, buffer2) {
  var tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
  tmp.set(new Uint8Array(buffer1), 0);
  tmp.set(new Uint8Array(buffer2), buffer1.byteLength);
  return tmp.buffer;
};

var pid = {
    records: [],
    socket: null,
    _privateKey: null,
    _iv: null,
    _nonce: null,

    init: function() {
        console.log("Ready!");
        console.log(this.socket);
        //this.socket = io.connect('https://10.66.66.185:8080/');
        this.socket = io.connect('https://localhost:8080/');
        console.log(this.socket);
        this.socket.on('connected', function(data) {
            console.log("Socket Connected!");
        });

        document.addEventListener("DOMContentLoaded", function() {

            var observer = new MutationObserver(function(mutations) {
                // For the sake of...observation...let's output the mutation to console to see how this all works
                console.log("Mutation Entered");
                mutations.forEach(function(mutation) {
                    console.log("Type 1 " + mutation.type);
                    pid.records.push(mutation.type);
                });
            });

            var observerConfig = {
                attributes: true,
                childList: true,
                characterData: true,
                subtree: true
            };

            // Node, config
            // In this case we'll listen to all changes to body and child nodes
            //var targetNode = document.body;
            //console.log("Before Target Added");
            var targetNode = document;
            observer.observe(targetNode, observerConfig);
        });
    },

    keyExchange: function() {
        console.log("keyExchange Entered!");
        console.log(this.socket);
        var currentInstance = this;

        this.socket.emit("keyExchangeRequest");

        this.socket.on("keyRecieved", function(data) {

            console.log(data);
            var keys = JSON.parse(data);
            currentInstance._privateKey = keys.jwkPrivate; //This is for JWK Format (Firefox)
            //currentInstance._privateKey = keys.private.data; //This is for RAW Format (Chrome)
            currentInstance._nonce = keys.nonce.data;
            currentInstance._iv = keys.iv.data;

            //var n = _arrayBufferToJwkBase64(private.n.data);
            //this.PrivateKey = private;
            //currentInstance.PrivateKey = "Hello";

            //currentInstance._privateKey = {
            //    "kty": private.kty,
            //    "k": private.k.data
            //};

            //this.PrivateKey = jwkPrivate;



            //var privateImported;


        });
    },

    generatePID: function() {
        //var listen = this.observer.takeRecords();
        console.log(this.records);



        var all = document.getElementsByTagName("*");
        var allScripts = document.getElementsByTagName("script");

        var countElements = all.length;
        var countScripts = allScripts.length;

        var countAttributePerElement = [];
        //var countEventsPerElement = [];
        var countChildElementsPerElement = [];

        for (var i = 0; i < countElements; i++) {
            countAttributePerElement[i] = all[i].attributes.length;
            countChildElementsPerElement[i] = all[i].childElementCount;
            //countEventsPerElement[i] =            
        }

        console.log("Elements " + countElements);
        console.log("count Attribute Per Element " + countAttributePerElement);
        console.log("count Child Elements Per Element " + countChildElementsPerElement);
        console.log("countScripts " + countScripts);
    },

    generateSignature: function() {

        //var jwkPrivate = new ArrayBuffer(this._privateKey.data);
        var jwkPrivate2 = this._privateKey;
        var jwkPrivate = jwkPrivate2; //************This is just for Firefox I need to work on it
        var private = null;
        //console.log(jwkPrivate2);
        //******************This is for Chrome

        //var jwkPrivate = new ArrayBuffer(jwkPrivate2.length);
        //var bufView = new Uint8Array(jwkPrivate);

        //for (var i = 0; i < jwkPrivate2.length; i++) {
        //    bufView[i] = jwkPrivate2[i];
        //}
        //*******************UNTIL HERE!

        console.log(jwkPrivate);
        
        var myIV2 = this._iv;
        var myIV = new ArrayBuffer(myIV2.length);
        var bufView = new Uint8Array(myIV);

        for (var i = 0; i < myIV2.length; i++) {
            bufView[i] = myIV2[i];
        }
        //console.log(myIV);
        var nonce2 = this._nonce;
        var nonce = new ArrayBuffer(nonce2.length);
        var bufView = new Uint8Array(nonce);

        for (var i = 0; i < nonce2.length; i++) {
            bufView[i] = nonce2[i];
        }

        //console.log(nonce);
        //console.log(_str2ab("Hello World!"));
        //***** This is for Encryption --> 
        //,

        //Don't re-use initialization vectors!
        //Always generate a new iv every time your encrypt!
        //Recommended to use 12 bytes length
        //iv: myIV,

        //Additional authentication data (optional)
        //additionalData: nonce,

        //Tag length (optional)
        //tagLength: 128, //can be 32, 64, 96, 104, 112, 120 or 128 (default)

        //***** End of Encryption Peice

        var currentSocket = this.socket;

        window.crypto.subtle.importKey(
                "jwk", //can be "jwk" (public or private), "spki" (public only), or "pkcs8" (private only)
                jwkPrivate, { //these are the algorithm options
                    name: "AES-CBC",
                },
                false, //whether the key is extractable (i.e. can be used in exportKey)
                ["encrypt", "decrypt"] //"verify" for public key import, "sign" for private key imports
            )
            .then(function(privateKey) {
                console.log(privateKey);
                //returns a publicKey (or privateKey if you are importing a private key)
                //privateImported = privateKey;
                private = privateKey;
                console.log(nonce);                
                window.crypto.subtle.encrypt({
                            name: "AES-CBC",
                            iv: myIV,
                            //additionalData: nonce,

                            //Tag length (optional)
                            //tagLength: 128, //can be 32, 64, 96, 104, 112, 120 or 128 (default)
                        },
                        privateKey, //from generateKey or importKey above
                        _str2ab("Hello World!")
                    )
                    .then(function(cipher) {
                        console.log(cipher);
                        currentSocket.emit('signatureVerification', {
                            my: cipher
                        });
                    })
                    .catch(function(err) {
                        console.error(err);
                    });
            })
            .catch(function(err) {
                console.error(err);
            });

        currentSocket.on('decryption', function(data) {
            console.log(data);
            //var keys = JSON.parse(data);

            var cipher2 = data.content;

            var bufView = new Uint8Array(cipher2);

            console.log(bufView);

            //var tag2 = data.tag;
            //var bufView = new Uint8Array(tag2);

            //console.log(bufView);

            //var bufView = new Uint8Array(myIV);

            //console.log(bufView);

            //var all = _appendBuffer(cipher2,tag2);
            //var myIV_r = myIV;
            //var jwkPrivate = this._privateKey;

            console.log(private);
            //returns a publicKey (or privateKey if you are importing a private key)
            //privateImported = privateKey;
            //console.log(tag2);
            console.log(myIV);
            console.log(cipher2);
            console.log(nonce);
            //console.log(all);

            window.crypto.subtle.decrypt({
                        name: "AES-CBC",
                        iv: myIV,                        
                        //additionalData: data.tag,

                        //Tag length (optional)
                        //tagLength: 128 //can be 32, 64, 96, 104, 112, 120 or 128 (default)
                    },
                    private, //from generateKey or importKey above
                    data.content
                    //all
                )
                .then(function(text) {
                    console.log(_ab2str(text));
                })
                .catch(function(err) {
                    console.error(err);
                });
        });

    }
};

pid.init();
document.foo = "test";
pid.keyExchange();
// Notify me of everything!


function clickMe(e) {
    t();
    console.log("click from Web");
    e.stopImmediatePropagation();

    pid.generateSignature();

    //loadScript("js/canvas.js", pid.keyExchange);
}

function clickMe1() {

    alert("ClickMe1");
}