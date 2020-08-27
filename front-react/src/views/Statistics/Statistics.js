import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid,Select,MenuItem } from '@material-ui/core';
import axios from 'axios';
import {DateRangePicker,IntlProvider} from 'rsuite'
import kor from 'rsuite/lib/IntlProvider/locales/ko_KR';
import moment from 'moment';
import CircularProgress from '@material-ui/core/CircularProgress';
import 'moment/locale/ko'
import {
  DeviceStats,
  DeviceError,
  Access,
  Attendance,
  Tree,
} from './components';
// eslint-disable-next-line no-extend-native
Date.prototype.yyyymmdd = function()
{
    var yyyy = this.getFullYear().toString();
    var mm = (this.getMonth() + 1).toString();
    var dd = this.getDate().toString();
 
    return yyyy +'-'+ (mm[1] ? mm : '0'+mm[0]) +'-'+ (dd[1] ? dd : '0'+dd[0]);
}

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  },
  accessCard: {
    height:"125px;"
  }
}));


const Statistics = () => {
  const classes = useStyles();
  const {allowedDays} = DateRangePicker;
  const [date,setDate] = useState([moment().subtract(6, 'days').format('YYYY-MM-DD'),moment().format('YYYY-MM-DD')])
  const [allPeopleData,setAllPeopleData] = useState([]);
  const [peopleData,setPeopleData] = useState({});
  const [devices,setDevices] = useState([]);
  const [device,setDevice] = useState({})
  const [count,setCount] = useState(0);
  const [errorData,setErrorData] = useState({});
  const [allErrorData,setAllErrorData] = useState({});
  const [groups,setGroups] = useState([]);
  const [clickedNode,setClickedNode] = useState({});
  const [loading,setLoading] = useState(true);
  const [attendance,setAttendance] = useState({
    att:0,
    late:0
  });
  const [attList,setAttList] = useState([]);

  const statsData = (employee,visitor,stranger,black,dates) => {
    let temp = [
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
    ]
    dates.map((date,index) => {
      employee.map((i) => {
        if(i.access_time.split(' ')[0] === date) temp[0][index]++
        return false;
      });
      visitor.map((i) => {
        if(i.access_time.split(' ')[0] === date) temp[1][index]++
        return false;
      });
      stranger.map((i) => {
        if(i.access_time.split(' ')[0] === date) temp[2][index]++
        return false;
      });
      black.map((i) => {
        if(i.access_time.split(' ')[0] === date) temp[3][index]++
        return false;
      })
      return false;
    })
    return temp
  }

  // error.log_no === 3 ? "연결 끊김" : 
  // error.log_no === 32 ? "CPU과다 사용" : "메모리 과다 사용"

  const statsErrorData = (disconnect,cpu,memory,dates) => {
    let temp = [
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
    ]
    dates.map((date,index) => {
      disconnect.map((i) => {
        if(i.regdate.split(' ')[0] === date) temp[0][index]++
        return false;
      });
      cpu.map((i) => {
        if(i.regdate.split(' ')[0] === date) temp[1][index]++
        return false;
      });
      memory.map((i) => {
        if(i.regdate.split(' ')[0] === date) temp[2][index]++
        return false;
      });
      return false;
    })
    return temp
  }

  const moveUserIds = (data) => { //그룹의 obid를 한곳에 몰아넣는 작업
    if(data.children[0] !== undefined) {
        data.children.map((i) => {
            moveUserIds(i)
            return false;
        })
    }
    if(data.user_obids[0] !== undefined) {
      data.children = data.children.concat(data.user_obids);
    }
  }

  const _setClickedNode = (node) => {
    setClickedNode(node);
  }
  
  async function getGroups() {
    let tempGroups = await axios.get('http://172.16.135.89:3000/group')
    tempGroups.data.map((i) => {//user_obids에 있는 데이터 children으로 옮기기
      moveUserIds(i);
      return false;
    })
    let index = tempGroups.data.findIndex(i => i.name === "undefined");
    if(index !== -1) {
      let undefinedGroup = tempGroups.data.splice(index,1);
      tempGroups.data.push(undefinedGroup[0]);
    }
    setGroups(tempGroups.data);
  }

  const filterAccesses = (result) => {
    let employee = result.filter(access => (access.avatar_type === 1 && access.stb_sn === device))
    let visitor = result.filter(access => (access.avatar_type === 2 && access.stb_sn === device))
    let stranger = result.filter(access => (access.avatar_type === 3 && access.stb_sn === device))
    let black = result.filter(access => (access.avatar_type === 5 && access.stb_sn === device))
    let dates = [date[0],dateChange(date[0],1),dateChange(date[0],2),dateChange(date[0],3),dateChange(date[0],4),dateChange(date[0],5),date[1]];

    let temp = statsData(employee,visitor,stranger,black,dates)

    setPeopleData({
      employee : temp[0],
      visitor : temp[1],
      stranger : temp[2],
      black : temp[3],
    })

    setLoading(false);
  } 
 
  const filterErrors = (result) => {
    let disconnect = result.filter(error => (error.log_no === 3 && error.stb_sn === device))
    let cpu = result.filter(error => (error.log_no === 32 && error.stb_sn === device))
    let memory = result.filter(error => (error.log_no === 33 && error.stb_sn === device))
    let dates = [date[0],dateChange(date[0],1),dateChange(date[0],2),dateChange(date[0],3),dateChange(date[0],4),dateChange(date[0],5),date[1]];

    let temp = statsErrorData(disconnect,cpu,memory,dates)
    setErrorData({
      disconnect : temp[0],
      cpu : temp[1],
      memory : temp[2],
      black : temp[3],
    })
  }

  async function getAccesses() {
    let result = await axios.get('http://172.16.135.89:3000/access')
    setAllPeopleData(result.data)
    filterAccesses(result.data)
  }

  async function getDevices() {
    let result = await axios.get('http://172.16.135.89:3000/camera')
    setDevices(result.data);
    setDevice(result.data[0].serial_number);
  }

  async function getErrors() {
    let result = await axios.get('http://172.16.135.89:3000/glogs?type=error')
    setAllErrorData(result.data);
    filterErrors(result.data)
  }

  const dateChange = (date,value) => {
    return moment(date).add(value,'days').format('YYYY-MM-DD')
  }

  const handleDeviceChange = (e) => {
    setDevice(e.target.value);
    setCount(count+1);
  }

  const handleDate = (val) => {
    setDate(val);
    setCount(count+1);
  }
  
  useEffect(() => {
    if(count) {
      filterAccesses(allPeopleData)
      filterErrors(allErrorData)
    }
  },[count])

  useEffect(() => {
    getDevices()
    getAccesses()
    getErrors()
    getGroups()
  },[])

  useEffect(() => {
    let _attlist = [];
    let _attendance = {att:0,late:0}
    allPeopleData.map((person) => {
      if(clickedNode.avatar_contraction_data === person.avatar_contraction_data && person.access_time.split(' ')[0] >= date[0] && person.access_time.split(' ')[0] <= date[1]){
        _attlist = [
          ..._attlist,
          person
        ]
        if(person.access_time.split(' ')[1] > '09:00:00'){
          _attendance = {
            ..._attendance,
            "late" : _attendance.late+1
          }
        } else {
          _attendance = {
            ..._attendance,
            "att" : _attendance.att+1
          }
        }
      }
      return false;
    })
    setAttendance(_attendance);
    setAttList(_attlist)
  },[clickedNode,date])

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
        lg={12}
        md={12}
        xl={12}
        xs={12}
        >
        <IntlProvider locale={kor}>
          <DateRangePicker 
            cleanable={false}
            showOneCalendar 
            disabledDate={allowedDays(7)}
            defaultValue={[new Date(moment().subtract(6, 'days').format('YYYY-MM-DD')), new Date()]}
            onChange={(val) => {handleDate([val[0].yyyymmdd(),val[1].yyyymmdd()])}}
          />
        </IntlProvider>
        <Select
          name="device"
          value={device}
          style={{width:'10%',marginLeft:"10px"}} 
          onChange={handleDeviceChange}
          >
            {devices.map(device => <MenuItem value={device.serial_number}>{device.name}</MenuItem>)}
        </Select>
        </Grid>
        <Grid
          item
          lg={6}
          md={6}
          xl={6}
          xs={12}
        >
        <DeviceStats chartData={peopleData} date={[date[0],dateChange(date[0],1),dateChange(date[0],2),dateChange(date[0],3),dateChange(date[0],4),dateChange(date[0],5),date[1]]}/>
        </Grid>
        <Grid
          item
          lg={6}
          md={6}
          xl={6}
          xs={12}
        >
        <DeviceError chartData={errorData} date={[date[0],dateChange(date[0],1),dateChange(date[0],2),dateChange(date[0],3),dateChange(date[0],4),dateChange(date[0],5),date[1]]}/>
        </Grid>
        <Grid
          item
          lg={3}
          md={3}
          xl={3}
          xs={12}
        >
          <Tree 
          setClickedNode={_setClickedNode}
          clickedNode={clickedNode}
          groups={groups} 
          />
        </Grid>
        <Grid
          item
          lg={5}
          md={5}
          xl={5}
          xs={12}
        >
          <Attendance clickedNode={clickedNode} attendance={attendance.att} late={attendance.late}/>
        </Grid>
        <Grid
          item
          lg={4}
          md={4}
          xl={4}
          xs={12}
        >
          <Access clickedNode={clickedNode} temp={attList}/>
        </Grid>
      </Grid>
      }
    </div>
  );
};

export default Statistics;
