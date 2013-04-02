

importScripts('sjcl.js');


password = "";
inputFile = "";
outputFile = "";

self.onmessage = function(event) {
    inputFile = event.data['data'] || undefined;
    password = event.data['password'] || undefined;

	if(inputFile == "")
	{
		Err("empty data received");
	}

    if (typeof(inputFile) != "string" || inputFile == "")
    {
        Err("File Data must be binary string! (and an encrypted string in case of decryption)");
    }

    if (typeof(password) != "string")
    {
        Err("Password must be a string");
    }
	if(event.data['cmd'] == "encrypt")
	{
    	EncryptTheFile();
    }
    else
    {
    	DecryptTheFile();
    }
};

function Err(e) {
    postMessage({'status': 'error', 'message':e});
}

function MakeLog(e) {
    postMessage({'status': 'debug', 'message':e});
}


function EncryptTheFile() {
    try {
        MakeLog("starting to encrypt file...");
        outputFile = sjcl.encrypt(password, inputFile);
        MakeLog("encryption done!!");
    	postMessage({'status': 'ok', 'data':outputFile});
    	MakeLog("File sent from worker to main script");
    } catch(err) {
        Err("Error on encryption: " + err.toString());
        return true;
    }
}

function DecryptTheFile() {
    try {
        MakeLog("starting to decrypt file...");
        outputFile = sjcl.decrypt(password, inputFile);
        MakeLog("decryption done!!");
    	postMessage({'status': 'ok', 'data':outputFile});
    	MakeLog("File sent from worker to main script");
    } catch(err) {
        Err("Error on decryption: " + err.toString());
        return true;
    }
}
