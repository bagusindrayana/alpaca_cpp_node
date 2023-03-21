const dotenv = require('dotenv');
dotenv.config();
//change this
const alpcaPath = process.env.COMMAND_PATH;
const alpcaModel = process.env.MODEL_PATH;

var spawn = require('child_process').spawn;
var cmd = spawn(alpcaPath + " -m " + alpcaModel, [], { shell: true });

process.stdin.pipe(cmd.stdin);
cmd.stdout.on('data', function (data) {
    process.stdout.write(`${data.toString()}`);
});

cmd.stderr.on('data', function (data) {
    process.stdout.write(`${data.toString()}`);
});

cmd.on('exit', function (code) {
    console.log('exit code: ' + code);
});

process.on('SIGINT', function() {
    console.log("Caught interrupt signal");
    cmd.kill('SIGINT');
});

process.on('exit', function() {
    console.log("Caught exit signal");
    cmd.kill('SIGINT');
});