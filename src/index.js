import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import AuthBox from './Auth';
import Home from './Home';
import {Router, Route, browserHistory, IndexRoute} from 'react-router';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
    (<Router history={browserHistory}>
        <Route path='/' component={App}>
            <IndexRoute component={Home} />
            <Route path='/author' component={AuthBox} />
            <Route path='/book'/>
        </Route>
    </Router>),
    document.getElementById('root')    
);
registerServiceWorker();
