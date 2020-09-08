import React, { useState,useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import axios from 'axios';
import { UsersToolbar, UsersTable } from './components';
import Card from '@material-ui/core/Card';
import moment from 'moment';
import 'moment/locale/ko'
const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  content: {
    marginTop: theme.spacing(2)
  },
  cardcontent: {
    padding: 0,
    "&:last-child": {
      paddingBottom: 0
    }
  },
  toolbar: {
    padding:"20px 0px 10px 20px"
  }
}));

const UserList = () => {
  const [accesses,setAccesses] = useState([]);//출입 기록
  const [filteredUsers,setFilteredUsers] = useState([]);//검색된 유저 리스트
  const [users,setUsers] = useState([]);//유저 리스트
  const [date,setDate] = useState([moment().locale('ko').format('YYYY-MM-DD'), moment().locale('ko').format('YYYY-MM-DD')]);
  const [searchVal, setSearchVal] = useState("");
  const [loading, setLoading] = useState(true);


  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  async function getUsers () {
    let result = await axios.get('http://172.16.135.89:3000/user?type=1',{cancelToken: source.token})
    result.data.reverse()
    result.data.map((user) => {
      user.late=0
      user.attendance=0
      return false;
    })
    setUsers(result.data)
    setLoading(false);
  }

  async function getAccesses () {
    let result = await axios.get('http://172.16.135.89:3000/access?type=attendance',{cancelToken: source.token})
    result.data.reverse()
    setAccesses(result.data)
  }

  useEffect(() => {
    getUsers();
    getAccesses();
    return () => {
      source.cancel('Operation canceled by the user.');
    }
  },[])

  useEffect(() => {
    if(accesses.length) {
      let todayAccesses = accesses.filter(access => access.access_time.split(' ')[0] === date[0])
      let tempUsers = JSON.parse(JSON.stringify( users ));
      if(todayAccesses.length) {
        todayAccesses.map((access) => {
          let index = users.findIndex(j => j._id === access.user_obid);
          if(access.access_time.split(' ')[1] > '09:00:00' && index !== -1){
            tempUsers[index].late = 1;
          } else if(index !== -1) {
            tempUsers[index].attendance = 1;
          }
          return false;
        })
        setUsers(tempUsers);
      }
    }
  },[accesses])

  const classes = useStyles();

  const searchEvent = (e) => {
    setSearchVal(e.target.value)
    if(e.target.value === '') {
      setFilteredUsers([]);
    } else {
      setFilteredUsers(users.filter(user => user.name.indexOf(e.target.value) !== -1  || 
        user.location.indexOf(e.target.value) !== -1 ||
        user.department_id.indexOf(e.target.value) !== -1 || 
        user.position.indexOf(e.target.value) !== -1))
    }
  }

  const handleDate = (val) => {
    setDate(val);
    let date_accesses = accesses.filter(access => access.access_time.split(' ')[0] >= val[0] && access.access_time.split(' ')[0] <= val[1])
    let tempUsers = JSON.parse(JSON.stringify( users ));
    tempUsers.map((user) => {
      user.late=0
      user.attendance=0
      return false;
    })

    if(date_accesses.length) {
      date_accesses.map((access) => {
        let index = users.findIndex(j => j._id === access.user_obid);
        if(access.access_time.split(' ')[1] > '09:00:00' && index !== -1){
          tempUsers[index].late++;
        } else if(index !== -1) {
          tempUsers[index].attendance++;
        }
        return false;
      })
      setUsers(tempUsers);
    }
  }


  return (
    <div className={classes.root}>
      <Card className={classes.root,classes.cardcontent}>
        <UsersToolbar className={classes.toolbar} dateChange={handleDate} search_val={searchVal} search_event={searchEvent}/>
        <div className={classes.content}>
          <UsersTable loading={loading} users={searchVal !== '' ? filteredUsers : users} />
        </div>
      </Card>
    </div>
  );
};

export default UserList;
