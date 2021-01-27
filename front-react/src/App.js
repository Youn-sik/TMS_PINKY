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
import { SnackbarProvider } from 'notistack';
import {mqtt_url} from 'server.json'
import mqtt from 'mqtt';
import { useSnackbar } from 'notistack';
import CustomSnack from 'CustomSnack.js'

// const client = mqtt.connect('wss://'+mqtt_url+':8084/mqtt',{
//   username: 'admin_server',
//   password:"masterQ!W@E#R$",
//   rejectUnauthorized: true,
//   cert:"-----BEGIN CERTIFICATE-----"+
//   'MIIDIjCCAgoCFByI2XoWck1XL1c538mmmr6CBItTMA0GCSqGSIb3DQEBCwUAMEUx'+
//   'CzAJBgNVBAYTAkFVMRMwEQYDVQQIDApTb21lLVN0YXRlMSEwHwYDVQQKDBhJbnRl'+
//   'cm5ldCBXaWRnaXRzIFB0eSBMdGQwHhcNMjEwMTI2MDUxMzQ5WhcNMzEwMTI0MDUx'+
//   'MzQ5WjBWMQswCQYDVQQGEwJDTjERMA8GA1UECAwIWmhlamlhbmcxETAPBgNVBAcM'+
//   'CEhhbmd6aG91MQ0wCwYDVQQKDARFTVFYMRIwEAYDVQQDDAlsb2NhbGhvc3QwggEi'+
//   'MA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDmyP7DL3XDXkT0TcHm7Xlo+Eah'+
//   'G5jY4/VKG9kkb18XgqZwv4RTX0s1ABHIh9M95a1xN9+TdvRU2CZ/RF/deumY86aF'+
//   '7XXA1ADXVu8m5/gbpyw2Lp4lXAFSuFIQU/PgCVEzZR5ZEJGGM3A5X/3NaOoJwelE'+
//   'hto6tZEypTFlutPdbsi+vj5AB7ZVg71bLAMsnWc4CMG6t7W/BmzM7Pf+SV9SvD5b'+
//   'EZGOQ7RmbhvLnK8GnfcqVs7aZe5SSJobnHr4b/17sbKD3FtGvrWI5xK8yFd28SKm'+
//   'wm1gfoPzKS7OZTqpHG0tfUFIKRbZhRL5iIecDtTQP+orFydlLNdA7u1RrkiVAgMB'+
//   'AAEwDQYJKoZIhvcNAQELBQADggEBADIUNGmBVML2B3oKOnJqi1uOk7vCXtlpHjWR'+
//   '9UVG5n6aqL5qCWGZWM8ewarN+3JCH/ElcSgLqRQjF1Y9rp1eU3aCRM0qSJ/c3c67'+
//   'MnGN8lNKwXK+hIfqlm/BoYoLt0XHI/7h8IBqumCqSYb2BL+HbEbbm2lMyAYGjGOj'+
//   'CEDi8CYqnRymE5IEy4yCyoimbNa5cVY0K9a0KEPPwP5e8qB0KvYGgSE4h4DoT+6o'+
//   'RAfGr6K8GUFs3BbYfiABsNoKoGNgNVkSxGxdB1T45JjdC3ltN4oiLCQyyey1Bbhm'+
//   "yxmfR3zx/H/JOz8Fw/QADxmUoPjgnSa14GTvGoegL71O2Xw0u2A="+
//   "-----END CERTIFICATE-----",
//   key:"-----BEGIN RSA PRIVATE KEY-----"+
//   'MIIEpQIBAAKCAQEA5sj+wy91w15E9E3B5u15aPhGoRuY2OP1ShvZJG9fF4KmcL+E'+
//   'U19LNQARyIfTPeWtcTffk3b0VNgmf0Rf3XrpmPOmhe11wNQA11bvJuf4G6csNi6e'+
//   'JVwBUrhSEFPz4AlRM2UeWRCRhjNwOV/9zWjqCcHpRIbaOrWRMqUxZbrT3W7Ivr4+'+
//   'QAe2VYO9WywDLJ1nOAjBure1vwZszOz3/klfUrw+WxGRjkO0Zm4by5yvBp33KlbO'+
//   '2mXuUkiaG5x6+G/9e7Gyg9xbRr61iOcSvMhXdvEipsJtYH6D8ykuzmU6qRxtLX1B'+
//   'SCkW2YUS+YiHnA7U0D/qKxcnZSzXQO7tUa5IlQIDAQABAoIBAQCYFK2li/nrk4yW'+
//   '/UKg3a7bGHjao+f2TUoP2wgdtXKReJwbwmj909cohvIxFiiDKn5AFJS1hXb/Di1Y'+
//   'QoN13RBgpXb/3HpzZoFjZjtUhRp/hotg7Rlz/ww0KZiSf/A+m4Ux/BmikYOETxNO'+
//   'C86hdNh9M5Z3fPIELDARksBZjGMfECiqXqzggNfM3a5J4QEAf79wNYKZjoFMSyuc'+
//   'tWtj7s/iz1WRE+OUQHIWT0zJ2llp+cogfuRwzQcmiKPy18dkEPsHb00Ohn0nXIb4'+
//   'OqC9SBSftAtHlp8pdmqn8oa4VQCicG9K6IT0F2pP2eN1qdT4gwE0iLguesFI0gfo'+
//   'kzNoLGBBAoGBAPnW7Dt7aKM1cRRcRr3hWImgBRFGzHvaY1eX38EcgKOKw+YJ5QlN'+
//   'YHpAhvC+7TUGRVKZwv/YVY5Xk4c05tP7V0x7M95QoOPZDhx0mdDVkyaMo1ERlchg'+
//   'eCt3Morbs5hPiCLmg7KIbbtIbwugHQnjwdgDANZUWzxEMR/K2wbg6mwxAoGBAOx5'+
//   'y0sSvQgT6Ah2zLBtr9BPYGZYHIEJ5trbBv1dAhXOuG+lZ20S9yp7ic/kb3xAgCsO'+
//   'jxKglHrq3SFkP4wW8eruU7o2za/uqrW0phKPH4IRHt8O/s6ZqudyUutG6RaN2vY+'+
//   'drjWhxQtgVkZ2va+cqpr0apfLzO0TYJAIoqtZR2lAoGBAKVTu++AsrWN386BYa61'+
//   'OEmaQsA0AYzT73k/XyoDGn0ejpPjaFTHh1he6uzU61NzWtxWM9vp5HPVMCMAtt8A'+
//   'K7zIqoIrCMy+DcB2yHKRYlbYKhqzcFKww9S/hAqvaCEaQBQYRn4WGccdH56pzY2F'+
//   '0fiHxD4QhG9VEMzhCB99JqOBAoGAawSXfwsk5zHzEVmKOtH4/gHeM5Lum2s6wZLb'+
//   '7++WkP3zs/sb+l3Z46zy6lWMKqQaHOJC14A6kgIWPxVaOPDtXI+s7pn8rgEJ2p+9'+
//   'hKqm7LsIyJPFtwQONx4i7n0x4VYjYMtV+UKE8RnC7urnkEESLZQL19mpx/FyHl8e'+
//   'ArqEB00CgYEA3aly6oJF66Fn7spW6XcNQ/LDmhqVfJjtM7vrPLgPDETp1uTjfCtv'+
//   'isl6pm8/efKqsK4wRpxLgktWmCz2yHNnuy4HruSFCVQGuT+M12teS8nuBRGmSgl8'+
//   'DigvfMMgCkfK4laUbFpCsTjE+jIqUHPPdADvJzDo+du3pT/G2aiAVO0='+
//   "-----END RSA PRIVATE KEY-----",
  // ca : "-----BEGIN CERTIFICATE-----"+
  // "MIIDazCCAlOgAwIBAgIUPhmxp/bGjkw1vwFmdWQKL2Bi9KcwDQYJKoZIhvcNAQEL"+
  // "BQAwRTELMAkGA1UEBhMCQVUxEzARBgNVBAgMClNvbWUtU3RhdGUxITAfBgNVBAoM"+
  // "GEludGVybmV0IFdpZGdpdHMgUHR5IEx0ZDAeFw0yMTAxMjUwMTU4NDRaFw0zMTAx"+
  // "MjMwMTU4NDRaMEUxCzAJBgNVBAYTAkFVMRMwEQYDVQQIDApTb21lLVN0YXRlMSEw"+
  // "HwYDVQQKDBhJbnRlcm5ldCBXaWRnaXRzIFB0eSBMdGQwggEiMA0GCSqGSIb3DQEB"+
  // "AQUAA4IBDwAwggEKAoIBAQCfYVVnqMJNYDwa3+VMcuNPEdRfWWeQdWQrRWJU62Qi"+
  // "cpNJIeziGg66v3XlQJ3BPu6qe0cDbXAw6cD3mDpcUZkWW5QcqfQ1MOCCooxDsa5J"+
  // "kdNCpEn4GCWKR05WcZGcfP+0YuypNlniZJCiT5HQGN8XZlME9lT+N3sNTKauS6qW"+
  // "bpHjGMsaUHvEwp38RhE4mftfZLimdVftWh2hkBld6x8A6NFS2o2v337UVVBhQaa2"+
  // "7IqSF8dfIpDxtR5H/MyfZk32Ph3ye2dF2WDGOaICm5L8rrutYR/lp8fmO033CRmN"+
  // "IPVAsXYNXWT4tRKJvdr0be6Ouq3a3xXSmjaBa8H0y/iDAgMBAAGjUzBRMB0GA1Ud"+
  // "DgQWBBQ3b0keHNyNp1ecKFI1Rj7C97kRkjAfBgNVHSMEGDAWgBQ3b0keHNyNp1ec"+
  // "KFI1Rj7C97kRkjAPBgNVHRMBAf8EBTADAQH/MA0GCSqGSIb3DQEBCwUAA4IBAQBa"+
  // "23X6DEYwS8saDWDMPT2WbcUY59saCGBq4TnetuENk61G99TfQEFUbQMGKEUXP5FU"+
  // "HtfGKU8DUwh+scT7y9TxTPj9uzHvgJSDmW5KmrlW3RWH14bY3b75GdM0xT7ioUao"+
  // "OSGLQ6bR1ByJtROOp6oBjErLkYoi/RDfZdXRrKPrZ7zLBVI8WLPreCXJaMEOTR39"+
  // "iIjlP4vpuBYe31tcb1zNj33cYJ1qiSxq2AGAotl/syxL9AMguPnQxSd4XpI2qnzh"+
  // "dgMopdhedxs3mf14NoNKgakm8cyXzaA18iPDcTDRkLzc5nykZQM7im9EQrp+cLP4"+
  // "wGwpptosy9IatLVjb7BN"+
  // "-----END CERTIFICATE-----",
