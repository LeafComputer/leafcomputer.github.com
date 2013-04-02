

importScripts('sjcl.js');


password = "";
plainFile = "";
cryptFile = "";

self.onmessage = function(event) {
    plainFile = event.data['data'] || undefined;
    password = event.data['password'] || undefined;

	if(plainFile == "")
	{
		Err("empty data received");
	}

    if (typeof(plainFile) != "string" || plainFile == "")
    {
        Err("File Data must be binary string!");
    }

    if (typeof(password) != "string")
    {
        Err("Password must be a string");
    }

    EncryptTheFile();
};

function Err(e) {
    postMessage({'status': 'error', 'message':e});
}

function MakeLog(e) {
    postMessage({'status': 'MakeLog', 'message':e});
}


function EncryptTheFile() {
    try {
        MakeLog("starting to encrypt file...");
        cryptFile = sjcl.encrypt(password, plainFile);
        MakeLog("encryption done!!");
    	postMessage({'status': 'ok', 'data':cryptFile});
    	MakeLog("File sent from worker to main script");
    } catch(err) {
        Err("Error on encryption: " + err.toString());
        return true;
    }
}
