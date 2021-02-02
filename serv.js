const express = require('express');
const app = express();
const formidable = require('formidable');
const crypto = require('crypto');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const url = require('url');
const querystring = require('querystring');
const sha256 = require('crypto-js/sha256');
const WebSocketServer = require('websocket').server;

const mongoURL = 'mongodb://localhost:27017/L5';
const mongoose = require('mongoose');
const Feedback = require('./packdatascripts/feedback');
const Gamelog = require('./packdatascripts/gamelog');
const User = require('./packdatascripts/user');

const secretKey = 'ThisServerTicTacToeKey';

const port = 8082;

const getTime = function() {
    let date = new Date();
    let time = "";
    time += date.getDate() + "." +
    (date.getMonth() + 1) + "." +
    date.getFullYear() + " (" + date.getHours() + ':' +
    (date.getMinutes().toString().length == 1 ? ("0" + date.getMinutes()) : date.getMinutes()) + ":" +
    (date.getSeconds().toString().length == 1 ? ("0" + date.getSeconds()) : date.getSeconds()) + ")";
    return time;
}

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect(mongoURL, { useNewUrlParser: true })
    .then(() => console.log("MongoDB successfully connected"))
    .catch(err => console.log(err));

app.get('/getGamelog', (req, res) => {
    Gamelog.find((err, logs) => {
        if (err) res.json({ message: err.message });
        res.json(logs);
    });
});

app.get('/getFeedback', (req, res) => {
    Feedback.find((err, logs) => {
        if (err) res.json({ message: err.message });
        res.json(logs);
    });
});

app.post('/feedback', (req, res) => {
    let form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
        let tempPath = files.Picture.path;
        let actualPath = 'savedimages/' + files.Picture.name;
        fs.copyFile(tempPath, `./public/${actualPath}`, (err) => {
            if (err) throw err;
            console.log(fields);
        });
        let newFeedback = new Feedback({
            _id: new mongoose.Types.ObjectId(),
            name: fields.Name,
            organization: fields.Organization,
            type: fields.Type,
            message: fields.Message,
            picture: `./${actualPath}`
        });

        newFeedback.save((err) => {
            if (err) res.json({ message: err.message });
            res.send('feedback inserted');
        })
    });
});

app.post('/step', (req, res) => {
  let form = new formidable.IncomingForm();
  form.parse(req, (err, fields) => {
    if(err) {
      console.log(`Error! ----- ${err}`);
    }
    else {
      console.log(fields.record);
      console.log(fields.time);
      let newStep = new Gamelog({
        _id: new mongoose.Types.ObjectId(),
        record: fields.record,
        time: fields.time
      });

      console.log(newStep);

      newStep.save((err) => {
        if (err) res.json({ message: err.message });
        res.send();
      });
    }
  });
});

app.post('/reg', (req, res) => {
  var form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
      console.log(fields);
      User.findOne({login: fields.login}).exec(function(err, user) {
        if (user) {
          res.status(400).send();
        }
        else {
          let actualPath = '';
          if(files.avatar) {
            let tempPath = files.avatar.path;
            actualPath = `savedimages/avatars/${sha256(fields.login).toString()}.${files.avatar.name.split('.')[1]}`;
            fs.copyFile(tempPath, `./public/${actualPath}`, (err) => {
                if (err) throw err;
                console.log(fields);
            });
          }
          else {
            actualPath = './img/defUser.png';
          }
          let newUser = new User({
              _id: new mongoose.Types.ObjectId(),
              login: fields.login,
              password: fields.password,
              avatar: `./${actualPath}`
          });
          newUser.save((err) => {
              if (err) {
                res.status(400).send();
              }
              else {
                res.send();
              }
          });
        }
      });
    });
});

let genNewTokens = function(login, password) {
  return [jwt.sign({login: login, password: password, exp: Math.floor(Date.now() / 1000) + (60 * 30)}, secretKey),
    jwt.sign({login: login, password: password, exp: Math.floor(Date.now() / 1000) + (60 * 60)}, secretKey)];
}

app.post('/login', (req, res) => {
  var form = new formidable.IncomingForm();
  form.parse(req, (err, fields, files) => {
    User.findOne({login: fields.login}).exec(function(err, user) {
      if (user && user.password === fields.password) {
        let tokensAccRef = genNewTokens(fields.login, fields.password);
        res.json([tokensAccRef[0], tokensAccRef[1], user.avatar]);
      }
      else {
        res.status(400).send();
      }
    });
  });
});

app.post('/tokenCheck', (req, res) => {
  var form = new formidable.IncomingForm();
  form.parse(req, (err, fields) => {
    checkCurrentTokens(fields.accToken, fields.refToken, (checkResult) => {
      console.log(checkResult);
      if(checkResult) {
        res.json(checkResult);
      }
      else {
        res.status(400).send();
      }
    });
  });
});

const checkCurrentTokens = function(accToken, refToken, callback) {
  let decoded = {};
  let accTokenNew = '';
  let refTokenNew = '';

  try {
    decoded = jwt.verify(accToken, secretKey);
  }
  catch {
    try {
      decoded = jwt.verify(refToken, secretKey);
      let newTokens = genNewTokens(decoded.login, decoded.password);
      accTokenNew = newTokens[0]; refTokenNew = newTokens[1];
    }
    catch {
      callback(null);
    }
  }
  User.findOne({login: decoded.login}).exec(function(err, user) {
    if (user && user.password === decoded.password) {
      let ans = {accToken: accTokenNew, refToken: refTokenNew, login: user.login, path: user.avatar};
      callback(ans);
    }
    else {
      callback(null);
    }
  });
}

app.use(express.static(`${__dirname}/client/public`));
app.listen(port, () => console.log(`Server running at ${port}!${'\n'}-----Server initialization time: ${getTime()}!-----`));

/*wsServer = new WebSocketServer({
  httpServer:app
});

wsServer.on('request', function(request) {
  var connection = request.accept(null, request.origin);
  // Это - самый важный для нас коллбэк, где обрабатываются
  // сообщения от клиента.
  connection.on('message', function(message) {
    console.log(message);
      // Обработаем сообщение WebSocket
  });

  connection.on('close', function(connection) {
    // Закрытие соединения
  });
});*/
