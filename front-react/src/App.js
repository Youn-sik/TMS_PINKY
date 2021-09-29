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
import { SnackbarProvider } from 'notistack';
import {mqtt_url,out_mqtt_url,base_url as in_base_url,out_base_url} from 'server.json'
import mqtt from 'mqtt';
import { useSnackbar } from 'notistack';
import CustomSnack from 'CustomSnack.js'
import FCM from 'fcm-node';

// window.Kakao.init("c236b82b99b895e9afd2539b91ed1579")

let currentUrl = window.location.href
let base_url = in_base_url
let base_mqtt_url = mqtt_url
let port = "8083"
// console.log(currentUrl.indexOf("172.16.33.130"))
// if(currentUrl.indexOf("172.16.33.130") <= -1) {
//   base_url = out_base_url
//   base_mqtt_url = out_mqtt_url
//   port = "18083"
// }

const client = mqtt.connect({
  protocol:"ws",
  port:port,
  host:"base_mqtt_url",
  keepalive:0,
  path:'/mqtt',
  clean: true,
})

client.on('error', (err) => {
  console.log(err)
})

client.on('connect', () => {
  console.log('connected')
  client.subscribe('/access/realtime/check/result/+');
});

const browserHistory = createBrowserHistory();


Chart.helpers.extend(Chart.elements.Rectangle.prototype, {
  draw: chartjs.draw
});

validate.validators = {
  ...validate.validators,
  ...validators
};

axios.interceptors.response.use(null, function (error) {
  document.cookie = 'token=; expires=Thu, 01 Jan 1999 00:00:10 GMT;';
  document.cookie = 'ACTKINFO=; expires=Thu, 01 Jan 1999 00:00:10 GMT;';
  browserHistory.push('/sign-in');
  return error
});

//
var serverKey = 'AAAAfXhPMwY:APA91bHSUEqHWbWFsDucyVThOkyyxZNw0DGdS10yDKRICpzhjfpxA65tCawhoHdbRhqeINProc-NyJReIS1crul877cKgZdxidNoFgEmUtPfFC1PcVXBAfPPHtlez9ryL-KihnIUPpby';
var fcm = new FCM(serverKey);
//

let message = false;
let imgSrc = null;
let auth = null;
function Popup() {
  const { enqueueSnackbar } = useSnackbar();
  if(!message){
    message = true;
    client.on('message', function(topic, message) {
      if (topic.indexOf('/access/realtime/check/result/') > -1) {
        let result = JSON.parse(message.toString()).values
        let accessAuth = result[0].authority;
        let matchRe = accessAuth.match(auth)
        let templimit = localStorage.getItem('temperature');
        if(matchRe && window.location.pathname !== '/sign-in' && result[0].avatar_temperature >= templimit){
          imgSrc = result[0].avatar_file_url
          enqueueSnackbar(`${result[0].stb_location}에서 고발열자(${String(result[0].avatar_temperature).substring(0,4)}℃)가 탐지 되었습니다.|${imgSrc}`,{ variant: 'error',autoHideDuration:null});
        }
        else if(matchRe && window.location.pathname !== '/sign-in' && result[0].alarm_type == 5){
          imgSrc = result[0].avatar_file_url
          enqueueSnackbar(`${result[0].stb_location}에서 비상알림이 호출 되었습니다.|${imgSrc}`,{ variant: 'error',autoHideDuration:null});
        }
        //
        var alarm = '';
        if(result[0].alarm_type == 1) alarm = '승차';
        else if(result[0].alarm_type == 2) alarm = '하차';
        else if(result[0].alarm_type == 3) alarm = '등원';
        else if(result[0].alarm_type == 4) alarm = '하원';
        if(result[0].name != 'unknown'){
          var fcmMessage = {
            to:'dZq8djW-SPC88u7Pm1VJuv:APA91bE1I4EykLhK1hctGmnSIsaT9gGzZRTyVdjdGBYpv2qY9mjudsLXJJBI973D-TuvuRr8Y0l5ZwTNAq6zu7nYy3pEUS4g9oyA522S24mc3U-77rhHLr8CTXArlU8zG9UjDKc6PZEK',
                notification: {
                    title: 'PINKY',
                    body: result[0].name+' 학생이 '+alarm+'했습니다', 
            },
            data: { 
                title: 'title',
                body: '{"key" : "value","key" : "value","key" : "value"}'
            }
          };
          
          fcm.send(fcmMessage, function(err, response) {
            if (err) {
                console.log("Something has gone wrong!"+err);
                console.log("Respponse:! "+response);
            } else {
                // showToast("Successfully sent with response");
                console.log("Successfully sent with response: ", response);
            }
  
          });
        }
        //
      }
    });
  }
  return (null);
}

