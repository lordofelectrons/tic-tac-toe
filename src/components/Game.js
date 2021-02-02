import React from "react";
import './css/index.css';
import RegLog from "./RegLog";

const altText = "It`s impossible to load this image!";

let getTime = function() {
  let date = new Date();
  let time = "";
  time += date.getDate() + "." +
    (date.getMonth() + 1) + "." +
    date.getFullYear() + " (" + date.getHours() + ':' +
    (date.getMinutes().toString().length == 1 ? ("0" + date.getMinutes()) : date.getMinutes()) + ":" +
    (date.getSeconds().toString().length == 1 ? ("0" + date.getSeconds()) : date.getSeconds()) + ")";
  return time;
}

/*const socket = new WebSocket('ws://localhost:8082/');

socket.addEventListener('open', function (event) {
    socket.send('Hello Server!');
});

socket.addEventListener('message', function (event) {
    console.log('Message from server ', event.data);
});*/

class Game extends React.Component {
  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      login: '',
      avatar: '',
      isSigned: false,
      inOnlineGame: false,
      enemyLogin: '',
      enemyAvat: '',
      targPress: this.handleClick
    }
    this.topLine = React.createRef();
    this.updateLoggedUser = this.updateLoggedUser.bind(this);
    this.newGame = this.newGame.bind(this);
    this.startOnline = this.startOnline.bind(this);
    this.yourStep = this.yourStep.bind(this);

    this.turn = true;
    this.stop = false;

    this.winCheck = function() {
      for(let i = 1; i < 6; i++) {
        if(this.ifCombLine(i)) {
          return true;
        }
      }
      return this.ifCombDiag();
    }

    this.noOneCheck = function() {
      for(let i = 1; i < 6; i++) {
        for(let j = 1; j < 6; j++) {
          if(this.getInHTML(i, j) === '') {
            return false;
          }
        }
      }
      return true;
    }

    this.ifCombLine = function(str) {
      let start1 = this.getInHTML(1, str);
      let start2 = this.getInHTML(str, 1);
      let hor = true; let vert = true;

      for(let i = 2; i < 6; i++) {
        if(this.getInHTML(i, str) != start1 || this.getInHTML(i, str) == '') {
          hor = false;
        }
        if(this.getInHTML(str, i) != start2 || this.getInHTML(str, i) == '') {
          vert = false;
        }
      }
      return hor || vert;
    }

    this.ifCombDiag = function() {
      let start1 = this.getInHTML(1, 1);
      let start2 = this.getInHTML(1, 5);
      let fir = true; let sec = true;

      for(let i = 2; i < 6; i++) {
        if(this.getInHTML(i, i) != start1 || this.getInHTML(i, i) == '') {
          fir = false;
        }
        if(this.getInHTML(i, 6 - i) != start2 || this.getInHTML(i, 6 - i) == '') {
          sec = false;
        }
      }
      return fir || sec;
    }

    this.getInHTML = function(i, j) {
      return this.refs[`c${i}${j}`].innerHTML;
    }

    this.postReqLocal = function(record) {
      const data = new FormData();
      data.append('record', record);
      data.append('time', getTime());
      fetch('http://localhost:8082/step', { method: 'POST', body: data});
    }

    this.postReqLocal('Local game Started!');
  }

  componentDidUpdate() {
    this.refs.searchStart.style.display = this.state.isSigned ? 'inline-block' : 'none';
    this.refs.enemy.style.display = this.state.inOnlineGame ? 'inline-block' : 'none';
  }

  componentDidMount() {
    this.refs.searchStart.style.display = this.state.isSigned ? 'inline-block' : 'none';
    this.refs.enemy.style.display = this.state.inOnlineGame ? 'inline-block' : 'none';
  }

  updateLoggedUser = (login, avatar, isSigned) => {
    this.setState({login: login, avatar: avatar, isSigned: isSigned});
  }

  newGame() {
    this.turn = true;
    this.stop = false;
    let cells = this.refs.board.childNodes;
    for (let cell of cells) {
        cell.innerHTML = '';
    }
  }

  handleClick(event) {
    if(!this.stop) {
      if (event.target.innerHTML == "") {
        let player = '';
        if (this.turn) {
          player = 'X';
        }
        else {
          player = 'O';
        }
        let path = `/img/${player}.png`
        event.target.innerHTML = `<img src="${path}" alt="${player}">`
        this.postReqLocal(`Local Step: ${player} => ${event.target.id}`);
        this.turn = !this.turn;

        if (this.winCheck()) {
          this.refs[`score${player}`].innerHTML = `${parseInt(this.refs[`score${player}`].innerHTML, 10) + 1}`;
          this.stop = true;
          this.postReqLocal(`${player} became a winner!`);
          alert(`Congratulations, ${player}! You are the winner.`);
        }
        if (this.noOneCheck()) {
          this.postReqLocal(`It's a draw.`);
          this.refs[`score00`].innerHTML = `${parseInt(this.refs[`score00`].innerHTML, 10) + 1}`;
          alert(`Expectedly, it's a draw.`);
        }
      }
    }
  }

  startOnline() {
    /*this.setState({targPress: this.yourStep});
    const data = new FormData();
    data.append('login', this.state.login);
    data.append('avatar', this.state.avatar);
    socket.send('mes');*/
  }

  yourStep(event) {

  }

  render() {
      return (
        <div>
          <div className = "buttop" id="topLine" ref={this.topLine}>
            <img id="leftimage" src="img/top.png" alt={altText}/>
            <font id = "ttl">Game</font>
            <div id = "rightup">
              <RegLog updateLoggedUser={this.updateLoggedUser} topLine={this.topLine}/>
            </div>
          </div>
          <div className = "main">
            <div id="leftBar">
              <div className="admButBlock">
                  <a href = "/" className = "but"><font>Game</font></a>
                  <a href = "/help" className = "but"><font>Help</font></a>
                  <a href = "/about_us" className = "but"><font>About us</font></a>
                  <a href = "/contacts" className = "but" id="lastElem"><font>Contacts</font></a>
              </div>
              <div id = "results">
                <div id = "resavatar">
                  <img src="img/logo-head.png" alt={altText}/>
                  <font ref = "scoreX" className = "resfont">0</font>
                </div>
                <div id = "resavatar">
                  <img src="img/gomer.png" alt={altText}/>
                  <font ref = "scoreO" className = "resfont">0</font>
                </div>
                <div id = "resavatar">
                  <img src="img/00.png" alt={altText}/>
                  <font ref = "score00" className = "resfont">0</font>
                </div>
              </div>
              <div id = "enemy" ref='enemy'>
                <div className = "enfont">Your Enemy:</div>
                <div id="someTag">
                  <img id="enemyavatar" src={this.state.enemyAvat} alt={altText}/>
                  <font className = "enfont">{this.state.enemyLogin}</font>
                </div>
              </div>
            </div>
            <div id = "game" onClick={this.state.targPress} ref='board'>
              <div ref="c11" id="c11" className = "gmblock top left"></div>
              <div ref="c12" id="c12" className = "gmblock top"></div>
              <div ref="c13" id="c13" className = "gmblock top"></div>
              <div ref="c14" id="c14" className = "gmblock top"></div>
              <div ref="c15" id="c15" className = "gmblock top right"></div>
              <div ref="c21" id="c21" className = "gmblock left"></div>
              <div ref="c22" id="c22" className = "gmblock"></div>
              <div ref="c23" id="c23" className = "gmblock"></div>
              <div ref="c24" id="c24" className = "gmblock"></div>
              <div ref="c25" id="c25" className = "gmblock right"></div>
              <div ref="c31" id="c31" className = "gmblock left"></div>
              <div ref="c32" id="c32" className = "gmblock"></div>
              <div ref="c33" id="c33" className = "gmblock"></div>
              <div ref="c34" id="c34" className = "gmblock"></div>
              <div ref="c35" id="c35" className = "gmblock right"></div>
              <div ref="c41" id="c41" className = "gmblock left"></div>
              <div ref="c42" id="c42" className = "gmblock"></div>
              <div ref="c43" id="c43" className = "gmblock"></div>
              <div ref="c44" id="c44" className = "gmblock"></div>
              <div ref="c45" id="c45" className = "gmblock right"></div>
              <div ref="c51" id="c51" className = "gmblock bottom left"></div>
              <div ref="c52" id="c52" className = "gmblock bottom"></div>
              <div ref="c53" id="c53" className = "gmblock bottom"></div>
              <div ref="c54" id="c54" className = "gmblock bottom"></div>
              <div ref="c55" id="c55" className = "gmblock bottom right"></div>
            </div>
          </div>
          <div id = "gamestart">
            <input type = "button" ref='newGame' onClick={this.newGame} className = "butGame" value="New Game"/>
            <input type = "button" ref='searchStart' onClick={this.startOnline} className = "butGame" value="Start online!" hidden={!this.state.isSigned}/>
          </div>
        </div>
      );
  }
}
export default Game;
