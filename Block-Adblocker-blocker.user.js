// ==UserScript==
// @name        Block-Adblocker-blocker
// @namespace   http://www.piyushsoni.com
// @description Blocks Anti-adblockers on several Indian News Sites
// @include     http://timesofindia.indiatimes.com/*
// @include     http://www.hindustantimes.com/*
// @include     http://*.ndtv.com/*
// @run-at		document-start
// @version     1.10
// @grant       none
// @author		Piyush Soni (irrationalapps+blockerblocker@gmail.com)
// @license		GNU LGPL v3 (https://www.gnu.org/licenses/lgpl-3.0.html)
// ==/UserScript==

var url = window.location.href.toLowerCase();
var domain = new URL(url).hostname.replace("www.","");
var mapPagesBlockerBlockers = {};
var countStopped = 0;
var countToCheck = 0;
var inlineBlocker = new String("");
var externalBlocker = new String("");


//Add new blocker list here
///mapPagesBlockerBlockers['<domain>'] = ['<external script source match>','<inline script source match>', <stop any 1 r more(count)>]
mapPagesBlockerBlockers['indiatimes.com'] = ['detector/minify-1.cms', 'blocked.cms', 1];
mapPagesBlockerBlockers['hindustantimes.com'] = ['BlockerScript', 'checkAdBlocker', 2];
mapPagesBlockerBlockers['ndtv.com'] = ['', 'canRunAds', 1];



var arrDomain = domain.split('.');
if(arrDomain.length > 2)
	domain = arrDomain[arrDomain.length - 2] + "." + arrDomain[arrDomain.length - 1];

function scriptListener(e)
{
	let src = e.target.src;
	if ((src && externalBlocker.length > 0 && src.indexOf(externalBlocker) >= 0) || (inlineBlocker.length > 0 && e.target.innerHTML.indexOf(inlineBlocker) >= 0)) 
	{
		//Stop this nonsense. 
		e.preventDefault();
		e.stopPropagation();
		
		console.log("Blocked an Anti-adblocker for " + domain);

		countStopped++;
		if(countStopped >= countToCheck)
		{
			//We're done, remove the event listener now
			window.removeEventListener(e.type, arguments.callee, true);
		}
	}
}

if(domain in mapPagesBlockerBlockers)
{
	externalBlocker = mapPagesBlockerBlockers[domain][0];
	inlineBlocker = mapPagesBlockerBlockers[domain][1];
	countToCheck = mapPagesBlockerBlockers[domain][2];	
	window.addEventListener('beforescriptexecute', scriptListener, true);
}
