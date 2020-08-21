import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from 'axios';

import {
  Employee,
  Visitor,
  Black,
  Stranger,
  Device,
  Access,
  TempAlert,
  DeviceErrors,
  Attendance
} from './components';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  },
  accessCard: {
    height:"125px;"
  }
}));

const Dashboard = () => {
  const classes = useStyles();
  //사용자
  const [employee,setEmployee] = useState(0);
  const [visitor,setVisitor] = useState(0);
  const [black,setBlack] = useState(0);
  const [stranger,setStranger] = useState(0);

  //단말
  const [on,setOn] = useState(0);
  const [off,setOff] = useState(0);

  //출석
  const [attendance,setAttendance] = useState(0)
  const [late,setLate] = useState(0)

  //에러
  const [errors,setErrors] = useState([{}])

  //온도 경고
  const [temp,setTemp] = useState([{}])

  const [loading,setLoading] = useState(true);

  async function countAccess() {
    let result = await axios.get('http://172.16.135.89:3000/access?type=todayStatistics')
    result.data.map((i) => {
      if(i._id.type === 1) setEmployee(i.count)
      else if(i._id.type === 2) setVisitor(i.count)
      else if(i._id.type === 3) setStranger(i.count)
      else if(i._id.type === 4) setBlack(i.count)
      return;
    })
  }

  async function deviceState() {
    let result = await axios.get('http://172.16.135.89:3000/camera')
    result.data.map((i) => {
      if(i.status === 'Y') {
        setOn(on => on+1);
      } else {
        setOff(off => off+1);
      }
      return;
    })
  }

  async function attendanceChart() {
    let result = await axios.get('http://172.16.135.89:3000/access?type=todayAttendance')
    result.data.map((i) => {
      if(i.access_time.split(' ')[1] <= '09:00:00') {
        setAttendance(attendance => attendance+1);
      } else {
        setLate(late => late+1);
      }
      return;
    })
  }

  async function device_errors() {
    let result = await axios.get('http://172.16.135.89:3000/glogs?type=limit5errors')
    setErrors(result.data)
  }

  async function temp_alerts() {
    let result = await axios.get("http://172.16.135.89:3000/access?type=temperature")
    setTemp(result.data)
    setLoading(false);
  }

  useEffect(() => {
    countAccess();
    deviceState();
    attendanceChart();
    device_errors();
    temp_alerts();
  },[])

  return (
    <div className={classes.root}>
      {
      loading ? 
      <Grid
      container
      style={{height:"75vh"}}
      direction="row"
      justify="center"
      alignItems="center"
      >
        <CircularProgress />
      </Grid> :
      <Grid
        container
        spacing={4}
      >
        <Grid
          item
          className={classes.accessCard}
          lg={3}
          sm={6}
          xl={3}
          xs={12}
        >
          <Employee count={employee} />
        </Grid>
        <Grid
          item
          className={classes.accessCard}
          lg={3}
          sm={6}
          xl={3}
          xs={12}
        >
          <Visitor count={visitor} />
        </Grid>
        <Grid
          item
          className={classes.accessCard}
          lg={3}
          sm={6}
          xl={3}
          xs={12}
        >
          <Black count={black}/>
        </Grid>
        <Grid
          item
          className={classes.accessCard}
          lg={3}
          sm={6}
          xl={3}
          xs={12}
        >
          <Stranger count={stranger}/>
        </Grid>
        <Grid
          item
          lg={4}
          md={6}
          xl={4}
          xs={12}
        >
          <Device on={on} off={off} />
        </Grid>
        <Grid
          item
          lg={4}
          md={6}
          xl={4}
          xs={12}
        >
          <Access employee={employee} visitor={visitor} black={black} stranger={stranger}/>
        </Grid>
        <Grid
          item
          lg={4}
          md={6}
          xl={4}
          xs={12}
        >
          <Attendance attendance={attendance} late={late}/>
        </Grid>
        <Grid
          item
          lg={4}
          md={6}
          xl={8}
          xs={12}
        >
          <DeviceErrors errors={errors}/>
        </Grid>
        <Grid
          item
          lg={8}
          md={12}
          xl={4}
          xs={12}
        >
          <TempAlert temp={temp}/>
        </Grid>
      </Grid>}
    </div>
  );
};

export default Dashboard;
