import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid, Select, MenuItem } from '@material-ui/core';
import axios from 'axios';
import { DateRangePicker, IntlProvider } from 'rsuite';
import kor from 'rsuite/lib/IntlProvider/locales/ko_KR';
import moment from 'moment';
import CircularProgress from '@material-ui/core/CircularProgress';
import 'moment/locale/ko';
import { DeviceStats, DeviceError } from './components';
import {base_url} from 'server.json';
// eslint-disable-next-line no-extend-native
Date.prototype.yyyymmdd = function() {
  var yyyy = this.getFullYear().toString();
  var mm = (this.getMonth() + 1).toString();
  var dd = this.getDate().toString();

  return (
    yyyy + '-' + (mm[1] ? mm : '0' + mm[0]) + '-' + (dd[1] ? dd : '0' + dd[0])
  );
};

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  },
  accessCard: {
    height: '125px;'
  }
}));

const Statistics = props => {
  const classes = useStyles();
  const { allowedDays } = DateRangePicker;
  const [date, setDate] = useState([
    moment()
      .subtract(6, 'days')
      .format('YYYY-MM-DD'),
    moment().format('YYYY-MM-DD')
  ]);
  const [allPeopleData, setAllPeopleData] = useState([]);
  const [peopleData, setPeopleData] = useState({});
  const [devices, setDevices] = useState([]);
  const [device, setDevice] = useState('');
  const [count, setCount] = useState(0);
  const [errorData, setErrorData] = useState({});
  const [allErrorData, setAllErrorData] = useState({});
  const [loading, setLoading] = useState(true);
  const [attList, setAttList] = useState([]);

  const statsData = (employee, stranger, black, dates) => {
    let temp = [
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0]
    ];

    dates.map((date, index) => {
      
      let empCnt = Array.isArray(employee) ? employee.map((i) => {if(i._id.date === date) return i.count})[0] : undefined;
      let strCnt = Array.isArray(stranger) ? stranger.map((i) => {if(i._id.date === date) return i.count})[0] : undefined;
      let blackCnt = Array.isArray(black) ? black.map((i) => {if(i._id.date === date) return i.count})[0] : undefined;

      if(empCnt !== undefined)
        temp[0][index] = empCnt
      if(strCnt !== undefined)
        temp[2][index] = strCnt
      if(blackCnt !== undefined)
        temp[3][index] = blackCnt
      return false;
    });

    return temp;
  };

  // error.log_no === 3 ? "연결 끊김" :
  // error.log_no === 32 ? "CPU과다 사용" : "메모리 과다 사용"

  const statsErrorData = (disconnect, cpu, memory, dates) => {
    let temp = [
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0]
    ];
    dates.map((date, index) => {
      disconnect.map(i => {
        if (i.regdate.split(' ')[0] === date) temp[0][index]++;
        return false;
      });
      cpu.map(i => {
        if (i.regdate.split(' ')[0] === date) temp[1][index]++;
        return false;
      });
      memory.map(i => {
        if (i.regdate.split(' ')[0] === date) temp[2][index]++;
        return false;
      });
      return false;
    });
    return temp;
  };

  const moveUserIds = data => {
    //그룹의 obid를 한곳에 몰아넣는 작업
    if (data.children[0] !== undefined) {
      data.children.map(i => {
        moveUserIds(i);
        return false;
      });
    }
    if (data.user_obids[0] !== undefined) {
      data.children = data.children.concat(data.user_obids);
    }
  };

  const filterAccesses = result => {
    let employee = result.filter(
      access => access._id.avatar_type === 1
    );
    let stranger = result.filter(
      access => access._id.avatar_type === 3
    );
    let black = result.filter(
      access => access._id.avatar_type === 4
    );
    
    let dates = [
      date[0],
      dateChange(date[0], 1),
      dateChange(date[0], 2),
      dateChange(date[0], 3),
      dateChange(date[0], 4),
      dateChange(date[0], 5),
      date[1]
    ];

    let temp = statsData(employee, stranger, black, dates);

    setPeopleData({
      employee: temp[0],
      visitor: temp[1],
      stranger: temp[2],
      black: temp[3]
    });
  };

  const filterErrors = result => {
    let disconnect = result.filter(
      error => error.log_no === 3 && error.stb_sn === device
    );
    let cpu = result.filter(
      error => error.log_no === 32 && error.stb_sn === device
    );
    let memory = result.filter(
      error => error.log_no === 33 && error.stb_sn === device
    );
    let dates = [
      date[0],
      dateChange(date[0], 1),
      dateChange(date[0], 2),
      dateChange(date[0], 3),
      dateChange(date[0], 4),
      dateChange(date[0], 5),
      date[1]
    ];

    let temp = statsErrorData(disconnect, cpu, memory, dates);
    setErrorData({
      disconnect: temp[0],
      cpu: temp[1],
      memory: temp[2],
      black: temp[3]
    });
  };

  async function getAccesses() {
    let result = await axios.get(base_url + `/access?date=${date[0]}/${date[1]}&device=${device}&type=deviceStats`);
    setAllPeopleData(result.data);
    filterAccesses(result.data);

    setLoading(false);
  }

  async function getDevices() {
    let result = await axios.get(
      base_url + '/camera?authority=' + props.authority
    )
    if (result.data.length > 0) {
      setDevices(result.data);
      setDevice(result.data[0].serial_number);
    }
  }

  async function getErrors() {
    let result = await axios.get(base_url + `/glogs?type=error&date=${date[0]}/${date[1]}`);
    setAllErrorData(result.data);
    filterErrors(result.data);
  }

  const dateChange = (date, value) => {
    return moment(date)
      .add(value, 'days')
      .format('YYYY-MM-DD');
  };

  const handleDeviceChange = e => {
    setDevice(e.target.value);
  };

  const handleDate = val => {
    setDate(val);
  };

  useEffect(() => {
    if(device !== '') {
      setLoading(true)
      getAccesses();
      getErrors();
    }

  }, [device,date]);

  useEffect(() => {
    getDevices();
  },[])

  return (
    <div className={classes.root}>
      {loading ? (
        <Grid
          container
          style={{ height: '75vh' }}
          direction="row"
          justify="center"
          alignItems="center">
          <CircularProgress />
        </Grid>
      ) : (
        <Grid container spacing={3}>
          <Grid item lg={12} md={12} xl={12} xs={12}>
            <IntlProvider locale={kor}>
              <DateRangePicker
                cleanable={false}
                disabledDate={allowedDays(7)}
                defaultValue={[
                  new Date(
                    moment()
                      .subtract(6, 'days')
                      .format('YYYY-MM-DD')
                  ),
                  new Date()
                ]}
                onChange={val => {
                  handleDate([val[0].yyyymmdd(), val[1].yyyymmdd()]);
                }}
                ranges={[]}
              />
            </IntlProvider>
            <Select
              name="device"
              value={device}
              style={{ width: '10%', marginLeft: '10px' }}
              onChange={handleDeviceChange}>
              {devices.map(device => (
                <MenuItem value={device.serial_number}>{device.name}</MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item lg={12} md={12} xl={12} xs={12}>
            <DeviceStats
              chartData={peopleData}
              date={[
                date[0],
                dateChange(date[0], 1),
                dateChange(date[0], 2),
                dateChange(date[0], 3),
                dateChange(date[0], 4),
                dateChange(date[0], 5),
                date[1]
              ]}
            />
          </Grid>
          <Grid item lg={12} md={12} xl={12} xs={12}>
            <DeviceError
              chartData={errorData}
              date={[
                date[0],
                dateChange(date[0], 1),
                dateChange(date[0], 2),
                dateChange(date[0], 3),
                dateChange(date[0], 4),
                dateChange(date[0], 5),
                date[1]
              ]}
            />
          </Grid>
        </Grid>
      )}
    </div>
  );
};

export default Statistics;
