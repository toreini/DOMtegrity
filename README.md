# DOMtegrity

## Overview
This project proposes a novel idea to ensure web page's source code integrity in presence of a malicious browser extension. Our solution does not need modifications to the browser engine, installing third-party softwares or use of external hardware tokens for such protection.

Here, we leveraged the new capabilities of JavaScript APIs and the homogenous architecture of browser extensions development in mainstream modern browsers. 

DOMtegrity is a cryptographic protocol to ensure web page's integrity. Our solution works by exploiting subtle differences between browser extensions and in-line JavaScript code in terms of their rights to access Websocket channels, as well as leveraging the latest Web Crypto API support added in modern browsers.

Detailed description of the protocol [here](https://toreini.github.io/projects/domtegrity.html).

## Setup

On the client side, all you need to do, is to embed the DOmtegrity source code inside <script> tag **__before__** any other HTML tags.

We developed DOMtegrity serverusing node.js. You just need to run the following command to set up the server.

> node domtegrity-server.js

The server is set listen to port 8080 by default.

When browsed to request index.html, DOMtegrity implemetation on the client side (a.k.a *pid.js*) will request a websocket connection from DOMtegrity server and requests secret key. 

The client has the option to start the verification process at anytime. They just need to call the following function:

> document.pid.request() 

Subsequently, the Page IDentifier (PID) is generated and its HMAC tag is transmitted to server for verification. The results could be *accept* in case of no malicious madifications and *reject* when an extension maliciously changed the web page.

This project is developed by Ehsan Toreini in Newcastle University.
