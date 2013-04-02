importScripts('sjcl.js');

self.addEventListener('message', function(e) {
	if(e.cmd == "encrypt")
	{
		self.postMessage(sjcl.encrypt(e.password, e.data));
	}
	else
	{
		self.postMessage(sjcl.decrypt(e.password, e.data));
	}
}, false);

