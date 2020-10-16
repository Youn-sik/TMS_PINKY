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

const AccessStat = props => {
  const classes = useStyles();
  const { allowedDays } = DateRangePicker;
  const [date, setDate] = useState([
    moment().format('YYYY-MM-DD'),
    moment().format('YYYY-MM-DD')
  ]);
  const [peopleData, setPeopleData] = useState([]);
  const [devices, setDevices] = useState([]);
  const [device, setDevice] = useState('all');
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [accesses, setAccesses] = useState([]);
  const [chartData, setChartData] = useState({});

  async function getAccesses() {
    setLoading(true);
    let result = await axios.get(base_url + `/access?type=deviceGroupAccesses&device=${device}&date=${date[0]}/${date[1]}`);
    setPeopleData(result.data);
    setLoading(false);
  }

  const filterAccesses = () => {
    let temp = JSON.parse(JSON.stringify(peopleData));
    let labels = [];
    let data = [];
    let maxTemp = [];
    let accessData = [];
    ['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23']
    .forEach(function(time,index) {
      if(!temp[index]) {
        temp.push({
          _id:time,
          count:0,
          maxTemp:'0',
          maxUrl:'',
        })
      } else if(temp[index]._id !== time) {
        temp.splice(index,0,{
          _id:time,
          count:0,
          maxTemp:'0',
          maxUrl:'',
        })
      }

    })
    temp.map(i => {
      labels.push(i._id);
      data.push(i.count);
      maxTemp.push(i.maxTemp);
      accessData.push({avatar_file_url:i.maxUrl,avatar_type:i.maxType});
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
    }
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
    getAccesses();
  }, [date,device]);

  useEffect(() => {
    getDevices();
  }, []);

  useEffect(() => {
    if(devices.length > 0) {
      filterAccesses();
    }
  }, [peopleData]);

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
                defaultValue={[new Date(date[0]), new Date(date[0])]}
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
                <MenuItem value='all'>전체</MenuItem>
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
