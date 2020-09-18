import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid, Select, MenuItem } from '@material-ui/core';
import axios from 'axios';
import { DateRangePicker, IntlProvider } from 'rsuite';
import kor from 'rsuite/lib/IntlProvider/locales/ko_KR';
import moment from 'moment';
import CircularProgress from '@material-ui/core/CircularProgress';
import 'moment/locale/ko';
import { TimeAccess } from './components';
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

const AccessStat = props => {
  const base_url = 'http://' + window.location.href.split('/')[2] + ':3000';
  const classes = useStyles();
  const { allowedDays } = DateRangePicker;
  const [date, setDate] = useState([
    moment().format('YYYY-MM-DD'),
    moment().format('YYYY-MM-DD')
  ]);
  const [peopleData, setPeopleData] = useState([]);
  const [devices, setDevices] = useState([]);
  const [device, setDevice] = useState({});
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [accesses, setAccesses] = useState([]);
  const [chartData, setChartData] = useState({});
  async function getAccesses() {
    let result = await axios.get(base_url + '/access?type=deviceGroupAccesses');
    setPeopleData(result.data);
    setLoading(false);
  }

  const filterAccesses = () => {
    let temp = JSON.parse(JSON.stringify(peopleData));
    let labels = [];
    let data = [];
    let maxTemp = [];
    let accessData = [];
    temp = temp.filter(i => parseInt(i._id) >= 7 && parseInt(i._id) <= 21);
    temp.map(i => {
      i.accesses = i.accesses.filter(access => {
        return access.date === date[0] && access.stb_sn === device;
      });
      i.max = i.accesses[0];
      i.accesses = i.accesses.length;
      labels.push(i._id);
      data.push(i.accesses);
      maxTemp.push(i.max ? i.max.avatar_temperature : 0);
      accessData.push(i.max);
    });
    setChartData({
      labels,
      data,
      maxTemp,
      accessData
    });
    setAccesses(temp);
  };

  async function getDevices() {
    let result = await axios.get(
      base_url + '/camera?authority=' + props.authority
    );
    if (result.data.length > 0) {
      setDevices(result.data);
      setDevice(result.data[0].serial_number);
    }
  }

  const dateChange = (date, value) => {
    return moment(date)
      .add(value, 'days')
      .format('YYYY-MM-DD');
  };

  const handleDeviceChange = e => {
    setDevice(e.target.value);
    setCount(count + 1);
  };

  const handleDate = val => {
    setDate(val);
    setCount(count + 1);
  };

  useEffect(() => {
    getDevices();
    getAccesses();
  }, []);

  useEffect(() => {
    if (peopleData.length !== 0) {
      filterAccesses();
    }
  }, [device, date, peopleData]);

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
                oneTap
                showOneCalendar
                defaultValue={[new Date(), new Date()]}
                onChange={val => {
                  handleDate([val[0].yyyymmdd()]);
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
            <TimeAccess date={date} chartData={chartData}></TimeAccess>
          </Grid>
        </Grid>
      )}
    </div>
  );
};

export default AccessStat;
