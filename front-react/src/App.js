import React from 'react';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { Chart } from 'react-chartjs-2';
import { ThemeProvider } from '@material-ui/styles';
import validate from 'validate.js';
import {base_url} from 'server.json'
import { chartjs } from './helpers';
import theme from './theme';
import 'rsuite/dist/styles/rsuite-default.css'
import 'react-perfect-scrollbar/dist/css/styles.css';
import './assets/scss/index.scss';
import validators from './common/validators';
import Routes from './Routes';
import axios from 'axios'

import SignIn from './views/SignIn'

const browserHistory = createBrowserHistory();

Chart.helpers.extend(Chart.elements.Rectangle.prototype, {
  draw: chartjs.draw
});

validate.validators = {
  ...validate.validators,
  ...validators
};

export default class App extends React.Component {
  state = {
    auth : false,
    user_id : '',
    authority : '',
    tempLimit : 0,
    tempType : 0
  }

  componentWillMount() {
    console.log(base_url);
    if(browserHistory.location.pathname !== '/sign-in') { //URL 직접 변경 감지
      var value = document.cookie.match('(^|;) ?token=([^;]*)(;|$)');
      if(Array.isArray(value)) {
        axios.get(base_url+'/auth?token='+value[2])
          .then((res) => {
            if(res.data.auth === false) {
              document.cookie = 'token=; expires=Thu, 01 Jan 1999 00:00:10 GMT;';
              browserHistory.push('/sign-in')
            } else if( res.data.auth === true ) {
              this.setState({
                auth: true,
                user_id: res.data.user_id,
                authority : res.data.authority,
                tempLimit : res.data.tempLimit,
                tempType : res.data.tempType
              });
            }
          })
      } else {
        browserHistory.push('/sign-in')
      }
    }
  }

  componentDidMount () {
    this.unlisten = browserHistory.listen((location, action) => { //클릭을 통한 페이지 이동 감지
      if(location.pathname !== '/sign-in') {
        var value = document.cookie.match('(^|;) ?token=([^;]*)(;|$)');
        if(Array.isArray(value)) {
          axios.get(base_url+'/auth?token='+value[2])
          .then((res) => {
            if(res.data.auth === false) {
              browserHistory.push('/sign-in')
              document.cookie = 'token=; expires=Thu, 01 Jan 1999 00:00:10 GMT;';
              this.setState({
                auth: false,
                authority: '',
                user_id: '',
                tempLimit : 0,
                tempType : 0
              });
              return false;
            } else {
              this.setState({
                auth: true,
                user_id: res.data.user_id,
                authority : res.data.authority,
                tempLimit : res.data.tempLimit,
                tempType : res.data.tempType
              });
              return false;
            }
          })
        } else {
          browserHistory.push('/sign-in')
          document.cookie = 'token=; expires=Thu, 01 Jan 1999 00:00:10 GMT;';
          this.setState({
            auth: false,
            authority:'',
            user_id: '',
            tempLimit : 0,
            tempType : 0
          });
          return false;
        }
      }
    });
  }

  render() {
    const getAuth = (_auth) => {
        this.setState({
          authority : _auth
        })
    }

    return browserHistory.location.pathname === '/sign-in' || this.state.authority !== '' ?
      <ThemeProvider theme={theme}>
        <Router  history={browserHistory}>
          <Routes 
          tempLimit={this.state.tempLimit} 
          tempType={this.state.tempType} 
          path={browserHistory.location.pathname} 
          getAuth={getAuth} 
          user_id={this.state.user_id} 
          authority={this.state.authority} />
        </Router>
      </ThemeProvider>
      : <div></div>
  }
}
