import React, { Component } from 'react';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { Chart } from 'react-chartjs-2';
import { ThemeProvider } from '@material-ui/styles';
import validate from 'validate.js';

import { chartjs } from './helpers';
import theme from './theme';
import 'rsuite/dist/styles/rsuite-default.css'
import 'react-perfect-scrollbar/dist/css/styles.css';
import './assets/scss/index.scss';
import validators from './common/validators';
import Routes from './Routes';
import axios from 'axios'

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
    auth : false
  }
  componentDidMount() {
    this.unlisten = browserHistory.listen((location, action) => { //클릭을 통한 페이지 이동 감지
      if(location.pathname !== '/sign-in' && location.pathname !== '/') {
        var value = document.cookie.match('(^|;) ?token=([^;]*)(;|$)');
        // console.log(value)
        if(Array.isArray(value)) {
          axios.get('http://172.16.135.89:3000/auth?token='+value[2])
          .then((res) => {
            if(res.data.auth === false) {
              console.log(res.data);
              browserHistory.push('/sign-in')
              document.cookie = 'token=; expires=Thu, 01 Jan 1999 00:00:10 GMT;';
              this.setState({
                auth: false
              });
              return false;
            } else {
              this.setState({
                auth: true
              });
              return false;
            }
          })
        } else {
          browserHistory.push('/sign-in')
          document.cookie = 'token=; expires=Thu, 01 Jan 1999 00:00:10 GMT;';
          this.setState({
            auth: false
          });
          return false;
        }
      }
    });

    if(browserHistory.location.pathname !== '/sign-in' && browserHistory.location.pathname !== '/') { //URL 직접 변경 감지
      var value = document.cookie.match('(^|;) ?token=([^;]*)(;|$)');
      if(Array.isArray(value)) {
        axios.get('http://172.16.135.89:3000/auth?token='+value[2])
          .then((res) => {
            if(res.data.auth === false) {
              document.cookie = 'token=; expires=Thu, 01 Jan 1999 00:00:10 GMT;';
              browserHistory.push('/sign-in')
            }
          })
      } else {
        browserHistory.push('/sign-in')
      }
    }
  }
  render() {
    return (
      <ThemeProvider theme={theme}>
        <Router history={browserHistory}>
          <Routes />
        </Router>
      </ThemeProvider>
    );
  }
}
