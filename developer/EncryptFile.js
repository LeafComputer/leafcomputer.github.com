

importScripts('sjcl.js');

self.onmessage = function(event) {

	if(event.data['cmd'] == "encrypt")
	{
	postMessage({'status': 'CryptChunk', 'data': sjcl.encrypt(event.data['password'], event.data['chunk'])})
	}
	else if(event.data['cmd'] == "decrypt")
	{
	postMessage({'status': 'Chunk', 'data': DecryptTheFile(event.data['password'], event.data['chunk'])})
	}
}

function Err(e) {
    postMessage({'status': 'error', 'message':e});
}

function MakeLog(e) {
    postMessage({'status': 'debug', 'message':e});
}

function DecryptTheFile(password,inputFile) {
var outputFile;
    try {
        MakeLog("starting to decrypt file...");
        middleFile = sjcl.decrypt(password, inputFile);
        MakeLog("decryption done!!");
        MakeLog("Enconding...");
        outputFile = new Uint8Array(middleFile.length);
									for(i=0; i < outputFile.length;i++)
									{
										outputFile[i] = middleFile.charCodeAt(i);
									}
		MakeLog("Encoded");
	return outputFile;
    } catch(err) {
        Err("Error on decryption: " + err.toString());
        return false;
    }
}