

importScripts('sjcl.js');


password = "";
inputFile = "";
outputFile = "";
middleFile = "";
Place = 0;
toEncrypt = undefined;

self.onmessage = function(event) {
	
	if(event.data['cmd'] == "encrypt" || event.data['cmd'] == "decrypt")
	{
    password = event.data['password'] || undefined;

    if (typeof(password) != "string")
    {
        Err("Password must be a string");
    }
    
	if(event.data['cmd'] == "encrypt")
	{
    	toEncrypt = true;
    	MakeLog("Going to encrypt soon...");
    }
    else
    {
    	toEncrypt = false;
    	TheFiletype = event.data['Type'];
    	MakeLog("Going to decrypt soon...");
    }
    postMessage({'status': 'more data'});
    }
    else if(event.data['cmd'] == "more data")
    {
    	SendChunk();
    }
    else if(event.data['cmd'] == "Chunk")
    {
    	if(event.data['data'] != "")
    	{
    		inputFile += event.data['data'];
    		postMessage({'status': 'more data'});
    	}
    	else
    	{
    		if(toEncrypt)
    		{
    			EncryptTheFile();
    		}
    		else
    		{
    			DecryptTheFile();
    		}
    	}
    }
}

function Err(e) {
    postMessage({'status': 'error', 'message':e});
}

function MakeLog(e) {
    postMessage({'status': 'debug', 'message':e});
}


function SendChunk()
{
MakeLog(typeof outputFile);
if((typeof outputFile) == "string")
{
postMessage({'status': 'CryptChunk', 'data':outputFile.substring(Place*100000,(Place+1)*100000)});
}
else
{
postMessage({'status': 'CryptChunk', 'data':outputFile.subarray(Place*100000,(Place+1)*100000),'Place': Place});
}
Place++;
}

function EncryptTheFile() {
    try {
        MakeLog("starting to encrypt file...");
        outputFile = sjcl.encrypt(password, inputFile);
        MakeLog("encryption done!!");
        postMessage({'status': 'begin', 'data':outputFile.length});
    	MakeLog("File sent from worker to main script");
    } catch(err) {
        Err("Error on encryption: " + err.toString());
        return true;
    }
}

function DecryptTheFile() {
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
		TheFileBlob = new Blob([outputFile],{type: TheFiletype});
    	postMessage({'status': 'ok', 'data':TheFileBlob},[TheFileBlob]);
    	MakeLog("File sent from worker to main script");
    } catch(err) {
        Err("Error on decryption: " + err.toString());
        return true;
    }
}
