import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from 'axios';
import mqtt from 'mqtt'
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
import './Dashboard.css';
const client = mqtt.connect('ws://172.16.135.89:8083/mqtt')

client.on('connect',() => {
  client.subscribe('/access/realtime/result/+')
})

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  },
  accessCard: {
    height:"125px;"
  }
}));

const Dashboard = (props) => {
  let base_url = "http://"+window.location.href.split('/')[2]+":3000"
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
  const [errors,setErrors] = useState([])

  //온도 경고
  const [temp,setTemp] = useState([{}])

  const [loading,setLoading] = useState(true);

  const [isActive,setActive] = useState(false);

  const [attendanceData,setAttendanceData] = useState([]);

  async function countAccess() {
    let result = await axios.get(base_url+'/access?type=todayStatistics')
    result.data.map((i) => {
      if(i._id.type === 1) setEmployee(i.count)
      else if(i._id.type === 2) setVisitor(i.count)
      else if(i._id.type === 3) setStranger(i.count)
      else if(i._id.type === 5) setBlack(i.count)
      return false;
    })
  }

  async function deviceState() {
    let result = await axios.get(base_url+'/camera',{params:{authority:props.authority}})
    result.data.map((i) => {
      if(i.status === 'Y') {
        setOn(on => on+1);
      } else {
        setOff(off => off+1);
      }
      return false;
    })
  }

  async function attendanceChart() {
    let result = await axios.get(base_url+'/access?type=todayAttendance')
    setAttendanceData(result.data)
    result.data.map((i) => {
      if(i.access_time.split(' ')[1] <= '09:00:00') {
        setAttendance(attendance => attendance+1);
      } else {
        setLate(late => late+1);
      }
      return false;
    })
  }
  async function device_errors() {
    let result = await axios.get(base_url+'/glogs?type=limit5errors')
    setErrors(result.data)
  }

  async function temp_alerts() {
    let result = await axios.get(base_url+"/access?type=temperature")
    setTemp(result.data)
    setLoading(false);
  }

  const _setRealtime = (values) => {
    setTemp(temp => [values[0], ...temp]);
    let _attendance = 0;
    let _late = 0
    let _attendanceData = JSON.parse(JSON.stringify(attendanceData));
    if(values[0].avatar_type === 1) {
      setEmployee(employee => employee + 1)
    } else if (values[0].avatar_type === 2) {
      setVisitor(visitor => visitor + 1)
    } else if (values[0].avatar_type === 3) { 
      setStranger(stranger => stranger + 1)
    } else {
      setBlack(black => black + 1)
    }
    // setAttendanceData((attendance) => {
    //   attendance.map((i) => {
    //     if(i._id.user_obid === values[0].user_obid) {
    //       i.count++;
    //       return i
    //     } else  if(values[0].avatar_type === 1){
    //       return({
    //         access_time : values[0].access_time,
    //         count: 1,
    //         _id : {
    //           avatar_type: 1,
    //           user_obid: values[0].user_obid
    //         }
    //       })
    //     } else {
    //       return i
    //     }
    //   })
    //   console.log(attendance);
      // attendance.map((i) => {
      //   if(i.access_time.split(' ')[1] <= '09:00:00') {
      //     _attendance++;
      //   } else {
      //     _late++;
      //   }
      //   return false;
      // })
      // console.log(attendance,_attendance,_late);
      // setAttendance(_attendance)
      // setLate(_late);
      // return temp;
    // })
  }

  useEffect(() => {
    countAccess();
    deviceState();
    attendanceChart();
    device_errors();
    temp_alerts();
  },[])

  useEffect(() => {
    client.on('message', function (topic, message) {
      if(topic.indexOf("/access/realtime/result/") > -1) {
        _setRealtime(JSON.parse(message.toString()).values)
      } 
    })
  },[])

  return (
    <div className={classes.root + " dashboard"}>
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
          <Employee history={props.history} count={employee} />
        </Grid>
        <Grid
          item
          className={classes.accessCard}
          lg={3}
          sm={6}
          xl={3}
          xs={12}
        >
          <Visitor history={props.history} count={visitor} />
        </Grid>
        <Grid
          item
          className={classes.accessCard}
          lg={3}
          sm={6}
          xl={3}
          xs={12}
        >
          <Black history={props.history} count={black}/>
        </Grid>
        <Grid
          item
          className={classes.accessCard}
          lg={3}
          sm={6}
          xl={3}
          xs={12}
        >
          <Stranger history={props.history} count={stranger}/>
        </Grid>
        <Grid
          item
          lg={4}
          md={6}
          xl={4}
          xs={12}
        >
          <Device history={props.history} on={on} off={off} />
        </Grid>
        <Grid
          item
          lg={4}
          md={6}
          xl={4}
          xs={12}
        >
          <Access history={props.history} employee={employee} visitor={visitor} black={black} stranger={stranger}/>
        </Grid>
        <Grid
          item
          lg={4}
          md={6}
          xl={4}
          xs={12}
        >
          <Attendance history={props.history} attendance={attendance} late={late}/>
        </Grid>
        <Grid
          item
          lg={6}
          md={6}
          xl={6}
          xs={12}
        >
          <DeviceErrors history={props.history} errors={errors}/>
        </Grid>
        <Grid
          item
          lg={6}
          md={12}
          xl={6}
          xs={12}
        >
          <TempAlert tempType={props.tempType} tempLimit={props.tempLimit} history={props.history} temp={temp}/>
        </Grid>
      </Grid>}
    </div>
  );
};

export default Dashboard;
