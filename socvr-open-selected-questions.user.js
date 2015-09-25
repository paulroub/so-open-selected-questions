// ==UserScript==
// @name         Open Multiple Question Links
// @namespace    http://roub.net/
// @version      0.2
// @description  Open multiple selected links, skipping non-questions. Currently Tampermonkey-only.
// @author       Paul Roub
// @include      *://chat.stackoverflow.com/rooms/41570/so-close-vote-reviewers
// @grant        GM_openInTab
// @run-at       context-menu
// ==/UserScript==

var qs = [];
var sel = window.getSelection();

if (sel && sel.rangeCount == 1)
{
  var r = sel.getRangeAt(0);
  var d = document.createElement('div');
  d.appendChild(r.cloneContents());

  var as = d.getElementsByTagName('a');
  qs = Array.prototype.slice.call(as).filter( function(el) { return el.href.match(/stackoverflow\.com\/q\/\d/); } );
}

if (qs.length)
{    
  qs.forEach(
    function(el) {
      GM_openInTab(el.href, true);
    }
  );
}
else
  alert("No questions were selected.");
