import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import AuthAdmin from './Auth';
// import BookAdmin from './Book';
import Home from './Home';
import './index.css';
import {BrowserRouter as Router, Route,Switch,Link} from 'react-router-dom';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render((
  <Router>
    <App>
      <Switch>
        <Route exact path='/' component={Home} />
        <Route  path='/author' component={AuthAdmin} />
        <Route  path='/book' /*component={BookAdmin}*/ />
      </Switch>
    </App>
  </Router>
  ),document.getElementById('root')    
);
registerServiceWorker();
