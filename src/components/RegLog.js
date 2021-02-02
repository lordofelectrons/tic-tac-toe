import React from 'react';
import './css/index.css';
import sha256 from 'crypto-js/sha256';
import CurUser from './CurUser';

const altText = "It`s impossible to load this image!";

const unRegExtra = "Only local mode allowed!";
const inRegExtra = "Greetings! Now you're online...";
const unRegLogin = "Unauthorized!";

class RegLog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            login: props.login,
            password: '',
            avatPath: props.avatar,
            curUserLogin: unRegLogin,
            extra: unRegExtra,
            isSigned: props.isSigned
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.fileInput = React.createRef();
        this.logMode = false;
        this.regMode = false;
        this.currentUserRef = React.createRef();
        this.loginBut = this.loginBut.bind(this);
        this.exitBut = this.exitBut.bind(this);
        this.cancelBut = this.cancelBut.bind(this);
        this.newAccBut = this.newAccBut.bind(this);
    }

    componentWillMount() {
      let accToken = sessionStorage.getItem('accToken');
      let refToken = sessionStorage.getItem('refToken');
      console.log(accToken);
      if(accToken && refToken) {
        let data = new FormData();
        data.append('accToken', accToken);
        data.append('refToken', refToken);
        fetch('http://localhost:8082/tokenCheck', {method: 'POST', body: data})
          .then((res) => {
            if(res.ok) {
              console.log(res.ok);
              res.json().then((accInfo) => {
                console.log(accInfo);
                if(accInfo.accToken || accInfo.refToken) {
                  sessionStorage.setItem('accToken', accInfo.accToken);
                  sessionStorage.setItem('refToken', accInfo.refToken);
                }
                this.setState({curUserLogin: accInfo.login, extra: inRegExtra, isSigned: true, avatPath: accInfo.path});
                this.docChangeLogIn();
                this.props.updateLoggedUser(accInfo.login, accInfo.path, true);
              });
            }
            else {
              this.props.updateLoggedUser('', '', false);
            }
          });
      }
    }

    componentDidMount() {
      this.hideElement(this.refs.userForm);
    }

    componentDidUpdate() {
      console.log('upd');
    }

    showElement(elem) {
      elem.style.display = 'inline-block';
    }

    hideElement(elem) {
      elem.style.display = 'none';
    }

    docChangeShowForm() {
      this.showElement(this.refs.userForm);
      this.hideElement(this.currentUserRef.current);
      this.hideElement(this.refs.regForm);
      if(this.logMode) {
        this.hideElement(this.fileInput.current);
      }
      else if(this.regMode) {
        this.showElement(this.fileInput.current);
        this.props.topLine.current.style.height = '80px';
      }
    }

    docChangeHideForm() {
      this.hideElement(this.refs.userForm);
      this.showElement(this.currentUserRef.current);
      this.showElement(this.refs.regForm);
      this.props.topLine.current.style.height = '55px';
    }

    docChangeLogIn() {
      this.hideElement(this.refs.regForm);
      this.showElement(this.refs.exitForm);
    }

    docChangeLogOut() {
      this.showElement(this.refs.regForm);
      this.hideElement(this.refs.exitForm);
      this.props.updateLoggedUser(this.state.curUserLogin, this.state.isSigned);
    }

    resetForm() {
      this.docChangeHideForm();
      this.setState({login: '', password: ''});
      this.logMode = false;
      this.regMode = false;
      this.refs.userForm.reset();
    }

    loginBut() {
      this.logMode = true;
      this.docChangeShowForm();
    }

    newAccBut() {
      this.regMode = true;
      this.docChangeShowForm();
    }

    cancelBut() {
      this.resetForm();
    }

    exitBut() {
      this.docChangeLogOut();
      sessionStorage.removeItem('accToken');
      sessionStorage.removeItem('refToken');
      this.setState({curUserLogin: unRegLogin, extra: inRegExtra, isSigned: false, avatPath: ''});
    }

    handleClick(event) {

    }

    handleChange(event) {
        const {name, value} = event.target;
        this.setState({[ name]: value});
    }

    handleSubmit(event) {
      event.preventDefault();
      let data = new FormData();
      data.append('login', this.state.login);
      data.append('password', sha256(this.state.password).toString());
      if(this.regMode) {
        data.append('avatar', this.fileInput.current.files[0]);
        fetch('http://localhost:8082/reg', {method: 'POST', body: data})
          .then((res) => {
            if(res.ok) {
              alert(`Operation successfull!`);
              this.resetForm();
            }
            else {
              alert('Login is busy!');
            }
          });
      }
      else if(this.logMode) {
        fetch('http://localhost:8082/login', {method: 'POST', body: data})
          .then((res) => {
            if(res.ok) {
              res.json().then((tokens) => {
                this.setState({curUserLogin: this.state.login, extra: inRegExtra, isSigned: true, avatPath: tokens[2]});
                sessionStorage.setItem('accToken', tokens[0]);
                sessionStorage.setItem('refToken', tokens[1]);
                this.resetForm();
                this.docChangeLogIn();
              });
            }
            else {
              alert('Invalid login or password! Try again...');
            }
          });
      }
    }

    render() {
        return (
          <div>
            <div id="curuserblock">
              <div id="contUserOrForm">

                <CurUser login={this.state.curUserLogin} extra={this.state.extra} avatar={this.state.avatPath} isSigned={this.state.isSigned} refer={this.currentUserRef}/>

                <form ref="userForm" className="registerFullForm" onSubmit={this.handleSubmit} encType='multipart/form-data' id='userForm' action='/'>
                  <input className="regInp" onChange={this.handleChange} type='text' maxLength='16' minLength='3' placeholder='login' name="login" id='log' value={this.state.login} required/>
                  <input id='sendBut' name='sub' className='regLogControl' type='submit' value='Confirm' formMethod="POST"/>
                  <input className="regInp" onChange={this.handleChange} type='password' maxLength='16' minLength='8' placeholder='password' name='password' id='pass' value={this.state.password} required/>
                  <input id='cancelBut' className='regLogControl' type='button' onClick={this.cancelBut} value='Cancel'/>
                  <input id='fileInp' className="regInp" type="file" name="avatar" ref={this.fileInput} accept="image/*"/>
                </form>

              </div>
            </div>
            <form id = "regForm" ref="regForm">
              <input type="button" value="Log in" id="loginBut" onClick={this.loginBut} className="regbuts"/>
              <input type="button" value="Create Account" id="newAccBut" onClick={this.newAccBut} className="regbuts"/>
            </form>
            <form id = "exitForm" ref="exitForm">
              <input type="button" value="Log out" id="exitBut" onClick={this.exitBut} className="regbuts"/>
            </form>
            <img id = "rightimg" src = "img/2000px-Tic_tac_toe.png" alt={altText}/>
          </div>
        )
    }
}
export default RegLog;
