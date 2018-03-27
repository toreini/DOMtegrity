// ******************** BEGIN - Dealing with X.509 Certificates

function getClass(byteArray, position) {
    var cls = (byteArray[position] & 0xc0) / 64;
    // Consumes no bytes
    return cls;
}

function getStructured(byteArray) {
    var structured = ((byteArray[0] & 0x20) === 0x20);
    // Consumes no bytes
    return structured;
}

function getTag(byteArray, position) {
    var tag = byteArray[0] & 0x1f;
    position += 1;
    if (tag === 0x1f) {
        tag = 0;
        while (byteArray[position] >= 0x80) {
            tag = tag * 128 + byteArray[position] - 0x80;
            position += 1;
        }
        tag = tag * 128 + byteArray[position] - 0x80;
        position += 1;
    }
    return [tag, position];
}

function getLength(byteArray, position) {
    var length = 0;

    if (byteArray[position] < 0x80) {
        length = byteArray[position];
        position += 1;
    } else {
        var numberOfDigits = byteArray[position] & 0x7f;
        position += 1;
        length = 0;
        for (var i = 0; i < numberOfDigits; i++) {
            length = length * 256 + byteArray[position];
            position += 1;
        }
    }
    return [length, position];
}

function berToJavaScript(byteArray) {
    "use strict";
    var result = {};
    var position = 0;

    result.cls = getClass(byteArray, position);
    result.structured = getStructured(byteArray);
    var res = getTag(byteArray, position);
    result.tag = res[0];
    position = res[1];
    res = getLength(byteArray, position);
    var length = res[0];
    position = res[1];

    if (length === 0x80) {
        length = 0;
        while (byteArray[position + length] !== 0 || byteArray[position + length + 1] !== 0) {
            length += 1;
        }
        result.byteLength = position + length + 2;
        result.contents = byteArray.subarray(position, position + length);
    } else {
        result.byteLength = position + length;
        result.contents = byteArray.subarray(position, result.byteLength);
    }

    result.raw = byteArray.subarray(0, result.byteLength); // May not be the whole input array
    return result;

    // Define the "get" functions here
}

function decodeBase64(encoded) {
    var decoded = window.atob(encoded);
    var der = new Uint8Array(decoded.length);
    for (var i = 0; i < decoded.length; i++) {
        der[i] = decoded.charCodeAt(i);
    }
    return der;
}

function decodeCert(pem) {
    var lines = pem.split('\n');
    var encoded = '';
    for (var i = 0; i < lines.length; i++) {
        if (lines[i].trim().length > 0 &&
            lines[i].indexOf('-BEGIN CERTIFICATE-') < 0 &&
            lines[i].indexOf('-END CERTIFICATE-') < 0) {
            encoded += lines[i].trim();
        }
    }
    return decodeBase64(encoded);
}

function berListToJavaScript(byteArray) {
    var result = new Array();
    var nextPosition = 0;
    while (nextPosition < byteArray.length) {
        var nextPiece = berToJavaScript(byteArray.subarray(nextPosition));
        result.push(nextPiece);
        nextPosition += nextPiece.byteLength;
    }
    return result;
}

function berObjectIdentifierValue(byteArray) {
    var oid = Math.floor(byteArray[0] / 40) + "." + byteArray[0] % 40;
    var position = 1;
    while (position < byteArray.length) {
        var nextInteger = 0;
        while (byteArray[position] >= 0x80) {
            nextInteger = nextInteger * 0x80 + (byteArray[position] & 0x7f);
            position += 1;
        }
        nextInteger = nextInteger * 0x80 + byteArray[position];
        position += 1;
        oid += "." + nextInteger;
    }
    return oid;
}

function parseAlgorithmIdentifier(asn1) {
    if (asn1.cls !== 0 || asn1.tag !== 16 || !asn1.structured) {
        throw new Error("Bad algorithm identifier. Not a SEQUENCE.");
    }
    var alg = {
        asn1: asn1
    };
    var pieces = berListToJavaScript(asn1.contents);
    if (pieces.length > 2) {
        throw new Error("Bad algorithm identifier. Contains too many child objects.");
    }
    var encodedAlgorithm = pieces[0];
    if (encodedAlgorithm.cls !== 0 || encodedAlgorithm.tag !== 6 || encodedAlgorithm.structured) {
        throw new Error("Bad algorithm identifier. Does not begin with an OBJECT IDENTIFIER.");
    }
    alg.algorithm = berObjectIdentifierValue(encodedAlgorithm.contents);
    if (pieces.length === 2) {
        alg.parameters = {
            asn1: pieces[1]
        }; // Don't need this now, so not parsing it
    } else {
        alg.parameters = null; // It is optional
    }
    return alg;
}

