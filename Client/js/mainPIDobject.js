/**
 *
 */

(function() {

  var undefined;

  if (document.pid) {
    navigator.id = navigator.mozId;
  } else {
    (function() {
      var undefined;
      console.log("Object Entered!");


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
            })
          });
        }

        return {
          protect: function(){
            _createProtection();
            console.log("All Elements are protected now!");
          }
        };
      })();

      // ************ Observer Class: This class records the mutation done on document object. 
      // ************ This is used in generating PID in the last step
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
              //_changes.push(t);
              console.log(t);
              _changes += t;
              /*console.log(mutation.type);
              console.log(mutation.target);
              console.log(mutation.addedNodes);
              console.log(mutation.removedNodes);
              console.log(mutation.previousSibling);
              console.log(mutation.nextSibling);
              console.log(mutation.attributeName);
              console.log(mutation.attributeNamespace);
              console.log(mutation.oldValue);*/
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
          //var targetNode = document.body;
          //console.log("Before Target Added");
          var targetNode = document;
          tempObserver.observe(targetNode, observerConfig);
          console.log("Finished Defining Mutation");

        }

        function _generatePID() {
          /*var all = document.getElementsByTagName("*");
          var allScripts = document.getElementsByTagName("script");

          var countElements = all.length;
          var countScripts = allScripts.length;

          var countAttributePerElement = [];
          var strCountAttributePerElement = "";
          var countEventsPerElement = [];
          var countChildElementsPerElement = [];
          var strCountChildElementsPerElement = "";

          for (var i = 0; i < countElements; i++) {
            countAttributePerElement[i] = all[i].attributes.length;
            strCountAttributePerElement += all[i].attributes.length.toString();

            countChildElementsPerElement[i] = all[i].childElementCount;
            strCountChildElementsPerElement += all[i].childElementCount.toString();
          //countEventsPerElement[i] =            
          }

          //console.log("Elements " + countElements);
          //console.log("count Attribute Per Element " + strCountAttributePerElement);
          //console.log("count Child Elements Per Element " + strCountChildElementsPerElement);
          //console.log("countScripts " + countScripts);

          //var markup = document.documentElement.innerHTML;

          return (_changes + countElements.toString() +
            strCountAttributePerElement + strCountChildElementsPerElement +
            countScripts.toString());*/

          return ((_changes + "<html>" + document.documentElement.innerHTML + "</html>").replace(/["']+/g, '').replace(/[\n\r]+/g, '').replace(/\s{1,10}/g, '').trim());

          //return("</HiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHi>");
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


      // ************ Channel Class: This class controls the socket communication between client and server
      // ************ and Handles Cryptographics primitive functions

      var Channel = (function() {
        "use strict";
        var _privateKey = undefined;
        var _nonce = undefined;
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

          _nonce = Convertor.raw2ab(keys.nonce.data);
          _iv = Convertor.raw2ab(keys.iv.data);
          console.log(_nonce);
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

        function handshake() {
          console.log("Handshake Started!");

          _socket = io.connect('https://localhost:8080/');

          _socket.on('connected', function(data) {
            console.log("Socket Connected!");
          });


          _socket.on("keyRecieved", function(data) {
            createWebCryptoKey(data);
          });


          _socket.on("final", function(data) {
            analyseDecision(data);
          });

          _socket.emit("keyExchangeRequest");
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
              Convertor.concatab(Convertor.str2ab(pid), _nonce) //ArrayBuffer of data you want to sign
            )
            .then(function(signature) {
              //returns an ArrayBuffer containing the signature
              console.log("HMAC success.")
              console.log(new Uint8Array(signature));
              _socket.emit('signatureVerification', {
                my: signature
              });
            })
            .catch(function(err) {
              console.error(err);
            });

          /*window.crypto.subtle.encrypt({
              name: "AES-CBC",
              iv: _iv,
            },
            _privateKey, //from generateKey or importKey above
           Convertor.str2ab(pid)
            //all
          )
          .then(function(text) {
            console.log("HMAC success.")
            console.log(new Uint8Array(text));
            _socket.emit('signatureVerification', {
              my: text
            });
          })
          .catch(function(err) {
            console.error(err);
          });*/

        }
        return {
          start: function() {
            console.log("start Socket Channel");
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

        function checkLocalStorage() {
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
            var hasLocalStorage = 'localStorage' in win
              // Firefox will except here if cookies are disabled.
              && win['localStorage'] !== null;

            if (hasLocalStorage) {
              // browser has localStorage, check if it can be written to. If
              // cookies are disabled, some browsers (Chrome) will except here.
              win['localStorage'].setItem("test", "true");
              win['localStorage'].removeItem("test");
            } else {
              // Browser does not have local storage.
              return "LOCALSTORAGE_NOT_SUPPORTED";
            }
          } catch (e) {
            return "LOCALSTORAGE_DISABLED";
          }
        }

        function checkPostMessage() {
          if (!win.postMessage) {
            return "POSTMESSAGE_NOT_SUPPORTED";
          }
        }

        function checkJSON() {
          if (!(window.JSON && window.JSON.stringify && window.JSON.parse)) {
            return "JSON_NOT_SUPPORTED";
          }
        }

        function isSupported() {
          reason = explicitNosupport() || checkLocalStorage() || checkPostMessage() || checkJSON();

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
        console.log("document.pid is set to be defined!"); 
        Channel.start();       
        Observer.build();
        eventProtection.protect();
        document.pid = {};

      }

      if (!document.pid.request || document.pid._shimmed) {

        // table of registered observers

        //var watch = observer.build;

        //var watch = new Observer();

        //observer2.build();


        //console.log(watch.export());
        //console.log(observer2.export());


        var waitingForDOM = false;
        var browserSupported = BrowserSupport.isSupported();

        // This is original :D ----->Channel.start();

        /*
                function domReady(callback) {
                    if (document.addEventListener) {
                        document.addEventListener('DOMContentLoaded', function contentLoaded() {
                            document.removeEventListener('DOMContentLoaded', contentLoaded);
                            callback();
                        }, false);
                    } else if (document.attachEvent && document.readyState) {
                        document.attachEvent('onreadystatechange', function ready() {
                            var state = document.readyState;
                            // 'interactive' is the same as DOMContentLoaded,
                            // but not all browsers use it, sadly.
                            if (state === 'loaded' || state === 'complete' || state === 'interactive') {
                                document.detachEvent('onreadystatechange', ready);
                                callback();
                            }
                        });
                    }
                }


                // This has been added by me from _open_hidden_iframe function

                if (!browserSupported) return;
                var doc = window.document;

                // can't attach iframe and make commChan without the body
                if (!doc.body) {
                    if (!waitingForDOM) {
                        domReady(_open_hidden_iframe);
                        waitingForDOM = true;
                    }
                    return;
                }

                try {
                    if (!commChan) {
                        var iframe = doc.createElement("iframe");
                        iframe.style.display = "none";
                        doc.body.appendChild(iframe);
                        iframe.src = ipServer + "/communication_iframe";
                        commChan = Channel.build({
                            window: iframe.contentWindow,
                            origin: ipServer,
                            scope: "mozid_ni",
                            onReady: function() {
                                // once the channel is set up, we'll fire a loaded message.  this is the
                                // cutoff point where we'll say if 'setLoggedInUser' was not called before
                                // this point, then it wont be called (XXX: optimize and improve me)
                                commChan.call({
                                    method: 'loaded',
                                    success: function() {
                                        // NOTE: Do not modify without reading GH-2017
                                        if (observers.ready) observers.ready();
                                    },
                                    error: function() {}
                                });
                            }
                        });

                        commChan.bind('logout', function(trans, params) {
                            if (observers.logout) observers.logout();
                        });

                        commChan.bind('login', function(trans, params) {
                            if (observers.login) observers.login(params);
                        });

                        commChan.bind('match', function(trans, params) {
                            if (observers.match) observers.match();
                        });

                        if (defined(loggedInUser)) {
                            commChan.notify({
                                method: 'loggedInUser',
                                params: loggedInUser
                            });
                        }
                    }
                } catch (e) {
                    // channel building failed!  let's ignore the error and allow higher
                    // level code to handle user messaging.
                    commChan = undefined;
                }



                function internalWatch(options) {
                    if (typeof options !== 'object') return;

                    if (options.onlogin && typeof options.onlogin !== 'function' ||
                        options.onlogout && typeof options.onlogout !== 'function' ||
                        options.onmatch && typeof options.onmatch !== 'function' ||
                        options.onready && typeof options.onready !== 'function') {
                        throw new Error("non-function where function expected in parameters to navigator.id.watch()");
                    }

                    if (!options.onlogin) throw new Error("'onlogin' is a required argument to navigator.id.watch()");
                    if (!options.onlogout && (options.onmatch || ('loggedInUser' in options)))
                        throw new Error('stateless api only allows onlogin and onready options');

                    observers.login = options.onlogin || null;
                    observers.logout = options.onlogout || null;
                    observers.match = options.onmatch || null;
                    // NOTE: Do not modify without reading GH-2017
                    observers.ready = options.onready || null;

                    // back compat support for loggedInEmail
                    checkRenamed(options, "loggedInEmail", "loggedInUser");
                    loggedInUser = options.loggedInUser;
                    if (loggedInUser === false) {
                        loggedInUser = null;
                    }
                    if (!isNull(loggedInUser) &&
                        !isUndefined(loggedInUser) &&
                        !isString(loggedInUser)) {
                        throw new Error("loggedInUser is not a valid type");
                    }


                    _open_hidden_iframe(); // ------> This is for the above code before the function
                }


                //------> This is called in document.id.get!

                internalWatch(options);
                // Until Here!
*/

        function defined(item) {
          return typeof item !== "undefined";
        }

        function warn(message) {
          try {
            console.warn(message);
          } catch (e) {
            //ignore error
          }
        }

        function checkDeprecated(options, field) {
          if (defined(options[field])) {
            warn(field + " has been deprecated");
            return true;
          }
        }

        function isNull(arg) {
          return arg === null;
        }

        function isUndefined(arg) {
          return (typeof arg === 'undefined');
        }

        function isString(arg) {
          return Object.prototype.toString.apply(arg) === "[object String]";
        }


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

          if (reason === "LOCALSTORAGE_DISABLED") {
            url = "cookies_disabled";
          } else if (reason === REQUIRES_WATCH) {
            url = "unsupported_dialog_without_watch";
          }
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
            
            //console.log("Request is Running!");

            //
            //var pid = Observer.export();
            console.log("PID: " + Observer.export());
            console.log("Length: " + Observer.export().length);
            Channel.transfer(Observer.export());

            //while(Channel.getDecision() === undefined) 
            //  continue;
            var waitingForDecision = false;


            if (!waitingForDecision) {
              decisionReady(Channel.getDecision);
              waitingForDecision = true;
            }


            Channel.getDecision();

            //if (!observers.login)
            //  throw new Error("navigator.id.watch must be called before navigator.id.request");

            //options = options || {};
            //checkCompat(false);
            //api_called = "request";
            // returnTo is used for post-email-verification redirect
            //if (!options.returnTo) options.returnTo = document.location.pathname;
            //return internalRequest(options);
          },
          watch: function(options) {
            if (this != document.pid)
              throw new Error("all document.pid calls must be made on the navigator.id object");
            //checkCompat(false);
            //internalWatch(options);
          },
          // logout from the current website
          // The callback parameter is DEPRECATED, instead you should use the
          // the .onlogout observer of the .watch() api.
          logout: function(callback) {
            if (this != document.pid)
              throw new Error("all document.pid calls must be made on the navigator.id object");
            // allocate iframe if it is not allocated
            //_open_hidden_iframe();
            // send logout message if the commChan exists
            //if (commChan) commChan.notify({
            //  method: 'logout'
            //});
            if (typeof callback === 'function') {
              warn('navigator.id.logout callback argument has been deprecated.');
              setTimeout(callback, 0);
            }
          },
          // get an assertion
          get: function(callback, passedOptions) {
            var opts = {};
            passedOptions = passedOptions || {};
            opts.privacyPolicy = passedOptions.privacyPolicy || undefined;
            opts.termsOfService = passedOptions.termsOfService || undefined;
            opts.privacyURL = passedOptions.privacyURL || undefined;
            opts.tosURL = passedOptions.tosURL || undefined;
            opts.siteName = passedOptions.siteName || undefined;
            opts.siteLogo = passedOptions.siteLogo || undefined;
            opts.backgroundColor = passedOptions.backgroundColor || undefined;
            opts.experimental_emailHint = passedOptions.experimental_emailHint || undefined;
            // api_called could have been set to getVerifiedEmail already
            api_called = api_called || "get";
            if (checkDeprecated(passedOptions, "silent")) {
              // Silent has been deprecated, do nothing.  Placing the check here
              // prevents the callback from being called twice, once with null and
              // once after internalWatch has been called.  See issue #1532
              if (callback) setTimeout(function() {
                callback(null);
              }, 0);
              return;
            }


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