// })

const client = mqtt.connect({
  protocol:"ws",
  port:"8083",
  host:mqtt_url,
  path:'/mqtt',
  username: 'admin_server',
  password:"masterQ!W@E#R$",
  clean: true,
  rejectUnauthorized: false,
  ca : "/media/jjh/data/openssl_back/my_root_ca.pem",
})

client.on('error', (err) => {
  console.log(err)
})

client.on('connect', () => {
  console.log('connected')
  client.subscribe('/access/realtime/result/+');
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

let message = false;
let imgSrc = null;
let auth = null;
function Popup() {
  const { enqueueSnackbar } = useSnackbar();
  if(!message){
    message = true;
    client.on('message', function(topic, message) {
      if (topic.indexOf('/access/realtime/result/') > -1) {
        let result = JSON.parse(message.toString()).values
        let accessAuth = result[0].authority;
        let matchRe = accessAuth.match(auth)
        let templimit = localStorage.getItem('temperature');
        if(matchRe && window.location.pathname !== '/sign-in' && result[0].avatar_temperature >= templimit){
          imgSrc = result[0].avatar_file_url
          enqueueSnackbar(`${result[0].stb_location}에서 고발열자(${String(result[0].avatar_temperature).substring(0,4)}℃)가 탐지 되었습니다.|${imgSrc}`,{ variant: 'error',autoHideDuration:null});
        }
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
