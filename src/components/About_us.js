import React from "react";
import './css/index.css';
import RegLog from "./RegLog";

const altText = "It`s impossible to load this image!";

class About_us extends React.Component {
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
            <font id = "ttl">About us</font>
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
              <font>We are a very small group of game developers. There is only me in this group.</font>
              <img src="img/Xz18Q7oD-CY.jpg" alt={altText}/>
              <font>To get more info I recommend you to visit our official site www.reciprocity.com By gamers for gamers!</font>
            </div>
          </div>
        </div>
      );
    }
}
export default About_us;
