/**
 *
 */

(function() {
  'use strict';
  var undefined;

  if (document.pid) {
    navigator.pid = navigator.mozId;
  } else {
    (function() {
      var undefined;
      console.log("Object Entered!");
      var t0;
      var t1;

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

        function _createProtection(){
          var all = document.getElementsByTagName("*");
          //console.log(all);
          Array.from(all, function(element){
            //console.log(element);
            _eventList.forEach(function(event){
              element.addEventListener(event, function(e){
                e.stopImmediatePropagation();
              },false);
            });
          });
        }

        return {
          protect: function(){
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
          console.log("Start Defining Mutation");
          var tempObserver = new MutationObserver(function(mutations) {
            // For the sake of...observation...let's output the mutation to console to see how this all works
            console.log("Mutation Change Entered");
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
              console.log(t);
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
          console.log("Finished Defining Mutation");

        }

        function _generatePID() {
          
          return ((_changes + "<html>" + document.documentElement.innerHTML + "</html>").replace(/["']+/g, '').replace(/[\n\r]+/g, '').replace(/\s{1,10}/g, '').trim());
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
      /* This is for embedding Socket.io live, not implemented NOW! */
      var socketLoad = (function(){
        function _loadScript() {
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
                        Observer.build();
                    }
                };
            } else { //Others
                script.onload = function() {
                    Observer.build();
                };
            }

            script.src = "js/socket.io-1.4.5.js";
            // Fire the loading
            document.body.appendChild(script);
        }

        return {
          start: function() {
            return _loadScript();
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


      // ************ Channel Class: This class controls the socket communication between client and server
      // ************ and Handles Cryptographics primitive functions

      var Channel = (function() {
        "use strict";
        var _privateKey = undefined;
        //var _nonce = undefined;
        var _iv = undefined;
        var _digKey = undefined;
        var _socket = undefined;
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

        function analyseDecision(data) {
          var decision = JSON.parse(data);
          console.log(decision);
          window.crypto.subtle.decrypt({
                name: "AES-CBC",
                iv: _iv,
              },
              _privateKey, //from generateKey or importKey above
              Convertor.raw2ab(decision.content.data)
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

        function handshake() {
          console.log("Handshake Started!");
          var xhttp = new XMLHttpRequest();
		  xhttp.onreadystatechange = function() {
			  if (this.readyState == 4 && this.status == 200) {
			     createWebCryptoKey(this.responseText);
			  }
		  };
		  xhttp.open("POST", "https://localhost:8080/keyExchange", true);
		  xhttp.send();
        }


        function sendPID(pid) {

          //Convertor.concatab(Convertor.str2ab(pid), _nonce)
          window.crypto.subtle.sign({
                name: "HMAC",
                hash: {
                  name: "SHA-256"
                },
              },
              _digKey, //from generateKey or importKey above
              //Convertor.concatab(Convertor.str2ab(pid), _nonce) //ArrayBuffer of data you want to sign
              Convertor.str2ab(pid)
            )
            .then(function(signature) {
              //returns an ArrayBuffer containing the signature
              console.log("HMAC success.")
              console.log(new Uint8Array(signature));
              /*_socket.emit('signatureVerification', {
                my: signature
              });*/
	          var xhttp = new XMLHttpRequest();
			  xhttp.onreadystatechange = function() {
				  if (this.readyState == 4 && this.status == 200) {
				     analyseDecision(this.responseText);
				  }
			  };
			  xhttp.open("POST", "https://localhost:8080/verification", true);

			  //xhttp.setRequestHeader("Content-Type", "application/json");
			  var r = {my: new Uint8Array(signature)};
			  console.log(r);
			  //var blob = new Blob(signature, {type: 'text/plain'});
			  //var r = JSON.stringify({"my":signature});
			  console.log(JSON.stringify(r));
			  xhttp.send(r);
            })
            .catch(function(err) {
              console.error(err);
            });
        }
        return {
          start: function() {
            console.log("start key Transfer in Channel");
            handshake();
          },

          transfer: function(pid) {
            console.log("Start Sending PID");
            sendPID(pid);
          },

          getDecision: function() {
            return _decision;
          }
        };
      })();

      /* This Source Code Form is subject to the terms of the Mozilla Public
       * License, v. 2.0. If a copy of the MPL was not distributed with this
       * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

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
          // Firefox/Fennec/Chrome blow up when trying to access or
          // write to localStorage. We must do two explicit checks, first
          // whether the browser has localStorage.  Second, we must check
          // whether the localStorage can be written to.  Firefox (at v11)
          // throws an exception when querying win['localStorage']
          // when cookies are disabled. Chrome (v17) excepts when trying to
          // write to localStorage when cookies are disabled. If an
          // exception is thrown, then localStorage is disabled. If no
          // exception is thrown, hasLocalStorage will be true if the
          // browser supports localStorage and it can be written to.
          try {
            var hasWebcrypto = 'crypto' in win
              // Firefox will except here if cookies are disabled.
              && win['crypto'] !== null;

            if (hasWebcrypto) {
              // browser has localStorage, check if it can be written to. If
              // cookies are disabled, some browsers (Chrome) will except here.
              //win['crypto'].subtle.sign();
              //win['crypto'].subtle.decrypt();
              console.log("WebCrypto Supported!")
            } else {
              // Browser does not have local storage.
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
          /**
           * Set the test environment.
           * @method setTestEnv
           */
          setTestEnv: setTestEnv,
          /**
           * Check whether the current browser is supported
           * @method isSupported
           * @returns {boolean}
           */
          isSupported: isSupported,
          /**
           * Called after isSupported, if isSupported returns false.  Gets the reason
           * why browser is not supported.
           * @method getNoSupportReason
           * @returns {string}
           */
          getNoSupportReason: getNoSupportReason
        };
      }());


      //************************************* This is Start of Implementing Navigate things! :D
      // I would call it document.pid for the start!
      //var watch = undefined;

      if (!document.pid) {
        //socketLoad.start();
        t0 = performance.now();
        Observer.build();
        t1 = performance.now();
        console.log("Call to setup mutation observer " + (t1 - t0) + " milliseconds.");

        t0 = performance.now();
        eventProtection.protect();
        t1 = performance.now();
        console.log("Call to event protections " + (t1 - t0) + " milliseconds.");

        document.pid = {};

      }

      if (!document.pid.request || document.pid._shimmed) {


        var waitingForDOM = false;
        var browserSupported = BrowserSupport.isSupported();

        t0 = performance.now();
        Channel.start();
        t1 = performance.now();
        console.log("Call to start the channel and receive keys " + (t1 - t0) + " milliseconds.");

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
            //console.log("PID: " + Observer.export());
            t1 = performance.now();
            console.log("Call to generate PID " + (t1 - t0) + " milliseconds.");

            console.log("PID: " + pid);
            console.log("Length: " + pid.length);

            t0 = performance.now();
            Channel.transfer(pid);
            t1 = performance.now();
            console.log("Call to create Digital Signature " + (t1 - t0) + " milliseconds.");

            var waitingForDecision = false;


            if (!waitingForDecision) {
              decisionReady(Channel.getDecision);
              waitingForDecision = true;
            }
			       
            t0 = performance.now();
            Channel.getDecision();
            t1 = performance.now();
            console.log("Call to Decrypt Decision " + (t1 - t0) + " milliseconds.");

          },
          // _shimmed was originally required in April 2011 (79d3119db036725c5b51a305758a7816fdc8920a)
          // so we could deal with firefox behavior - which was in certain reload scenarios to caching
          // properties on navigator.id.  The effect would be upon reload-via back/forward,
          // navigator.id would be populated with the previous sessions stale object, and thus
          // the shim would not be properly inserted.
          _shimmed: true
        };
      }
    }());
  }
}());
