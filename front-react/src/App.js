import React from 'react';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { Chart } from 'react-chartjs-2';
import { ThemeProvider } from '@material-ui/styles';
import validate from 'validate.js';
import { chartjs } from './helpers';
import theme from './theme';
import 'rsuite/dist/styles/rsuite-default.css';
import 'react-perfect-scrollbar/dist/css/styles.css';
import './assets/scss/index.scss';
import validators from './common/validators';
import Routes from './Routes';
import axios from 'axios';
import { Base64 } from 'js-base64';
Base64.extendString();

const browserHistory = createBrowserHistory();

Chart.helpers.extend(Chart.elements.Rectangle.prototype, {
  draw: chartjs.draw
});

validate.validators = {
  ...validate.validators,
  ...validators
};

axios.interceptors.response.use(function (response) {
  // Do something with response data
  return response;
}, function (error) {
  browserHistory.push('/sign-in');
});

export default class App extends React.Component {
  state = {
    auth: false,
    user_id: '',
    authority: '',
    tempLimit: 0,
    tempType: 0
  };

  async componentWillMount () {
    let value = document.cookie.match('(^|;) ?token=([^;]*)(;|$)');
    let user_info = document.cookie.match('(^|;) ?ACTKINFO=([^;]*)(;|$)');

    if(!Array.isArray(value) || !Array.isArray(user_info))
      value = [undefined,undefined]
    else {
      user_info[2] = user_info[2].fromBase64();

      let splited = user_info[2].split("|")
  
      this.setState({
        auth: true,
        user_id: splited[0],
        authority: splited[1],
        tempLimit: parseInt(splited[3]),
        tempType: parseFloat(splited[2])
      });
    }

    axios.defaults.headers.common['Authorization'] = value[2];

    this.unlisten = browserHistory.listen((location, action) => {
      let value = document.cookie.match('(^|;) ?token=([^;]*)(;|$)');
      let user_info = document.cookie.match('(^|;) ?ACTKINFO=([^;]*)(;|$)');

      if(!Array.isArray(value) || !Array.isArray(user_info))
        value = [undefined,undefined]

      axios.defaults.headers.common['Authorization'] = value[2];

      user_info[2] = user_info[2].fromBase64();

      let splited = user_info[2].split("|")

      this.setState({
        auth: true,
        user_id: splited[0],
        authority: splited[1],
        tempLimit: parseInt(splited[3]),
        tempType: parseFloat(splited[2])
      });
    })
    
    // if (browserHistory.location.pathname !== '/sign-in') {
    //   //URL 직접 변경 감지
    //   var value = document.cookie.match('(^|;) ?token=([^;]*)(;|$)');
    //   // console.log(value[2]);
    //   if (Array.isArray(value)) {
    //     await axios.get(base_url + '/auth?token=' + value[2]).then(res => {
    //       if (res.data.auth === false) {
    //         browserHistory.push('/sign-in');
    //         this.setState({
    //           auth: false,
    //           authority: '',
    //           user_id: '',
    //           tempLimit: 0,
    //           tempType: 0
    //         });
    //         document.cookie = 'token=; expires=Thu, 01 Jan 1999 00:00:10 GMT;';
    //       } else if (res.data.auth === true) {
    //         this.setState({
    //           auth: true,
    //           user_id: res.data.user_id,
    //           authority: res.data.authority,
    //           tempLimit: res.data.tempLimit,
    //           tempType: res.data.tempType
    //         });
    //       }
    //     });
    //   } else {
    //     browserHistory.push('/sign-in');
    //   }
    // }
  }

  // componentDidMount() {
  //   this.unlisten = browserHistory.listen((location, action) => {
  //     //클릭을 통한 페이지 이동 감지
  //     if (location.pathname !== '/sign-in') {
  //       var value = document.cookie.match('(^|;) ?token=([^;]*)(;|$)');
  //       // console.log(value[2]);
  //       if (Array.isArray(value)) {
  //         axios.get(base_url + '/auth?token=' + value[2]).then(res => {
  //           if (res.data.auth === false) {
  //             browserHistory.push('/sign-in');
  //             document.cookie =
  //               'token=; expires=Thu, 01 Jan 1999 00:00:10 GMT;';
  //             this.setState({
  //               auth: false,
  //               authority: '',
  //               user_id: '',
  //               tempLimit: 0,
  //               tempType: 0
  //             });
  //             return false;
  //           } else {
  //             this.setState({
  //               auth: true,
  //               user_id: res.data.user_id,
  //               authority: res.data.authority,
  //               tempLimit: res.data.tempLimit,
  //               tempType: res.data.tempType
  //             });
  //             return false;
  //           }
  //         });
  //       } else {
  //         browserHistory.push('/sign-in');
  //         document.cookie = 'token=; expires=Thu, 01 Jan 1999 00:00:10 GMT;';
  //         this.setState({
  //           auth: false,
  //           authority: '',
  //           user_id: '',
  //           tempLimit: 0,
  //           tempType: 0
  //         });
  //         return false;
  //       }
  //     }
  //   });
  // }

  render() {
    const getAuth = _auth => {
      this.setState({
        authority: _auth
      });
    };

    if(browserHistory.location.pathname === '/sign-in' || this.state.authority !== '') { 
        return ( 
          <ThemeProvider theme={theme}>
            <Router history={browserHistory}>
              <Routes
                tempLimit={this.state.tempLimit}
                tempType={this.state.tempType}
                path={browserHistory.location.pathname}
                getAuth={getAuth}
                user_id={this.state.user_id}
                authority={this.state.authority}
              />
            </Router>
          </ThemeProvider>
        )
    } else {
      return (
        <div></div>
      )
    }
  }
}
