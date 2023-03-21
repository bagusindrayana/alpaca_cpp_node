const dotenv = require('dotenv');
dotenv.config();
//change this
const alpcaPath = process.env.COMMAND_PATH;
const alpcaModel = process.env.MODEL_PATH;


var express = require('express');
const app = express();
const port = 3000;

var spawn = require('child_process').spawn;
var cmd = spawn(alpcaPath + " -m " + alpcaModel, [], { shell: true });

var modelLoaded = false;
cmd.stdout.on('data', function (data) {
    process.stdout.write(`${data.toString()}`);
});

cmd.stderr.on('data', function (data) {
    //if model loaded and chat ready
    if(data.toString().indexOf("Running in chat mode") > -1){
        modelLoaded = true;
        console.log("model loaded .....");
    }
    process.stdout.write(`${data.toString()}`);
});

cmd.on('exit', function (code) {
    console.log('exit code: ' + code);
});



app.get('/', (req, res) => {
    if(modelLoaded){
        res.send('Model was loaded, you can start chatting /chat?prompt=Hello');
    } else {
        res.send('Model not loaded yet');
    }
    
});


var promptProcessed = false;
app.get('/chat', function(req, res){
    if(promptProcessed){
        cmd.stdin.write("\x03");
        promptProcessed = false;
    }
    const prompt = req.query.prompt;
    console.log(prompt);
    res.writeHead(200, { "Content-Type": "text/event-stream",
                         "Cache-control": "no-cache" });

    cmd.stdin.write(`${prompt}\n`);
    promptProcessed = true;
    var str = "";
    cmd.stdout.on('data', function (data) {
        var msg = data.toString();
        //remove  ANSI shell color codes
        msg = msg.replace(/\u001b\[[0-9]{1,2}m/g, "");
       

        if(data.toString().trim().endsWith(">")){
            console.log('done: '+msg);
            promptProcessed = false;
            res.end(str);

        } else {
            res.write(msg);
        }

        str += msg;
        
        
     
        
    });

    cmd.on('close', function (code) {
        console.log("close");
        res.end(str);
    });

    cmd.stderr.on('data', function (data) {
        res.end('stderr: ' + data);
    });
});


//stop the process
process.on('SIGINT', function() {
    console.log("Caught interrupt signal");
    cmd.kill('SIGINT');
});

process.on('exit', function() {
    console.log("Caught exit signal");
    cmd.kill('SIGINT');
});


app.listen(port, () => console.log(`Chat ai listening on port ${port}!`))