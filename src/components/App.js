import React from 'react';
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Game from './Game';
import Help from './Help';
import About_us from './About_us';
import Contacts from './Contacts';
import Admin from './Admin';

class App extends React.Component {
  constructor() {
    super();
    this.hhh = 0;
  }

  render() {
    this.hhh += 1;
    console.log(this.hhh);
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={Game} />
          <Route path="/help" component={Help} />
          <Route path="/about_us" component={About_us} />
          <Route path="/contacts" component={Contacts} />
          <Route path="/admin" component={Admin} />
        </Switch>
      </Router>
    );
  }
}

export default App;
