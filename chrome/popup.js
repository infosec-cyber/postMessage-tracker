var port = chrome.extension.connect({
	name: "Sample Communication"
});


function loaded() {
	port.postMessage("get-stuff");
	port.onMessage.addListener(function(msg) {
		console.log("message recieved yea: ", msg);
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			selectedId = tabs[0].id;
			listListeners(msg.listeners[selectedId]);
		});
	});
}

window.onload = loaded
//addEventListener('DOMContentLoaded', loaded);

function buttonClick(event) {
		chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
			selectedId = tabs[0].id;
			chrome.tabs.sendMessage(selectedId, {
				hops: event.target.hops,
				stack: event.target.stack
			});
		});
}

function listListeners(listeners) {
	var x = document.getElementById('x');
	x.parentElement.removeChild(x);
	x = document.createElement('ol');
	x.id = 'x';
	document.getElementById('h').innerText = listeners.length ? listeners[0].parent_url : '';

	for(var i = 0; i < listeners.length; i++) {

			listener = listeners[i]
			el = document.createElement('li');

			bel = document.createElement('b');
			bel.innerText = listener.domain + ' ';
			win = document.createElement('code');
			win.innerText = ' ' + (listener.window ? listener.window + ' ' : '') + (listener.hops && listener.hops.length ? listener.hops : '');
			el.appendChild(bel);
			el.appendChild(win);

			sel = document.createElement('span');
			if (listener.fullstack) sel.setAttribute('title', listener.fullstack.join("\n\n"));
			seltxt = document.createTextNode(listener.stack);

			sel.appendChild(seltxt);
			el.appendChild(sel);

			pel = document.createElement('pre');
			pel.innerText = listener.listener;
			el.appendChild(pel);

			btn = document.createElement('button');
			btn.innerText = 'Invoke';
			btn.id="button-" + i;
			btn.hops=listener.hops;
			btn.stack=listener.stack;
			btn.onclick = buttonClick;
			el.appendChild(btn);

			x.appendChild(el);
	}
	document.getElementById('content').appendChild(x);
	/*setTimeout(function() {
		document.body.style.display = 'block';
	}, 150);*/
}