export default class App extends React.Component {
  state = {
    auth: true,
    user_id: '',
    authority: '',
    tempLimit: 0,
    tempType: 0,
    open: true
  };

  async componentWillMount () {
    let value = document.cookie.match('(^|;) ?token=([^;]*)(;|$)') ? document.cookie.match('(^|;) ?token=([^;]*)(;|$)') : [undefined,undefined,undefined];
    let user_info = document.cookie.match('(^|;) ?ACTKINFO=([^;]*)(;|$)') ? document.cookie.match('(^|;) ?ACTKINFO=([^;]*)(;|$)') : [undefined,undefined,undefined];
    axios.defaults.headers.common['Authorization'] = value[2];

    if(!value[2] || !user_info[2]){
      if(browserHistory.location.pathname !== '/sign-in')
        browserHistory.push('/sign-in');
    } else {
      user_info[2] = user_info[2].fromBase64();

      let splited = user_info[2].split("|")
      if(splited[1] !== 'admin')
        auth = new RegExp("^"+splited[1])
      else
        auth = new RegExp("")

      this.setState({
        auth: true,
        user_id: splited[0],
        authority: splited[1],
        tempLimit: parseFloat(splited[3]),
        tempType: parseFloat(splited[2])
      });
    }


    this.unlisten = browserHistory.listen((location, action) => {
      let value = document.cookie.match('(^|;) ?token=([^;]*)(;|$)') ? document.cookie.match('(^|;) ?token=([^;]*)(;|$)') : [undefined,undefined,undefined];
      let user_info = document.cookie.match('(^|;) ?ACTKINFO=([^;]*)(;|$)') ? document.cookie.match('(^|;) ?ACTKINFO=([^;]*)(;|$)') : [undefined,undefined,undefined];
      axios.defaults.headers.common['Authorization'] = value[2];

      if(!value[2] || !user_info[2]){
        if(browserHistory.location.pathname !== '/sign-in')
          browserHistory.push('/sign-in');
      } else {
        user_info[2] = user_info[2].fromBase64();

        let splited = user_info[2].split("|")

        auth = splited[1]
        this.setState({
          auth: true,
          user_id: splited[0],
          authority: splited[1],
          tempLimit: parseFloat(splited[3]),
          tempType: parseFloat(splited[2])
        });
      }
    })
  }

  render() {
    const getAuth = _auth => {
      this.setState({
          auth: true,
          user_id: _auth.user_id,
          authority: _auth.authority,
          tempLimit: parseFloat(_auth.tempLimit),
          tempType: parseFloat(_auth.tempType)
      });
    };

    const notistackRef = React.createRef();

    if(browserHistory.location.pathname === '/sign-in' || this.state.authority !== '') {
        return (
          <ThemeProvider theme={theme}>
            {/* 카카오 sdk 적용 */}
            {/* <Helmet>
              <script src="https://developers.kakao.com/sdk/js/kakao.js"></script>
            </Helmet> */}
            <SnackbarProvider
              ref={notistackRef}
              id="mySnackBar"
              maxSnack={1}
              anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
              }}
              content={(key, message) => (
                <CustomSnack path={browserHistory.location.pathname} history={browserHistory} id={key} message={message} />
              )}
              >
              <Popup></Popup>
            </SnackbarProvider>
            <Router history={browserHistory}>
              <Routes
                client={client}
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
