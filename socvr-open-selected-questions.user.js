// ==UserScript==
// @name         Open Multiple Question Links
// @namespace    http://roub.net/
// @version      0.9
// @description  open multiple selected unique question links, skipping non-questions
// @author       Paul Roub
// @contributor  Mogsdad
// @include      *://chat.stackoverflow.com/rooms/41570/so-close-vote-reviewers
// @include      *://chat.stackoverflow.com/search*
// @grant        GM_openInTab
// @run-at       context-menu
// ==/UserScript==

// tested on:
//   Chrome 45.0.2454.101 w/TamperMonkey 3.11
//   Firefox 41.0 w/GreaseMonkey 3.4.1

var isGm = false;

if (GM_info)
{
    scriptEngine = GM_info.scriptHandler ||  "greasemonkey";
    
    isGm = scriptEngine.toLowerCase() == "greasemonkey";
}

if (isGm)
{
    if ("contextMenu" in document.documentElement &&
      "HTMLMenuItemElement" in window)
    {
        var body = document.body;
        body.addEventListener("contextmenu", initMenu, false);

        var menu = body.appendChild(document.createElement("menu"));
        menu.outerHTML = '<menu id="userscript-open-questions" type="context">' +
            '<menuitem label="Open Selected Questions"></menuitem>' +
            '</menu>';

        document.querySelector("#userscript-open-questions menuitem")
        .addEventListener("click", openLinks, false);
    }
}
else
{
    openLinks();
}

function openLinks() {
    var qs = [];
    var sel = window.getSelection();

    if (sel && sel.rangeCount == 1)
    {
        var r = sel.getRangeAt(0);
        var d = document.createElement('div');
        d.appendChild(r.cloneContents());

        var as = d.getElementsByTagName('a');
        var unique = [];
        qs = Array.prototype.slice.call(as).filter( function(el) {
            var postRe = /stackoverflow\.com\/[aq](uestions)?\/\d/;
            if (el.href.match(postRe) && isVisible(el)) {
                var id = el.href.match(/\d+/)[0];
                if (unique.indexOf(id) == -1) {
                    unique.push(id);
                    return true;
                }
            }
            return false;
        } );
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
}


// GM specific

function initMenu(aEvent) {
  // Executed when user right click on web page body
  // aEvent.target is the element you right click on
    
  var node = aEvent.target;
  var item = document.querySelector("#userscript-open-questions menuitem");

    var sel = window.getSelection();

  if (sel && sel.rangeCount == 1)
  {
    body.setAttribute("contextmenu", "userscript-open-questions");
  }
  else 
  {
    body.removeAttribute("contextmenu");
  }
}

function isVisible(el) {
    return (el && el.offsetHeight);
}