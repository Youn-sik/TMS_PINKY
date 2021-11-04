import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid, Card, CardContent, TextField, Button } from '@material-ui/core';
import axios from 'axios';
import './image.css';
import {mqtt_url,out_mqtt_url,base_url as in_base_url,out_base_url} from 'server.json';

import mqtt from 'mqtt';

let currentUrl = window.location.href
let base_url = in_base_url
// console.log(currentUrl.indexOf("172.16.41.114"))
if(currentUrl.indexOf("172.16.41.114") <= -1) {
  base_url = out_base_url
}
let base_mqtt_url = mqtt_url
let port = "8083"

let client


const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  },
  details: {
    display: 'flex'
  },
  avatar: {
    marginLeft: 'auto',
    height: 110,
    width: 100,
    flexShrink: 0,
    flexGrow: 0
  },
  progress: {
    marginTop: theme.spacing(2)
  },
  search: {
    width: '100%'
  },
  action: {
    padding: '10px 20px'
  },
  tree: {
    // height: 240,
    flexGrow: 1,
    maxWidth: '100%'
  },
  treeItem: {
    fontSize: '18px'
  },
  labelRoot: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0.5, 0)
  },
  labelIcon: {
    marginRight: theme.spacing(1)
  },
  labelText: {
    fontWeight: 'inherit',
    fontSize: '16px',
    flexGrow: 1
  }
}));

const EditDevice = props => {

  useEffect(() => {
    client = mqtt.connect('ws://'+base_mqtt_url+':'+port+'/mqtt');

    return () => {
      client.end(true)
    };
  },[])

  const deviceObject = props.location.state;
  const classes = useStyles();
  const history = props.history;
  const [device, setDevice] = useState({
    name: '',
    location: '',
    gateway_obid: '',
    description: '',
    serial_number: '',
    status: 'N',
    protocol: '1',
    lat : '',
    lng : ''
  });

  const handleDeviceChange = event => {
    setDevice({
      ...device,
      [event.target.name]: event.target.value
    });
  };

  const editDevice = async () => {
    if(device.name === '') {
      alert("단말 이름을 입력해주세요.")
    } else if(device.location === '') {
      alert("단말 장소를 입력해주세요.")
    } else if(device.serial_number === '') {
      alert("단말 시리얼 넘버를 입력해주세요.")
    } else if(device.getX === '') {
      alert("위도를 입력해주세요.")
    } else if(device.getY === '') {
      alert("경도를 입력해주세요.")
    } else {
      let result = await axios.put(base_url + '/camera/' + deviceObject._id, {
        ...device,
        account: props.user_id,
        authority: props.authority,
        operation_auth: props.authority
      });

      if(result.data.error) {
        alert('중복된 시리얼 넘버 입니다.')
      } else if(!result.data.result) {
        alert(result.data.msg)
        props.history.push('/license')
        return 0;
      } else {
        window.alert('단말 수정 완료. 단말기가 재시작 됩니다.');
        client.publish(
          '/control/reboot/' +device.serial_number,
          JSON.stringify({
            stb_sn: device.serial_number,
            message: 'reboot'
          })
        );
        setTimeout(() => {history.push('/device/list')},0);
      }
    }
  };

  useEffect(() => {
    let device = JSON.parse(JSON.stringify(deviceObject));
    let editedUser = {
      name: device.name,
      location: device.location,
      description: device.description,
      serial_number: device.serial_number,
      lat : device.lat,
      lng : device.lng,
      status: 'N'
    };
    setDevice(editedUser);
  }, [deviceObject]);


  return (
    <div className={classes.root}>
      <Grid container justify="center" alignItems="center" spacing={4}>
        <Grid item lg={5} md={5} xl={5} xs={12}>
          <Card>
            <CardContent style={{ width: '50%', margin: '0 auto' }}>
              <div>
                <div style={{ width: '100%' }}>
                  <TextField
                    name="name"
                    value={device.name}
                    style={{ width: '100%' }}
                    required
                    id="standard-required"
                    label="이름"
                    onChange={handleDeviceChange}
                  />
                </div>
                <br/>
                <div style={{ width: '100%' }}>
                  <TextField
                    name="location"
                    value={device.location}
                    style={{ width: '100%' }}
                    required
                    id="standard-required"
                    label="장소"
                    onChange={handleDeviceChange}
                  />
                </div>
                <br/>
                <div style={{ width: '100%' }}>
                  <TextField
                    name="serial_number"
                    value={device.serial_number}
                    style={{ width: '100%' }}
                    required
                    id="standard-required"
                    label="시리얼넘버"
                    onChange={handleDeviceChange}
                  />
                </div>
                <br/>
                <div style={{ width: '100%' }}>
                  <TextField
                    name="lat"
                    value={device.lat}
                    style={{ width: '100%' }}
                    required
                    id="standard-required"
                    label="위도"
                    onChange={handleDeviceChange}
                  />
                </div>
                <br/>
                <div style={{ width: '100%' }}>
                  <TextField
                    name="lng"
                    value={device.lng}
                    style={{ width: '100%' }}
                    required
                    id="standard-required"
                    label="경도"
                    onChange={handleDeviceChange}
                  />
                </div>
                <div style={{ width: '100%' }}>
                  <TextField
                    name="description"
                    value={device.description}
                    style={{ width: '100%' }}
                    id="standard-required"
                    label="비고"
                    onChange={handleDeviceChange}
                  />
                </div>
                <div
                  style={{
                    width: '100%',
                    textAlign: 'center',
                    marginTop: '15px'
                  }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={editDevice}>
                    수정
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default EditDevice;