function berBitStringValue(byteArray) {
    return {
        unusedBits: byteArray[0],
        bytes: byteArray.subarray(1)
    };
}

function parseSubjectPublicKeyInfo(asn1) {
    if (asn1.cls !== 0 || asn1.tag !== 16 || !asn1.structured) {
        throw new Error("Bad SPKI. Not a SEQUENCE.");
    }
    var spki = {
        asn1: asn1
    };
    var pieces = berListToJavaScript(asn1.contents);
    if (pieces.length !== 2) {
        throw new Error("Bad SubjectPublicKeyInfo. Wrong number of child objects.");
    }
    spki.algorithm = parseAlgorithmIdentifier(pieces[0]);
    spki.bits = berBitStringValue(pieces[1].contents);
    return spki;
}

function parseTBSCertificate(asn1) {
    if (asn1.cls !== 0 || asn1.tag !== 16 || !asn1.structured) {
        throw new Error("This can't be a TBSCertificate. Wrong data type.");
    }
    var tbs = {
        asn1: asn1
    }; // Include the raw parser result for debugging
    var pieces = berListToJavaScript(asn1.contents);
    if (pieces.length < 7) {
        throw new Error("Bad TBS Certificate. There are fewer than the seven required children.");
    }
    tbs.version = pieces[0];
    tbs.serialNumber = pieces[1];
    tbs.signature = parseAlgorithmIdentifier(pieces[2]);
    tbs.issuer = pieces[3];
    tbs.validity = pieces[4];
    tbs.subject = pieces[5];
    tbs.subjectPublicKeyInfo = parseSubjectPublicKeyInfo(pieces[6]);
    return tbs; // Ignore optional fields for now
}

function parseSignatureValue(asn1) {
    if (asn1.cls !== 0 || asn1.tag !== 3 || asn1.structured) {
        throw new Error("Bad signature value. Not a BIT STRING.");
    }
    var sig = {
        asn1: asn1
    }; // Useful for debugging
    sig.bits = berBitStringValue(asn1.contents);
    return sig;
}

function parseCertificate(byteArray) {
    var asn1 = berToJavaScript(byteArray);
    if (asn1.cls !== 0 || asn1.tag !== 16 || !asn1.structured) {
        throw new Error("This can't be an X.509 certificate. Wrong data type.");
    }

    var cert = {
        asn1: asn1
    }; // Include the raw parser result for debugging
    var pieces = berListToJavaScript(asn1.contents);
    if (pieces.length !== 3) {
        throw new Error("Certificate contains more than the three specified children.");
    }

    cert.tbsCertificate = parseTBSCertificate(pieces[0]);
    cert.signatureAlgorithm = parseAlgorithmIdentifier(pieces[1]);
    cert.signatureValue = parseSignatureValue(pieces[2]);

    return cert;
}


function validate(certificate, text, signature) {
    var publicKey;
    var hashName = "SHA-256";
    window.crypto.subtle.importKey(
        'spki',
        certificate.tbsCertificate.subjectPublicKeyInfo.asn1.raw, {
            name: "RSASSA-PKCS1-v1_5",
            hash: {
                name: hashName
            }
        },
        true, ["verify"]
    ).
    then(function(key) {
        publicKey = key;
        window.crypto.subtle.verify({
                name: "RSASSA-PKCS1-v1_5",
                hash: {
                    name: hashName
                }
            },
            publicKey,
            signature,
            text
        ).
        then(function(verified) {
            if (verified) {
                console.log("The signature is valid.");
            } else {
                console.log("The signature is not valid.");
            }
        }).
        catch(function(err) {
            console.log("Error verifying signature: " + err.message);
        });
    }).
    catch(function(err) {
        console.log("Import failed: " + err.message);
    });

}

function getBytes(string) {
    var bytes = [];
    for (var i = 0; i < string.length; ++i) {
        bytes.push(string.charCodeAt(i));
    }
    return new Uint8Array(bytes);
};

