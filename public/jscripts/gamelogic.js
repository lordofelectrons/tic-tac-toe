const startGame = 'Game started';

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

function postRequest(record) {
  let data = new FormData();
  data.set('record', record);
  data.set('time', getTime());
  fetch('http://localhost:8082/step', { method: 'POST', body: data});
}

let startMes = function() {
  let data = new FormData();
  data.set('record', 'Game started');
  data.set('time', getTime());
  postRequest(data);
}

let stepMes = function(player, cell) {
  let record = {
    record : `${player} => ${cell.id}`,
    time : getTime()
  }
  console.log(record);
  postRequest(record);
}

let winMes = function(winner) {
  let record = {
    record : `${winner} has won`,
    time : getTime()
  }
  postRequest(record);
}

window.onload = function () {
    let turn = true;
    postRequest(startGame);
    let stop = false;

    document.getElementById('game').onclick = function(event) {
      if(!stop) {
        if (event.target.className.includes('gmblock') && event.target.innerHTML == "") {
          let player = '';
          if (turn) {
            player = 'X';
          }
          else {
            player = 'O';
          }
          let path = `/img/${player}.png`
          event.target.innerHTML = `<img src="${path}" alt="${player}">`
          postRequest(`${player} => ${cell.id}`);
          turn = !turn;

          if (wincheck()) {
            document.getElementById(`score${player}`).innerHTML = `${parseInt(document.getElementById(`score${player}`).innerHTML, 10) + 1}`;
            stop = true;
            postRequest(`${player} became a winner!`);
            alert(`Congratulations, ${player}! You are the winner.`);
          }
        }
      }
    }

    let wincheck = function() {
      for(let i = 1; i < 6; i++) {
        if(ifCombLine(i)) {
          return true;
        }
      }
      return ifCombDiag();
    }

    let ifCombLine = function(str) {
      let start1 = getInHTML(1, str);
      let start2 = getInHTML(str, 1);
      let hor = true; let vert = true;

      for(let i = 2; i < 6; i++) {
        if(getInHTML(i, str) != start1 || getInHTML(i, str) == '') {
          hor = false;
        }
        if(getInHTML(str, i) != start2 || getInHTML(str, i) == '') {
          vert = false;
        }
      }
      return hor || vert;
    }

    let ifCombDiag = function() {
      let start1 = getInHTML(1, 1);
      let start2 = getInHTML(1, 5);
      let fir = true; let sec = true;

      for(let i = 2; i < 6; i++) {
        if(getInHTML(i, i) != start1 || getInHTML(i, i) == '') {
          fir = false;
        }
        if(getInHTML(i, 6 - i) != start2 || getInHTML(i, 6 - i) == '') {
          sec = false;
        }
      }
      return fir || sec;
    }

    let getInHTML = function(i, j) {
      return document.getElementById(`c${i}${j}`).innerHTML;
    }

    document.getElementById('gamestart').onclick = function(event) {
      turn = true;
      stop = false;
      let cells = document.getElementById('game').childNodes;
      for (let cell of cells) {
          cell.innerHTML = '';
      }
      postRequest(startGame);
    };
}
