import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import axios from 'axios';
import { DateRangePicker, IntlProvider } from 'rsuite';
import kor from 'rsuite/lib/IntlProvider/locales/ko_KR';
import moment from 'moment';
import CircularProgress from '@material-ui/core/CircularProgress';
import 'moment/locale/ko';
import { Access, TempChart, Attendance, Tree } from './components';
import {base_url as in_base_url,out_base_url} from 'server.json';

let currentUrl = window.location.href
let base_url = in_base_url
// console.log(currentUrl.indexOf("172.16.41.114"))
if(currentUrl.indexOf("172.16.41.114") <= -1) {
  base_url = out_base_url
}

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
  },
  temp: {
    [theme.breakpoints.down('sm')]: {
      marginBottom: '390px'
    }
  }
}));

const UsersStat = props => {
  const classes = useStyles();
  const { allowedDays } = DateRangePicker;
  const [date, setDate] = useState([
    moment()
      .subtract(6, 'days')
      .format('YYYY-MM-DD'),
    moment().format('YYYY-MM-DD')
  ]);
  const [allPeopleData, setAllPeopleData] = useState([]);
  const [count, setCount] = useState(0);
  const [groups, setGroups] = useState([]);
  const [clickedNode, setClickedNode] = useState({});
  const [loading, setLoading] = useState(true);
  const [attendance, setAttendance] = useState({
    att: 0,
    late: 0
  });
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [temp, setTemp] = useState({
    abnormal: 0,
    normal: 0
  });
  const [search, setSearch] = useState('');

  const [attList, setAttList] = useState([]);

  const [activeType, setActiveType] = useState('time');

  const [openNode, setOpenNode] = useState(['??????', '?????????', '???????????????']);

  const filteringGroups = (search, group) => {
    if (group.children.length > 0) {
      //????????? ?????? ?????? ????????? ??????
      setOpenNode(node => [...node, group._id]);
      group.children = group.children.filter(child => {
        if (child.children === undefined && child.name.indexOf(search) !== -1) {
          //?????? ??? user??? ????????? ?????? ????????? return
          return true;
        } else if (Array.isArray(child.children) && child.children.length > 0) {
          //??????,????????? ?????? ????????? ???????????? ?????? ?????? ?????? return ?????? ????????? ??????
          let result = filteringGroups(search, child);
          if (
            result &&
            Array.isArray(result.children) &&
            result.children.length > 0
          ) {
            return true;
          }
        }
      });
    }
    if (group.children.length > 0) {
      //?????? ????????? ???????????? ?????? ?????? return
      return group;
    }
  };

  const handleSearch = e => {
    let _groups = JSON.parse(JSON.stringify(groups));
    setOpenNode(['??????', '?????????', '???????????????']);
    setSearch(e.target.value);
    if (e.target.value !== '') {
      let _filteredGroups = JSON.parse(
        JSON.stringify(
          _groups.map(group => filteringGroups(e.target.value, group))
        )
      );
      _filteredGroups = _filteredGroups.filter(group => group !== null);
      setFilteredGroups(_filteredGroups);
    } else {
      setFilteredGroups([]);
    }
  };

  const _setOpenNode = (e, nodeIds) => {
    setOpenNode(nodeIds);
  };

  const sortAccesses = (type, headerType) => {
    setActiveType(headerType);
    if (headerType === 'time') {
      if (type === 'asc') {
        setAttList(
          attList.sort((a, b) => {
            if (a.access_time < b.access_time) return -1;
            else if (b.access_time < a.access_time) return 1;
            else return 0;
          })
        );
      } else {
        setAttList(
          attList.sort((a, b) => {
            if (a.access_time > b.access_time) return -1;
            else if (b.access_time > a.access_time) return 1;
            else return 0;
          })
        );
      }
    } else {
      if (type === 'asc') {
        setAttList(
          attList.sort((a, b) => {
            return (
              parseFloat(a.avatar_temperature) -
              parseFloat(b.avatar_temperature)
            );
          })
        );
      } else {
        setAttList(
          attList.sort((a, b) => {
            return (
              parseFloat(b.avatar_temperature) -
              parseFloat(a.avatar_temperature)
            );
          })
        );
      }
    }
  };

  const moveUserIds = data => {
    //????????? obid??? ????????? ???????????? ??????
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

  const _setClickedNode = node => {
    setClickedNode(node);
  };

  async function getGroups() {
    let tempGroups = await axios.get(base_url + '/group');
    if(tempGroups && tempGroups.data.length > 0){
      tempGroups.data.map(i => {
        //user_obids??? ?????? ????????? children?????? ?????????
        moveUserIds(i);
        return false;
      });
      let index = tempGroups.data.findIndex(i => i.name === 'undefined');
      if (index !== -1) {
        let undefinedGroup = tempGroups.data.splice(index, 1);
        tempGroups.data.push(undefinedGroup[0]);
      }
      setGroups(tempGroups.data);
    }
  }

  async function getAccesses() {
    let result = await axios.get(base_url + '/access');
    if(result && result.data.length > 0){
      setAllPeopleData(result.data.reverse());
    }
  }

  const handleDate = val => {
    setDate(val);
    setCount(count + 1);
  };

  useEffect(() => {
    getAccesses();
    getGroups();
  }, []);

  const locale = {
    sunday: '???',
    monday: '???',
    tuesday: '???',
    wednesday: '???',
    thursday: '???',
    friday: '???',
    saturday: '???',
    ok: '??????',
    today: '??????',
    yesterday: '??????',
    hours: '??????',
    minutes: '???',
    seconds: '???',
    last7Days: '????????????'
  }

  useEffect(() => {
    let _attlist = [];
    let _attendance = { att: 0, late: 0 };
    let _temp = { abnormal: 0, normal: 0 };
    if (Object.keys(clickedNode).length === 0 && allPeopleData.length !== 0) {
      let accesses = allPeopleData.filter(i => i.avatar_type !== 3);
      accesses.map(access => {
        if (
          access.access_time.split(' ')[0] >= date[0] &&
          access.access_time.split(' ')[0] <= date[1]
        ) {
          _attlist = [..._attlist, access];
          if (access.access_time.split(' ')[1] > '09:00:00') {
            _attendance = {
              ..._attendance,
              late: _attendance.late + 1
            };
          } else {
            _attendance = {
              ..._attendance,
              att: _attendance.att + 1
            };
          }

          if (parseInt(access.avatar_temperature) >= 37.5) {
            _temp = {
              ..._temp,
              abnormal: _temp.abnormal + 1
            };
          } else {
            _temp = {
              ..._temp,
              normal: _temp.normal + 1
            };
          }
        }
        return false;
      });
    } else {
      allPeopleData.map(person => {
        if (
          clickedNode._id === person.user_obid &&
          person.access_time.split(' ')[0] >= date[0] &&
          person.access_time.split(' ')[0] <= date[1]
        ) {
          _attlist = [..._attlist, person];
          if (person.access_time.split(' ')[1] > '09:00:00') {
            _attendance = {
              ..._attendance,
              late: _attendance.late + 1
            };
          } else {
            _attendance = {
              ..._attendance,
              att: _attendance.att + 1
            };
          }

          if (parseInt(person.avatar_temperature) >= 37.5) {
            _temp = {
              ..._temp,
              abnormal: _temp.abnormal + 1
            };
          } else {
            _temp = {
              ..._temp,
              normal: _temp.normal + 1
            };
          }
        }
        return false;
      });
    }
    setLoading(false);
    setAttendance(_attendance);
    setAttList(_attlist);
    setTemp(_temp);
  }, [clickedNode, date, allPeopleData]);

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
          <Grid
            item
            lg={12}
            md={12}
            xl={12}
            xs={12}
            style={{ maxHeight: '418px' }}>
            <IntlProvider locale={kor}>
              <DateRangePicker
                locale={locale}
                size="lg"
                cleanable={false}
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
          </Grid>
          <Grid
            item
            lg={2}
            md={2}
            xl={2}
            xs={12}
            style={{ maxHeight: '410px' }}>
            <Tree
              openNode={openNode}
              search={search}
              handleSearch={handleSearch}
              setClickedNode={_setClickedNode}
              setOpenNode={_setOpenNode}
              clickedNode={clickedNode}
              groups={search !== '' ? filteredGroups : groups}
            />
          </Grid>
          <Grid
            item
            lg={5}
            md={5}
            xl={5}
            xs={12}
            style={{ maxHeight: '410px' }}>
            <Attendance
              history={props.history}
              clickedNode={clickedNode}
              attendance={attendance.att}
              late={attendance.late}
            />
          </Grid>
          <Grid
            item
            lg={5}
            md={5}
            xl={5}
            xs={12}
            className={classes.temp}
            style={{ maxHeight: '410px' }}>
            <TempChart
              history={props.history}
              clickedNode={clickedNode}
              attendance={temp.normal}
              late={temp.abnormal}
            />
          </Grid>
          <Grid item lg={7} md={7} xl={7} xs={12}>
            <Access
              tempLimit={props.tempLimit}
              tempType={props.tempType}
              activeType={activeType}
              sortAccesses={sortAccesses}
              clickedNode={clickedNode}
              temp={attList}
            />
          </Grid>
        </Grid>
      )}
    </div>
  );
};

export default UsersStat;
