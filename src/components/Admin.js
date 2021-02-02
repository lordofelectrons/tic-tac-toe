import React from "react";
import './css/index.css';

const altText = "It`s impossible to load this image!";

class Admin extends React.Component {
  handleClick(event) {
    event.preventDefault();
    let html = '';
    if(event.target.id === "feedbackLog") {
      fetch('http://localhost:8082/getFeedback')
        .then(response => response.json())
        .then((jsonData) => {
            for (let record of jsonData) {
                html += `<div id=oneRecord${record['id']} class="oneRecord">`;
                html += `<div>`;
                for (let value in record) {
                    if (value !== "picture" && value !== "__v" && record[value] !== undefined) {
                        html += `<font><b>${value}</b> - ${record[value]}</font>`;
                    }
                    else if (value === "picture" && record[value] !== undefined) {
                      html += `</div>`;
                      html += `<div>`;
                      html += `<img class="image" src="${record['picture']}" alt="image${record['id']}/">`;
                      html += `</div>`;
                    }
                }
                html += "</div>";
            }
            document.getElementById("logspace").innerHTML = html;
        })
    }
    else if(event.target.id === "gameLog") {
      fetch('http://localhost:8082/getGamelog')
        .then(response => response.json())
        .then((jsonData) => {
          let iter = 0;
          for (let record of jsonData) {
              html += `<div id=record${iter} class="oneRecord">`;
              html += `<font>id - ${record._id}</font>`;
              html += `<font>time - ${record.time}</font>`;
              html += `<font>step - ${record['record']}</font>`;
              html += "</div>";
              iter++;
          }
          document.getElementById("logspace").innerHTML = html;
        })
    }
  }

  render() {
      return (
        <div>
          <div className = "buttop">
            <img src = "img/top.png" alt={altText}/>
            <font id = "ttl">Admin</font>
            <div id = "rightup">
              <img id = "rightimg" src = "img/2000px-Tic_tac_toe.png" alt={altText}/>
            </div>
          </div>
          <div className = "main">
            <div id = "butblock" className="admButBlock">
              <a href = "/" className = "but"><font>Main</font></a>
              <input id = "feedbackLog" type = "button" onClick={this.handleClick} className = "but" value="FBLog"/>
              <input id = "gameLog" type = "button" onClick={this.handleClick} className = "but" value="GameLog"/>
            </div>
            <div id = "logspace">

            </div>
          </div>
        </div>
      );
    }
  }
export default Admin;
