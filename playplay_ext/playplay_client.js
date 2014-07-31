/*
 * Copyright (C) 2013 Jeff Sharkey
 * http://jsharkey.org/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var buildMouseEvent = function(type) {
    var evt = document.createEvent("MouseEvents");
    evt.initMouseEvent(type, true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    return evt;
};

var buildWheelEvent = function(type, n) {
    var evt = document.createEvent("WheelEvent");
    evt.initWebKitWheelEvent(0, n, window, 0, 0, 0, 0, false, false, false, false);
    return evt;
};

var dispatchClick = function(element) {
    element.dispatchEvent(buildMouseEvent('mouseover'));
    element.dispatchEvent(buildMouseEvent('mousedown'));
    element.dispatchEvent(buildMouseEvent('click'));
    element.dispatchEvent(buildMouseEvent('mouseup'));
};

var dispatchWheel = function(element, n, c) {
    for (var i = 0; i < c; i++) {
        element.dispatchEvent(buildWheelEvent('mousewheel', n));
    }
};

function getElementWithAttr(attr, value) {
  var all = document.getElementsByTagName("*");
  for (var i = 0; i < all.length; i++) {
    if (all[i].getAttribute(attr) === value) {
      return all[i];
    }
  }
  return null;
}

// Use secure websockets.
var ws = new WebSocket('wss://localhost:6589');

ws.onmessage = function (event) {
    console.log("got event " + event.data);
    if (event.data == "playPause") {
        dispatchClick(getElementWithAttr("data-id", "play-pause"));
    } else if (event.data == "prevTrack") {
        dispatchClick(getElementWithAttr("data-id", "rewind"));
    } else if (event.data == "nextTrack") {
        dispatchClick(getElementWithAttr("data-id", "forward"));
    } else if (event.data == "volUp") {
        dispatchWheel(document.getElementById("vslider"), 120, 10);
    } else if (event.data == "volDown") {
        dispatchWheel(document.getElementById("vslider"), -120, 10);
    } else {
        console.log("unknown event " + event.data);
    }
};

