import React from "react";
import './css/index.css';
import RegLog from "./RegLog";

const altText = "It`s impossible to load this image!";

class Help extends React.Component {
  constructor() {
    super();
    this.state = {
      login: '',
      avatar: '',
      isSigned: false
    }
    this.topLine = React.createRef();
  }

  updateLoggedUser = (login, avatar, isSigned) => {
    this.setState({login: login, avatar: avatar, isSigned: isSigned});
  }

  render() {
      return (
        <div>
          <div className = "buttop" id="topLine" ref={this.topLine}>
            <img id="leftimage" src="img/top.png" alt={altText}/>
            <font id = "ttl">Help</font>
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
            </div>
            <div className = "infoblock">
              <font><p>This game is a digital version of famous tic-tac-toe. You can choose your opponent (Computer or other player). Also
              this program allows you to count win points. With any questions and offers please <a href="Contacts.html">contact</a> us.</p></font>
              <font><p>To get more info I recommend you to visit our official site www.reciprocity.com By gamers for gamers!</p></font>
              <font><u><i>To get full experience we recommend you to watch this inspirable movie about tic-tac-toe game!</i></u></font>
              <br/>
              <video height="200" controls="controls">
                <source src="img/смерть.mp4"/>
              </video>
            </div>
          </div>
        </div>
      );
    }
}
export default Help;