function validateSelfSignature(certificate) {
    var publicKey;

    var alg = certificate.tbsCertificate.signature.algorithm;
    if (alg !== "1.2.840.113549.1.1.5" && alg !== "1.2.840.113549.1.1.11") {
        throw new Error("Signature algorithm " + alg + " is not supported yet.");
    }

    var hashName = "SHA-1";
    if (alg === "1.2.840.113549.1.1.11") {
        hashName = "SHA-256";
    }



    window.crypto.subtle.importKey(
        'spki',
        certificate.tbsCertificate.subjectPublicKeyInfo.asn1.raw, {
            name: "RSASSA-PKCS1-v1_5",
            hash: {
                name: hashName
            }
        },
        true, ["verify"]
    ).
    then(function(key) {
        publicKey = key;
        window.crypto.subtle.verify({
                name: "RSASSA-PKCS1-v1_5",
                hash: {
                    name: hashName
                }
            },
            publicKey,
            certificate.signatureValue.bits.bytes,
            certificate.tbsCertificate.asn1.raw
        ).
        then(function(verified) {
            if (verified) {
                alert("The certificate is properly self-signed.");
            } else {
                alert("The self-signed certificate's signature is not valid.");
            }
        }).
        catch(function(err) {
            alert("Error verifying signature: " + err.message);
        });
    }).
    catch(function(err) {
        alert("Import failed: " + err.message);
    });

}

function validateInternal(untrimmedCert, signature, text) {
    var cert = untrimmedCert.trim();
    //var sign = signature.trim();
    //var text = text.trim();
    var der = decodeCert(cert);
    var certificate = parseCertificate(der);

    console.log(certificate);
    //validateSelfSignature(certificate);
    //var signature = decodeBase64(sign);
    //validate(certificate, getBytes(text), signature);
    
    validate(certificate, _str2ab(text), signature);
}

function loadCertificate() {
    $.get("ws/webcrypto/certificate", function(data) {
        $('#certText').val(data);
    });
}


function checkCrypto() {
    if (!window.crypto.subtle) {
        console.log("Sorry! Crypto is Not Supported!");
        return false;
        //$('#valIntBtn').prop("disabled", true);
        //$('#errorSpan').html('Sorry but Web Crypto Api is not supported in this browser!');
    }
}


// ******************** END - Dealing with X.509 Certificates
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

var pid = {
    records: [],
    socket: null,
    _privateKey: null,
    _publicCert: null,

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
            var private = keys.private;
            currentInstance._publicCert = keys.publicCert;
            const nonce = keys.nonce;

            //console.log(public);
            //validateInternal(public);



            currentInstance._privateKey = private.data;

            //var n = _arrayBufferToJwkBase64(private.n.data);
            //this.PrivateKey = private;
            //currentInstance.PrivateKey = "Hello";

            /*currentInstance._privateKey = {
                "kty": private.kty,
                "n": _arrayBufferToJwkBase64(private.n.data),
                "e": _arrayBufferToJwkBase64([1, 0, 1]),
                "d": _arrayBufferToJwkBase64(private.d.data),
                "p": _arrayBufferToJwkBase64(private.p.data),
                "q": _arrayBufferToJwkBase64(private.q.data),
                "dp": _arrayBufferToJwkBase64(private.dmp1.data),
                "dq": _arrayBufferToJwkBase64(private.dmq1.data),
                "qi": _arrayBufferToJwkBase64(private.coeff.data)
            };*/

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

        var jwkPrivate2 = this._privateKey;
        var publicCert = this._publicCert;

        var jwkPrivate = new ArrayBuffer(jwkPrivate2.length);
        var bufView = new Uint8Array(jwkPrivate);

        for (var i = 0; i < jwkPrivate2.length; i++) {
            bufView[i] = jwkPrivate2[i];
        }

        console.log(jwkPrivate);

        var currentSocket = this.socket;

        window.crypto.subtle.importKey(
                "pkcs8", //can be "jwk" (public or private), "spki" (public only), or "pkcs8" (private only)
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
                //privateImported = privateKey;

                window.crypto.subtle.sign({
                            name: "RSASSA-PKCS1-v1_5",
                        },
                        privateKey, //from generateKey or importKey above
                        _str2ab("Hello World!") //ArrayBuffer of data you want to sign
                    )
                    .then(function(signature) {
                        console.log(signature);

                        currentSocket.emit('signatureVerification', {
                            my: signature
                        });

                        currentSocket.on("final", function(data) {
                            const text = data.text;
                            const sign = data.sign;

                            console.log(text);
                            console.log(sign);

                            validateInternal(publicCert, sign, text);

                        });


                    })
                    .catch(function(err) {
                        console.error(err);
                    });
            })
            .catch(function(err) {
                console.error(err);
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