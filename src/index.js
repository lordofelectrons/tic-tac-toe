import React from 'react';
import ReactDOM from 'react-dom';
import './components/css/index.css';
import App from './components/App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom';

ReactDOM.render(<App />, document.getElementById('root'));

ReactDOM.render(<Router>
    <Switch>
      <Route exact path="/" children={()=>'Game'} />
      <Route path="/help" children={()=>'Help'} />
      <Route path="/about_us" children={()=>'About us'} />
      <Route path="/contacts" children={()=>'Contacts'} />
      <Route path="/admin" children={()=>'Admin page'} />
    </Switch>
  </Router>, document.getElementById('tit'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
