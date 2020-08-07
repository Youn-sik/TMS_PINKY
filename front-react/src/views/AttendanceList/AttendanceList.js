import React, { useState,useEffect } from 'react';
import { makeStyles, useTheme } from '@material-ui/styles';
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
  const [accesses,setAccesses] = useState([]);
  const [users,setUsers] = useState([]);//화면에 보여질 유저
  const [originUsers,setOriginUsers] = useState([]);//모든 유저 데이터
  const [date,setDate] = useState([moment().locale('ko').format('YYYY-MM-DD'), moment().locale('ko').format('YYYY-MM-DD')]);
  const [type,setType] = useState('0');
  const [temp,setTemp] = useState('0');
  const [searchVal, setSearchVal] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getAccesses();
    getUsers();
  },[])

  useEffect(() => {
    if(accesses.length) {
      let todayAccesses = accesses.filter(access => access.access_time.split(' ')[0] === date[0])
      let tempUsers = JSON.parse(JSON.stringify( users ));
      if(todayAccesses.length) {
        todayAccesses.map((access) => {
          let index = users.findIndex(j => j.avatar_contraction_data === access.avatar_contraction_data);
          if(access.access_time.split(' ')[1] > '09:00:00' && index !== -1){
            tempUsers[index].late = 1;
          } else if(index !== -1) {
            tempUsers[index].attendance = 1;
          }
        })
        setUsers(tempUsers);
      }
    }
  },[accesses])

  const classes = useStyles();

  async function getUsers () {
    let result = await axios.get('http://172.16.135.89:3000/user?type=1')
    result.data.reverse()
    result.data.map((user) => {
      user.late=0
      user.attendance=0
    })
    setOriginUsers(result.data)
    setUsers(result.data)
    setLoading(false);
  }

  async function getAccesses () {
    let result = await axios.get('http://172.16.135.89:3000/access?type=attendance')
    result.data.reverse()
    setAccesses(result.data)
  }

  const searchEvent = (e) => {
    setSearchVal(e.target.value)
  }

  const handleDate = (val) => {
    setDate(val);
    let date_accesses = accesses.filter(access => access.access_time.split(' ')[0] >= val[0] && access.access_time.split(' ')[0] <= val[1])
    let tempUsers = JSON.parse(JSON.stringify( users ));
    tempUsers.map((user) => {
      user.late=0
      user.attendance=0
    })

    if(date_accesses.length) {
      date_accesses.map((access) => {
        let index = users.findIndex(j => j.avatar_contraction_data === access.avatar_contraction_data);
        if(access.access_time.split(' ')[1] > '09:00:00' && index !== -1){
          tempUsers[index].late++;
        } else if(index !== -1) {
          tempUsers[index].attendance++;
        }
      })
      setUsers(tempUsers);
    }
  }


  return (
    <div className={classes.root}>
      <Card className={classes.root,classes.cardcontent}>
        <UsersToolbar className={classes.toolbar} dateChange={handleDate} search_val={searchVal} search_event={searchEvent}/>
        <div className={classes.content}>
          <UsersTable loading={loading} users={users} />
        </div>
      </Card>
    </div>
  );
};

export default UserList;
