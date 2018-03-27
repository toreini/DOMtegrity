(function() {
        'use strict';
        var undefined;

        if (document.pid) {
            navigator.pid = navigator.mozId;
        } else {
            (function() {
                var undefined;
                
                var t0;
                var t1;

                // ************ Channel Class: This class controls the socket communication between client and server
                // ************ and Handles Cryptographics primitive functions

                var Channel = (function() {
                    "use strict";
                    var _privateKey = undefined;
                    //var _nonce = undefined;
                    var _iv = undefined;
                    var _digKey = undefined;
                    var _socket = {};
                    var _decision = undefined;

                    function createWebCryptoKey(data) {
                        var keys = JSON.parse(data);

                        var rawPrivate = Convertor.raw2ab(keys.private.data);

                        window.crypto.subtle.importKey(
                                "raw", //can be "jwk" (public or private), "spki" (public only), or "pkcs8" (private only)
                                rawPrivate, { //these are the algorithm options
                                    name: "AES-CBC",
                                },
                                false, //whether the key is extractable (i.e. can be used in exportKey)
                                ["decrypt", "encrypt"] //"verify" for public key import, "sign" for private key imports
                            )
                            .then(function(key) {
                                _privateKey = key;
                                console.log(_privateKey);
                            })
                            .catch(function(err) {
                                console.error(err);
                            });

                        window.crypto.subtle.importKey(
                                "raw", //can be "jwk" (public or private), "spki" (public only), or "pkcs8" (private only)
                                rawPrivate, { //these are the algorithm options
                                    name: "HMAC",
                                    hash: {
                                        name: "SHA-256"
                                    },
                                },
                                false, //whether the key is extractable (i.e. can be used in exportKey)
                                ["sign"] //"verify" for public key import, "sign" for private key imports
                            )
                            .then(function(key) {
                                _digKey = key;
                                console.log(_digKey);
                            })
                            .catch(function(err) {
                                console.error(err);
                            });

                        //_nonce = Convertor.raw2ab(keys.nonce.data);
                        _iv = Convertor.raw2ab(keys.iv.data);
                        //console.log(_nonce);
                    };

                    function analyseDecision(decision) {

                        window.crypto.subtle.decrypt({
                                    name: "AES-CBC",
                                    iv: _iv,
                                },
                                _privateKey, //from generateKey or importKey above
                                decision.content
                                //all
                            )
                            .then(function(text) {
                                console.log(Convertor.ab2str(text));
                                console.log(decision.reason);
                            })
                            .catch(function(err) {
                                console.error(err);
                            });

                    }
                    
                    function reconnect(){
                        _socket={};    
                        while(_socket.readyState === undefined || _socket.readyState > 1) _socket = new WebSocket('wss://localhost:8080');
                    }

                    function handshake() {

                        console.log("Object Channel request sent: " + performance.now());

                        if (window.MozWebSocket) {
                            window.WebSocket = window.MozWebSocket;
                        }

                        if (_socket.readyState === undefined || _socket.readyState > 1) {
                            _socket = new WebSocket('wss://localhost:8080');    
                            _socket.onopen = function () {
                              console.log("Object Socket connected: " + performance.now());
                            };

                            _socket.onmessage = function (msg) {
                                createWebCryptoKey(msg.data);
                                console.log("Object Key Recieved: " + performance.now());
                            };
                            
                            _socket.onerror = function(event){                               
                                console.log("socket error");
                                reconnect();
                            }

                            _socket.onclose = function (event) {
                                console.log("socket closed");
                                reconnect();
                            };
                        }
                    }


                    function sendPID(pid) {

                        window.crypto.subtle.sign({
                                    name: "HMAC",
                                    hash: {
                                        name: "SHA-256"
                                    },
                                },
                                _digKey, 
                                Convertor.str2ab(pid)
                            )
                            .then(function(signature) {
                                console.log(new Uint8Array(signature));
                                _socket.send(signature);
                            })
                            .catch(function(err) {
                                console.error(err);
                            });
                    }
                    return {
                        start: function() {
                            handshake();
                        },

                        transfer: function(pid) {
                            sendPID(pid);
                        },

                        getDecision: function() {
                            return _decision;
                        }
                    };
                })();


                /* START OF THE CLANNEL FROM HERE */
                Channel.start();

                /* STOP DISPATCHING EVENT FOR ALL ELEMENTS */
                var eventProtection = (function() {
                    var _eventList = ["abort",
                        "afterprint",
                        "animationend",
                        "animationiteration",
                        "animationstart",
                        "audioprocess",
                        "audioend ",
                        "audiostart ",
                        "beforeprint",
                        "beforeunload",
                        "beginEvent",
                        "blocked",
                        "blur",
                        "boundary ",
                        "cached",
                        "canplay",
                        "canplaythrough",
                        "change",
                        "chargingchange",
                        "chargingtimechange",
                        "checking",
                        "click",
                        "close",
                        "complete",
                        "compositionend",
                        "compositionstart",
                        "compositionupdate",
                        "contextmenu",
                        "copy",
                        "cut",
                        "dblclick",
                        "devicelight",
                        "devicemotion",
                        "deviceorientation",
                        "deviceproximity",
                        "dischargingtimechange",
                        "DOMActivate ",
                        "DOMAttributeNameChanged ",
                        "DOMAttrModified ",
                        "DOMCharacterDataModified ",
                        "DOMContentLoaded",
                        "DOMElementNameChanged ",
                        "DOMFocusIn  Unimplemented",
                        "DOMFocusOut  Unimplemented",
                        "DOMNodeInserted ",
                        "DOMNodeInsertedIntoDocument ",
                        "DOMNodeRemoved ",
                        "DOMNodeRemovedFromDocument ",
                        "DOMSubtreeModified ",
                        "downloading",
                        "drag",
                        "dragend",
                        "dragenter",
                        "dragleave",
                        "dragover",
                        "dragstart",
                        "drop",
                        "durationchange",
                        "emptied",
                        "end ",
                        "ended",
                        "endEvent",
                        "focus",
                        "focusinUnimplemented (see bug 687787)",
                        "focusoutUnimplemented (see bug 687787)",
                        "fullscreenchange",
                        "fullscreenerror",
                        "gamepadconnected",
                        "gamepaddisconnected",
                        "gotpointercapture",
                        "hashchange",
                        "lostpointercapture",
                        "input",
                        "invalid",
                        "keydown",
                        "keypress",
                        "keyup",
                        "languagechange ",
                        "levelchange",
                        "load",
                        "loadeddata",
                        "loadedmetadata",
                        "loadend",
                        "loadstart",
                        "mark ",
                        "message",
                        "mousedown",
                        "mouseenter",
                        "mouseleave",
                        "mousemove",
                        "mouseout",
                        "mouseover",
                        "mouseup",
                        "nomatch ",
                        "notificationclick",
                        "noupdate",
                        "obsolete",
                        "offline",
                        "online",
                        "open",
                        "orientationchange",
                        "pagehide",
                        "pageshow",
                        "paste",
                        "pause",
                        "pointercancel",
                        "pointerdown",
                        "pointerenter",
                        "pointerleave",
                        "pointerlockchange",
                        "pointerlockerror",
                        "pointermove",
                        "pointerout",
                        "pointerover",
                        "pointerup",
                        "play",
                        "playing",
                        "popstate",
                        "progress",
                        "progress",
                        "push",
                        "pushsubscriptionchange",
                        "ratechange",
                        "readystatechange",
                        "repeatEvent",
                        "reset",
                        "resize",
                        "resourcetimingbufferfull",
                        "result ",
                        "resume ",
                        "scroll",
                        "seeked",
                        "seeking",
                        "select",
                        "selectstart ",
                        "selectionchange ",
                        "show",
                        "soundend ",
                        "soundstart ",
                        "speechend ",
                        "speechstart ",
                        "stalled",
                        "start ",
                        "storage",
                        "submit",
                        "success",
                        "suspend",
                        "SVGAbort",
                        "SVGError",
                        "SVGLoad",
                        "SVGResize",
                        "SVGScroll",
                        "SVGUnload",
                        "SVGZoom",
                        "timeout",
                        "timeupdate",
                        "touchcancel",
                        "touchend",
                        "touchmove",
                        "touchstart",
                        "transitionend",
                        "unload",
                        "updateready",
                        "upgradeneeded",
                        "userproximity",
                        "voiceschanged ",
                        "versionchange",
                        "visibilitychange",
                        "volumechange",
                        "vrdisplayconnected ",
                        "vrdisplaydisconnected ",
                        "vrdisplaypresentchange ",
                        "waiting",
                        "wheel"
                    ];

                    function _createProtection() {
                        var all = document.getElementsByTagName("*");
                        //console.log(all);
                        Array.from(all, function(element) {
                            //console.log(element);
                            _eventList.forEach(function(event) {
                                element.addEventListener(event, function(e) {
                                    e.stopImmediatePropagation();
                                }, false);
                            });
                        });
                    }

                    return {
                        protect: function() {
                            _createProtection();
                            console.log("All Elements are protected now!");
                        }
                    };
                })();

                /* ************ Observer Class: This class records the mutation done on document object. 
                 ************ This is used in generating PID in the last step*/
                var Observer = (function() {
                    var _changes = "";

                    function _doObserve() {
                        //console.log("Start Defining Mutation");
                        var tempObserver = new MutationObserver(function(mutations) {
                            // For the sake of...observation...let's output the mutation to console to see how this all works
                            //console.log("Mutation Change Entered");
                            mutations.forEach(function(mutation) {
                                var t;
                                switch (mutation.type) {
                                    case "attributes":
                                        t = "0";
                                        break;
                                    case "characterData":
                                        t = "1";
                                        break;
                                    case "childList":
                                        t = "2";
                                        break;
                                    case "subtree":
                                        t = "3";
                                        break;
                                    case "attributeOldValue":
                                        t = "4";
                                        break;
                                    case "characterDataOldValue":
                                        t = "5";
                                        break;
                                }
                                //console.log(t);
                                _changes += t;
                            });
                        });

                        var observerConfig = {
                            attributes: true,
                            childList: true,
                            characterData: true,
                            subtree: true,
                            attributeOldValue: true,
                            characterDataOldValue: true
                        };

                        // Node, config
                        // In this case we'll listen to all changes to body and child nodes
                        var targetNode = document;
                        tempObserver.observe(targetNode, observerConfig);
                        //console.log("Finished Defining Mutation");

                    }

                    function _generatePID() {

                        return ((_changes + "<html>" + document.documentElement.innerHTML + "</html>").replace(/["']+/g, '').replace(/[\n\r]+/g, '').replace(/\s{1,10}/g, '').trim());
                        //return ((_changes + "<html>" + document.documentElement.innerHTML + "</html>"));
                    }

                    return {
                        build: function() {
                            _doObserve();
                        },

                        export: function() {
                            return _generatePID();
                        }
                    };
                })();
                
                // ************ Convertor Class: This class Manages the conversions
                // ************ For any type of conversion

                var Convertor = (function() {

                    function _str2ab(str) {
                        var buf = new ArrayBuffer(str.length);
                        var bufView = new Uint8Array(buf);
                        for (var i = 0; i < str.length; i++)
                            bufView[i] = str.charCodeAt(i);
                        return buf;

                    }

                    function _raw2ab(raw) {
                        var buf = new ArrayBuffer(raw.length);
                        var bufView = new Uint8Array(buf);

                        for (var i = 0; i < raw.length; i++)
                            bufView[i] = raw[i];
                        return buf;
                    }

                    function _concatab(buffer1, buffer2) {
                        var tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
                        tmp.set(new Uint8Array(buffer1), 0);
                        tmp.set(new Uint8Array(buffer2), buffer1.byteLength);
                        return tmp.buffer;
                    }

                    function _ab2str(raw) {
                        return String.fromCharCode.apply(null, new Uint8Array(raw));
                    }

                    return {
                        str2ab: function(str) {
                            return _str2ab(str);
                        },

                        raw2ab: function(raw) {
                            return _raw2ab(raw);
                        },
                        concatab: function(buf1, buf2) {
                            return _concatab(buf1, buf2);
                        },
                        ab2str: function(raw) {
                            return _ab2str(raw);
                        }


                    };
                })();

                var BrowserSupport = (function() {
                    var win = window,
                        nav = navigator,
                        reason;

                    // For unit testing
                    function setTestEnv(newNav, newWindow) {
                        nav = newNav;
                        win = newWindow;
                    }

                    function getInternetExplorerVersion() {
                        var rv = -1; // Return value assumes failure.
                        if (nav.appName == 'Microsoft Internet Explorer') {
                            var ua = nav.userAgent;
                            var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
                            if (re.exec(ua) != null)
                                rv = parseFloat(RegExp.$1);
                        }

                        return rv;
                    }

                    function checkIE() {
                        var ieVersion = getInternetExplorerVersion(),
                            ieNosupport = ieVersion > -1 && ieVersion < 8;

                        if (ieNosupport) {
                            return "BAD_IE_VERSION";
                        }
                    }

                    function explicitNosupport() {
                        return checkIE();
                    }

                    function checkWebCrypto() {
                        try {
                            var hasWebcrypto = 'crypto' in win
                                && win['crypto'] !== null;

                            if (hasWebcrypto) {
                            } else {
                                return "WEBCRYPTO_NOT_SUPPORTED";
                            }
                        } catch (e) {
                            return "WEBCRYPTO_DISABLED";
                        }
                    }

                    function checkJSON() {
                        if (!(window.JSON && window.JSON.stringify && window.JSON.parse)) {
                            return "JSON_NOT_SUPPORTED";
                        }
                    }

                    function isSupported() {
                        reason = explicitNosupport() || checkWebCrypto() || checkJSON();

                        return !reason;
                    }


                    function getNoSupportReason() {
                        return reason;
                    }

                    return {
                        setTestEnv: setTestEnv,
                        isSupported: isSupported,
                        getNoSupportReason: getNoSupportReason
                    };
                }());

                if (!document.pid) {
                    Observer.build();
                    eventProtection.protect();
                    document.pid = {};

                }

                if (!document.pid.request || document.pid._shimmed) {


                    var waitingForDOM = false;
                    var browserSupported = BrowserSupport.isSupported();

                    function isSupported() {
                        return BrowserSupport.isSupported();
                    }

                    function noSupportReason() {
                        var reason = BrowserSupport.getNoSupportReason();
                        if (!reason) {
                            return REQUIRES_WATCH;
                        }
                    }

                    if (!isSupported()) {
                        var reason = noSupportReason();
                        var url = "unsupported_dialog";

                        if (reason === "WEBCRYPTO_DISABLED") {
                            url = "cookies_disabled";
                        } else if (reason === REQUIRES_WATCH) {
                            url = "unsupported_dialog_without_watch";
                        }
                        console.log(url);
                        return;
                    }


                    function decisionReady(callback) {
                        if (callback() == undefined) {
                            callback();
                        }
                    }

                    document.pid = {
                        request: function(options) {

                            if (this != document.pid)
                                throw new Error("all document.pid calls must be made on the document.id object");

                            t0 = performance.now();
                            var pid = Observer.export();
                            t1 = performance.now();

                            console.log(pid);
                            t0 = performance.now();
                            Channel.transfer(pid);
                            t1 = performance.now();
                        },
                        _shimmed: true
                    };
                }
            }());
        }
        console.log("Object Ended: " + performance.now());
    }());