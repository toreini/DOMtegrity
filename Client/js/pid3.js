function loadScript(url, callback) {
    // Adding the script tag to the head as suggested before
    var script = document.createElement('script');
    script.type = 'text/javascript';

    // Then bind the event to the callback function.
    // There are several events for cross browser compatibility.
    if (script.readyState) { //IE
        script.onreadystatechange = function() {
            if (script.readyState == "loaded" ||
                script.readyState == "complete") {
                script.onreadystatechange = null;
                callback();
            }
        };
    } else { //Others
        script.onload = function() {
            callback();
        };
    }

    script.src = url;
    // Fire the loading
    document.body.appendChild(script);
}


var pid = {
    records: [],
    //socket: null,

    init: function() {
        console.log("Ready!");


        document.addEventListener("DOMContentLoaded", function() {
            /*var socket = io.connect('https://localhost:8080');
            socket.on('news', function(data) {
                console.log(data);
                socket.emit('my other event', {
                    my: 'data'
                });
            });*/

            var observer = new MutationObserver(function(mutations) {
                // For the sake of...observation...let's output the mutation to console to see how this all works
                console.log("Mutation Entered");
                mutations.forEach(function(mutation) {
                    console.log("Type 1 " + mutation.type);
                    //console.log(this);
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
            //console.log("After Target Added");
            observer.observe(targetNode, observerConfig);
            //console.log("Observer Observ Added!");
        });

    },
    keyExchange: function() {

        //


        var xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function() {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                console.log("success!");

                var keys = JSON.parse(xhttp.responseText);
                var private = keys.private;
                var public = keys.public;
                const nonce = keys.nonce;

                console.log(private);

                //console.log(btoa(private.n));
                //used to be binaryToBase64URL instead of btoa

                var n = _arrayBufferToJwkBase64(private.n.data);

                var jwkPrivate = {
                    "kty": private.kty,
                    "n": _arrayBufferToJwkBase64(private.n.data),
                    "e": _arrayBufferToJwkBase64([1, 0, 1]),
                    "d": _arrayBufferToJwkBase64(private.d.data),
                    "p": _arrayBufferToJwkBase64(private.p.data),
                    "q": _arrayBufferToJwkBase64(private.q.data),
                    "dp": _arrayBufferToJwkBase64(private.dmp1.data),
                    "dq": _arrayBufferToJwkBase64(private.dmq1.data),
                    "qi": _arrayBufferToJwkBase64(private.coeff.data)
                }

                console.log(jwkPrivate.n.length);


                //console.log("Private : " + private);
                //console.log("Public : " + public);
                //console.log("Nonce : " + nonce);
                //const publicImported = null;

                //var testKey = new Uint8Array(xhttp.response);
                //var testKey = xhttp.response;
                //console.log(testKey);
                //const stripped = private.split("\n").slice(1, -2).join("");
                //const binaryKey = base64ToBinary(stripped);

                function base64ToBinary(base64) {
                    var binary_string = window.atob(base64);
                    var len = binary_string.length;
                    var bytes = new Uint8Array(len);
                    for (var i = 0; i < len; i++) {
                        bytes[i] = binary_string.charCodeAt(i);
                    }
                    return bytes;
                }

                function binaryToBase64URL(int8Array) {
                    return window.btoa(String.fromCharCode.apply(null, int8Array))
                        .replace(/\+/g, '-').replace(/\//g, '_') // URL friendly
                        .replace(/\=+$/, ''); // No padding.
                }


                function arrayBufferToBase64(buffer) {
                    var binary = '';
                    var bytes = new Uint8Array(buffer);
                    var len = bytes.byteLength;
                    for (var i = 0; i < len; i++) {
                        binary += String.fromCharCode(bytes[i]);
                    }
                    return window.btoa(binary);
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

                function str2ab(str) {
                    var buf = new ArrayBuffer(str.length);
                    var bufView = new Uint8Array(buf);
                    for (var i = 0; i < str.length; i++) {
                        bufView[i] = str.charCodeAt(i);
                    }
                    return buf;
                }

                function ab2str(buf) {
                    return String.fromCharCode.apply(null, new Uint8Array(buf));
                }
                var privateImported;
                window.crypto.subtle.importKey(
                        "jwk", //can be "jwk" (public or private), "spki" (public only), or "pkcs8" (private only)
                        jwkPrivate, { //these are the algorithm options
                            name: "RSASSA-PKCS1-v1_5",
                            hash: {
                                name: "SHA-256"
                            }, //can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"
                        },
                        false, //whether the key is extractable (i.e. can be used in exportKey)
                        ["sign"] //"verify" for public key import, "sign" for private key imports
                    )
                    .then(function(privateKey) {
                        //returns a publicKey (or privateKey if you are importing a private key)
                        privateImported = privateKey;
                        console.log("Public Key : " + privateKey);
                        console.log("publicImported Key : " + privateImported);

                        window.crypto.subtle.sign({
                                    name: "RSASSA-PKCS1-v1_5",
                                },
                                privateKey, //from generateKey or importKey above
                                str2ab("Hello World!") //ArrayBuffer of data you want to sign
                            )
                            .then(function(signature) {
                                //returns an ArrayBuffer containing the signature
                                console.log(signature);


                                //var signatureXhttp = new XMLHttpRequest();

                                //xhttp.onreadystatechange = function() {
                                //    if (xhttp.readyState == 4 && xhttp.status == 200) {
                                //        console.log("Signature Sent and Processed Successfully!");
                                //    }
                                //}

                                //signatureXhttp.responseType = 'arraybuffer';
                                //var unit8Signature = new Uint8Array(signature);
                                //var asciiSignature = ab2str(signature);
                                //console.log(asciiSignature);

                                //signatureXhttp.open("GET", "https://localhost:8080/verifySignature?signature=" + signature, true);
                                //signatureXhttp.open("GET", "https://localhost:8080/verifySignature", true);
                                //signatureXhttp.setRequestHeader("Content-type", "arraybuffer");
                                //signatureXhttp.setRequestHeader("Content-type", "text/plain");
                                //xhttp.setRequestHeader("'Access-Control-Allow-Origin", "*");
                                //signatureXhttp.sendAsBinary("signature = " + signature);
                                //signatureXhttp.send();


                                var socket = io.connect('https://localhost:8080/');
                                //var socket = io.connect();
                                socket.on('connected', function(data) {
                                    //console.log(data);
                                    socket.emit('my other event', {
                                        my: signature
                                    });
                                });
                                //console.log("sent!");
                                //console.log(ab2str(signature));
                                //console.log(signature);
                            })
                            .catch(function(err) {
                                console.error(err);
                            });
                    })
                    .catch(function(err) {
                        console.error(err);
                    });

                //console.log(JSON.parse(keys));

                //img.src = window.URL.createObjectURL(blob);
                //document.getElementById("demo").appendChild(img);
            } else
                console.log("not success!");
        };

        //xhttp.responseType = 'blob';        
        //xhttp.responseType = 'arraybuffer';
        xhttp.responseType = 'application/json';
        xhttp.open("POST", "https://localhost:8080/keyExchange", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        //xhttp.setRequestHeader("'Access-Control-Allow-Origin", "*");
        xhttp.send();



    },
    generate: function() {
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
    }
};

console.log("Hello from PID");
pid.init();
document.foo = "test";
//localStorage.setItem('myCat', 'Tom');

// Notify me of everything!


function clickMe(e) {
    t();
    console.log("click from Web");
    e.stopImmediatePropagation();
    //alert(document.foo);
    loadScript("js/canvas.js", pid.keyExchange);
    /*var pid = [];
	
    var all = document.getElementsByTagName("*");
    var allScripts = document.getElementsByTagName("script");
	
    var countElements = 0;
    var countScripts = 0;
    var countAttributePerElement = [];
    var countEventsPerElement = [];
    var countChildElementsPerElement = [];
	
    for (var i=0, max=all.length; i < max; i++) {
    	countAttributePerElement[i] = all[i].attributes.length;
    	countChildElementsPerElement[i] = all[i].childElementCount;
    	countEventsPerElement[i] = 
    	countElements++;
    }
	
    for (var i=0, max=allScripts.length; i < max; i++) {
    	countScripts++;
    }
	
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
    	if (xhttp.readyState == 4 && xhttp.status == 200) {
    		document.getElementById("demo").innerHTML = xhttp.responseText;
    	}
    };
    xhttp.open("POST", "https://localhost:8080/process_post", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	
	
	
    xhttp.send("first_name=" + pid.toString() + "&last_name=Ford");*/
    //xhttp.send();
}

function clickMe1() {

    alert("ClickMe1");
}