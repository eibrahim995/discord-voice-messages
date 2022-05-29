
chrome.runtime.onInstalled.addListener(() => {
    console.log('Application Installed');
    // var blob = new Blob([
    //     "(function(t){var s=Math.min,r=Math.max;var n=function(t,s,n){var r=n.length;for(var e=0;e<r;++e)t.setUint8(s+e,n.charCodeAt(e))};var e=function(e,n){this.sampleRate=e;this.numChannels=n;this.numSamples=0;this.dataViews=[]};e.prototype.encode=function(o){var e=o[0].length,i=this.numChannels,f=new DataView(new ArrayBuffer(e*i*2)),u=0;for(var n=0;n<e;++n)for(var t=0;t<i;++t){var a=o[t][n]*32767;f.setInt16(u,a<0?r(a,-32768):s(a,32767),true);u+=2}this.dataViews.push(f);this.numSamples+=e};e.prototype.finish=function(r){var t=this.numChannels*this.numSamples*2,e=new DataView(new ArrayBuffer(44));n(e,0,\"RIFF\");e.setUint32(4,36+t,true);n(e,8,\"WAVE\");n(e,12,\"fmt \");e.setUint32(16,16,true);e.setUint16(20,1,true);e.setUint16(22,this.numChannels,true);e.setUint32(24,this.sampleRate,true);e.setUint32(28,this.sampleRate*4,true);e.setUint16(32,this.numChannels*2,true);e.setUint16(34,16,true);n(e,36,\"data\");e.setUint32(40,t,true);this.dataViews.unshift(e);var s=new Blob(this.dataViews,{type:\"audio/wav\"});this.cleanup();return s};e.prototype.cancel=e.prototype.cleanup=function(){delete this.dataViews};t.WavAudioEncoder=e})(self);var sampleRate=44100,numChannels=2,options=undefined,maxBuffers=undefined,encoder=undefined,recBuffers=undefined,bufferCount=0;function error(e){self.postMessage({command:\"error\",message:\"wav: \"+e})}function init(e){sampleRate=e.config.sampleRate;numChannels=e.config.numChannels;options=e.options}function setOptions(e){if(encoder||recBuffers)error(\"cannot set options during recording\");else options=e}function start(e){maxBuffers=Math.ceil(options.timeLimit*sampleRate/e);if(options.encodeAfterRecord)recBuffers=[];else encoder=new WavAudioEncoder(sampleRate,numChannels)}function record(e){if(bufferCount++<maxBuffers)if(encoder)encoder.encode(e);else recBuffers.push(e);else self.postMessage({command:\"timeout\"})}function postProgress(e){self.postMessage({command:\"progress\",progress:e})}function finish(){if(recBuffers){postProgress(0);encoder=new WavAudioEncoder(sampleRate,numChannels);var e=Date.now()+options.progressInterval;while(recBuffers.length>0){encoder.encode(recBuffers.shift());var n=Date.now();if(n>e){postProgress((bufferCount-recBuffers.length)/bufferCount);e=n+options.progressInterval}}postProgress(1)}self.postMessage({command:\"complete\",blob:encoder.finish(options.wav.mimeType)});cleanup()}function cleanup(){encoder=recBuffers=undefined;bufferCount=0}self.onmessage=function(n){var e=n.data;switch(e.command){case\"init\":init(e);break;case\"options\":setOptions(e.options);break;case\"start\":start(e.bufferSize);break;case\"record\":record(e.buffer);break;case\"finish\":finish();break;case\"cancel\":cleanup()}};self.postMessage({command:\"loaded\"});"
    // ], { type: "text/javascript" })
    //
    // let worker = new Worker(window.URL.createObjectURL(blob));
    // console.log(worker)
});
// (function() {
//     'use strict';
//     var EXTENSION_ORIGIN = 'chrome-extension://' + chrome.runtime.id;
//     var MSG_GET_TOKEN = 'worker_proxy wants to get communication token';
//
//     if (location.origin == EXTENSION_ORIGIN) {
//         if (chrome.extension.getBackgroundPage &&
//             chrome.extension.getBackgroundPage() === window) {
//             chrome.runtime.onMessage.addListener(backgroundPageMessageHandler);
//         } else {
//             window.addEventListener('message', extensionProxyMessageHandler);
//         }
//     } else {
//         // Inside a content script
//         window.Worker = ContentScriptWorker;
//     }
//
//     // Background page-specific
//     function backgroundPageMessageHandler(message, sender, sendResponse) {
//         if (message === MSG_GET_TOKEN) {
//             sendResponse(getProxyWorkerChannelToken());
//         }
//     }
//
//     var worker_proxy_token;
//     /**
//      * Get the session token used to authenticate messages between the
//      * content script and worker proxy page. This value will change whenever the
//      * background/event page unloads.
//      */
//     function getProxyWorkerChannelToken() {
//         if (!worker_proxy_token) {
//             var buffer = new Uint8Array(100);
//             crypto.getRandomValues(buffer);
//             var random_token = '';
//             for (var i = 0; i < buffer.length; ++i) {
//                 random_token += buffer[i].toString(36);
//             }
//             worker_proxy_token = random_token;
//         }
//         return worker_proxy_token;
//     }
//
//     // Worker-proxy specific
//
//     /**
//      * Spawn a worker.
//      *
//      * @param {MessagePort} messagePort  Messages received on this port will be
//      *                                   sent to the Worker and vice versa.
//      * @param {MessagePort} metadataPort  Port used for sending internal data
//      *                                    such as error events.
//      * @param {string} url  URL of Web worker (relative to the location of
//      *                      the HTML file that embeds this script).
//      */
//     function createWorker(messagePort, metadataPort, url) {
//         var worker = new Worker(url);
//         worker.onmessage = function(event) {
//             messagePort.postMessage(event.data);
//         };
//         worker.onerror = function(event) {
//             metadataPort.postMessage({
//                 type: 'error',
//                 errorDetails: {
//                     message: event.message,
//                     filename: event.filename,
//                     lineno: event.lineno,
//                     colno: event.colno,
//                 }
//             });
//         };
//         metadataPort.onmessage = function(event) {
//             if (event.data.type == 'terminate') {
//                 worker.terminate();
//                 messagePort.close();
//                 metadataPort.close();
//             }
//         };
//         messagePort.onmessage = function(event) {
//             worker.postMessage(event.data);
//         };
//         metadataPort.start();
//         messagePort.start();
//     }
//
//     function extensionProxyMessageHandler(event) {
//         if (!event.data || !event.data.channel_token) {
//             return;
//         }
//         chrome.runtime.sendMessage(MSG_GET_TOKEN, function(token) {
//             if (!token || event.data.channel_token !== token) {
//                 console.error('Auth failed, refused to create Worker channel.');
//                 return;
//             }
//             createWorker(event.ports[0], event.ports[1], event.data.worker_url);
//         });
//     }
//
//     // Content-script specific
//     var proxyFrame;
//     var proxyFrameMessageQueue = [];
//     var proxyFrameReady = false;
//     /**
//      * Post a message to the worker proxy frame.
//      *
//      * @param {object} message  Message to post.
//      * @param {array|undefined} transferable  List of transferable objects.
//      */
//     function postMessageToWorkerProxy(message, transferables) {
//         proxyFrameMessageQueue.push([message, transferables]);
//
//         if (!proxyFrame) {
//             loadFrameAndFlush();
//         } else if (proxyFrameReady) {
//             chrome.runtime.sendMessage(MSG_GET_TOKEN, function(token) {
//                 if (typeof token != 'string') {
//                     // This message is different from the message below, because
//                     // failure to get a message for the first time is probably
//                     // caused by a developer error. If the first load succeeded
//                     // and the later token requests fail again, then either of
//                     // the following happened:
//                     // 1. The extension runtime was reloaded (e.g. by an update,
//                     //    or by pressing Ctrl + R at chrome://extensions, or
//                     //    by calling chrome.runtime.reload()) (most likely).
//                     // 2. The extension developer messed with the message
//                     //    handling and the first message only succeeded by
//                     //    coincidence.
//                     // 3. A bug in Chrome was introduced (least likely).
//                     console.warn('Failed to initialize Worker because of a ' +
//                             'missing session token. Is the extension runtime ' +
//                             'still valid?');
//                     return;
//                 }
//                 flushMessages(token);
//             });
//         } // else wait until proxyFrame.onload fires.
//
//         function loadFrameAndFlush() {
//             proxyFrameReady = false;
//             proxyFrame = document.createElement('iframe');
//             proxyFrame.src = chrome.runtime.getURL('worker_proxy.html');
//             proxyFrame.style.cssText = 'position:fixed!important;' +
//                                        'top:-99px!important;' +
//                                        'left:-99px!important;' +
//                                        'width:2px!important;' +
//                                        'height:2px!important;' +
//                                        'border:0!important';
//             proxyFrame.onload = function() {
//                 chrome.runtime.sendMessage(MSG_GET_TOKEN, function(token) {
//                     if (typeof token != 'string') {
//                         console.warn(
//                             'Refused to initialize Web Worker because a ' +
//                             'session token could not be negotiated. Make sure' +
//                             'that worker_proxy.js is loaded first in the ' +
//                             'background or event page.');
//                         return;
//                     }
//                     proxyFrameReady = true;
//                     flushMessages(token);
//                 });
//             };
//             (document.body || document.documentElement).appendChild(proxyFrame);
//         }
//
//         function flushMessages(token) {
//             var contentWindow = proxyFrame.contentWindow;
//             if (!contentWindow) {
//                 // This should NEVER happen. When it happens, try to recover by
//                 // creating the frame again, so that new Workers can be created.
//                 console.warn('WARNING: The worker proxy frame was removed; ' +
//                              'all previous workers have been terminated. ');
//                 loadFrameAndFlush();
//                 return;
//             }
//             while (proxyFrameMessageQueue.length) {
//                 // data = [message, transferables]
//                 var data = proxyFrameMessageQueue.shift();
//                 data[0].channel_token = token;
//                 contentWindow.postMessage(data[0], EXTENSION_ORIGIN, data[1]);
//             }
//         }
//     }
//
//     function ContentScriptWorker(url) {
//         if (!url) {
//             throw new TypeError('Not enough arguments');
//         }
//         var messageChannel = new MessageChannel();
//         var metadataChannel = new MessageChannel();
//         // MessagePort implements EventTarget, onmessage and postMessage, these
//         // events will be received by the other end and passed to the Worker.
//         var fakeWorker = messageChannel.port1;
//         fakeWorker.terminate = function() {
//             metadataChannel.port1.postMessage({
//                 type: 'terminate'
//             });
//         };
//
//         metadataChannel.port1.onmessage = function(event) {
//             if (event.data.type == 'error') {
//                 var error = new ErrorEvent('error', event.data.errorDetails);
//                 fakeWorker.dispatchEvent(error);
//                 if (typeof fakeWorker.onerror == 'function') {
//                     fakeWorker.onerror(error);
//                 }
//             }
//         };
//
//         messageChannel.port1.start();
//         metadataChannel.port1.start();
//
//         postMessageToWorkerProxy({
//             worker_url: url
//         }, [
//             messageChannel.port2,
//             metadataChannel.port2
//         ]);
//
//         // Hide the MessagePort methods from the exposed API.
//         fakeWorker.close = fakeWorker.start = undefined;
//         return fakeWorker;
//     }
// })();