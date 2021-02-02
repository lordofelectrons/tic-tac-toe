import React from "react";
import './css/index.css';
import Feedback from "./Feedback";
import RegLog from "./RegLog";

const altText = "It`s impossible to load this image!";

class Contacts extends React.Component {
  constructor() {
    super();
    this.state = {
      Name: '',
      Organization: '',
      Type: '',
      Message: '',
      Picture: '',
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
            <font id = "ttl">Contacts</font>
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
            <div className = "contactblock">
              <div id = "contact">
                <img height="20" width="20" src="img/tlf.jpg" alt={altText}/><font><b> Mobile numbers:</b></font>
                <ul>
                  <font><li>+380683627521</li></font>
                  <font><li>+380954152346</li></font>
                </ul>
              </div>
              <div id = "contact">
                <img height="20" width="20" src="img/email.jpg" alt={altText}/><font><b> Email:</b></font>
                <ul>
                  <font><li>reciprocity@gmail.com</li></font>
                </ul>
              </div>
              <div id = "contact">
                <img height="20" width="20" src="img/Tg.png" alt={altText}/><font><b> Tg:</b></font>
                <ul>
                  <font><li>@rcprctdotcom</li></font>
                </ul>
              </div>
            </div>

            <div class = "feedback">
              <Feedback />
            </div>

          </div>
        </div>
      );
    }
  }
export default Contacts;
