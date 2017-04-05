/*
HackPi


TODO:
- Add mass Wifi Jamming
- Add mass WPSPixie/WEP hacking
- Add RogueAP setup
- karma for RogueAP
- Add Bluetooth scanning + jacking
- Add Interface Bridging
- Login to Web Console
- Security?
- System Info
- Reboot functions
- Shutdown (kill all processes related to HackPi and close main NodeJS)
- Hostapd clients connected
- Interface identification
- Commandline
- Process killing (HackPi related)
*/

var os = require('os');
var wifi = require('wifi');
var express = require('express');
const colors = require('colors');
var app = express();
var https = require('https')
var fs = require('fs');
var auth = require('basic-auth');
var config = require(__dirname + '/config/config.json')
var port = 1337;
var ttyport = 13370;
var options = {
    key: fs.readFileSync(__dirname + '/ssl/server.key'),
    cert: fs.readFileSync(__dirname + '/ssl/server.cert')
};

var tty = require('tty.js');

var ttyapp = tty.createServer({
  shell: 'bash',
  users: {
    HackPi: ''
  },
	cwd: ".",
	localOnly: false,
	https: {
		key: __dirname + "/ssl/server.key",
		cert: __dirname + "/ssl/server.cert"
	},
  port: ttyport //change this?
});

ttyapp.listen()


/*
const mysql = require('mysql');
var sql = mysql.createConnection({host: 'localhost', user: 'root', password: 'mypass', database: 'mydb'});

//Prevents MySQL Database from dying
setInterval(function() {
    sql.query('SELECT 1');
}, 10000);

*/
//Logging functions
var log = {
    error: function(data) {
        var date = new Date();
        console.log('ERROR'.red, data);
    },
    info: function(data) {
        var date = new Date();
        console.log('INFO'.green, data);
    },
    warn: function(data) {
        var date = new Date();
        console.log('WARN'.yellow, data);
    },
    debug: function(data) {
        console.log('DEBUG'.blue, data);
    }
}

//Functions
function GetInterfaceInfo(){

}

function GetUptime(){

}

function ListHostapdClients(){
  
}

var server = https.createServer(options, app).listen(port, function() {
    log.info("Express server listening on port " + port);
});

//SOCKET.IO INIT
var io = require('socket.io')(server) //CHANGE TO SECURE LATER

app.use(express.static(__dirname + '/web'));

app.get('/', function(req, res) {
    log.debug(req.connection.remoteAddress + " GET /")
    res.sendFile('web/index.html');
});

/*
//HTTP AUTH EXAMPLE
app.get('/auth', function(req, res) {
    var credentials = auth(req)
    if (!credentials || credentials.name !== 'username' || credentials.pass !== 'password') {
      res.statusCode = 401
      res.setHeader('WWW-Authenticate', 'Basic realm="auth"')
      res.end('Access denied')
    } else {
      log.debug(req.connection.remoteAddress + " GET /auth")
      res.sendFile('files');
  }
});
*/

//Custom 404
app.use(function(req, res) {
    res.send('404: Page not Found').status(404);
    log.warn(req.connection.remoteAddress + " [404] GET " + req.url)
});

io.on('connection', function(socket, next) {
    log.info(socket.handshake.address + " has connected.")
		
	socket.on('disconnect', function(){
		log.warn(socket.handshake.address + " has disconnected.")
	})
	
})
