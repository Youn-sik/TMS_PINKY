import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import axios from 'axios';
import { UsersToolbar, UsersTable } from './components';
import Card from '@material-ui/core/Card';
import moment from 'moment';
import 'moment/locale/ko';
import {base_url as in_base_url,out_base_url} from 'server.json';

let currentUrl = window.location.href
let base_url = in_base_url
// console.log(currentUrl.indexOf("172.16.33.130"))
// if(currentUrl.indexOf("172.16.33.130") <= -1) {
//   base_url = out_base_url
// }

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  content: {
    marginTop: theme.spacing(2)
  },
  cardcontent: {
    padding: 0,
    '&:last-child': {
      paddingBottom: 0
    }
  },
  toolbar: {
    padding: '20px 0px 10px 20px'
  }
}));

const UserList = () => {
  const [accesses, setAccesses] = useState([]); //출입 기록
  const [filteredUsers, setFilteredUsers] = useState([]); //검색된 유저 리스트
  const [users, setUsers] = useState([]); //유저 리스트
  const [date, setDate] = useState([
    moment()
      .locale('ko')
      .format('YYYY-MM-DD'),
    moment()
      .locale('ko')
      .format('YYYY-MM-DD')
  ]);
  const [searchVal, setSearchVal] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState('create_at');

  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const sortAccesses = (type, headerType) => {
    setActiveType(headerType);
    if (searchVal === '') {
      if (headerType === 'name') {
        if (type === 'asc') {
          setUsers(
            users.sort((a, b) => {
              if (a.name < b.name) return -1;
              else if (b.name < a.name) return 1;
              else return 0;
            })
          );
        } else {
          setUsers(
            users.sort((a, b) => {
              if (a.name > b.name) return -1;
              else if (b.name > a.name) return 1;
              else return 0;
            })
          );
        }
      } else if (headerType === 'location') {
        if (type === 'asc') {
          setUsers(
            users.sort((a, b) => {
              if (a.location < b.location) return -1;
              else if (b.location < a.location) return 1;
              else return 0;
            })
          );
        } else {
          setUsers(
            users.sort((a, b) => {
              if (a.location > b.location) return -1;
              else if (b.location > a.location) return 1;
              else return 0;
            })
          );
        }
      } else if (headerType === 'depart') {
        if (type === 'asc') {
          setUsers(
            users.sort((a, b) => {
              if (a.department_id < b.department_id) return -1;
              else if (b.department_id < a.department_id) return 1;
              else return 0;
            })
          );
        } else {
          setUsers(
            users.sort((a, b) => {
              if (a.department_id > b.department_id) return -1;
              else if (b.department_id > a.department_id) return 1;
              else return 0;
            })
          );
        }
      } else if (headerType === 'position') {
        if (type === 'asc') {
          setUsers(
            users.sort((a, b) => {
              if (a.position < b.position) return -1;
              else if (b.position < a.position) return 1;
              else return 0;
            })
          );
        } else {
          setUsers(
            users.sort((a, b) => {
              if (a.position > b.position) return -1;
              else if (b.position > a.position) return 1;
              else return 0;
            })
          );
        }
      } else if (headerType === 'attendance') {
        if (type === 'asc') {
          setUsers(
            users.sort((a, b) => {
              if (a.attendance < b.attendance) return -1;
              else if (b.attendance < a.attendance) return 1;
              else return 0;
            })
          );
        } else {
          setUsers(
            users.sort((a, b) => {
              if (a.attendance > b.attendance) return -1;
              else if (b.attendance > a.attendance) return 1;
              else return 0;
            })
          );
        }
      } else if (headerType === 'late') {
        if (type === 'asc') {
          setUsers(
            users.sort((a, b) => {
              if (a.late < b.late) return -1;
              else if (b.late < a.late) return 1;
              else return 0;
            })
          );
        } else {
          setUsers(
            users.sort((a, b) => {
              if (a.late > b.late) return -1;
              else if (b.late > a.late) return 1;
              else return 0;
            })
          );
        }
      }
    } else {
      if (headerType === 'time') {
        if (type === 'asc') {
          setFilteredUsers(
            filteredUsers.sort((a, b) => {
              if (a.access_time < b.access_time) return -1;
              else if (b.access_time < a.access_time) return 1;
              else return 0;
            })
          );
        } else {
          setFilteredUsers(
            filteredUsers.sort((a, b) => {
              if (a.access_time > b.access_time) return -1;
              else if (b.access_time > a.access_time) return 1;
              else return 0;
            })
          );
        }
      } else if (headerType === 'attendance') {
        if (type === 'asc') {
          setFilteredUsers(
            filteredUsers.sort((a, b) => {
              if (a.attendance < b.attendance) return -1;
              else if (b.attendance < a.attendance) return 1;
              else return 0;
            })
          );
        } else {
          setFilteredUsers(
            filteredUsers.sort((a, b) => {
              if (a.attendance > b.attendance) return -1;
              else if (b.attendance > a.attendance) return 1;
              else return 0;
            })
          );
        }
      } else if (headerType === 'late') {
        if (type === 'asc') {
          setFilteredUsers(
            filteredUsers.sort((a, b) => {
              if (a.late < b.late) return -1;
              else if (b.late < a.late) return 1;
              else return 0;
            })
          );
        } else {
          setFilteredUsers(
            filteredUsers.sort((a, b) => {
              if (a.late > b.late) return -1;
              else if (b.late > a.late) return 1;
              else return 0;
            })
          );
        }
      }
    }
  };

  async function getUsers() {
    let result = await axios.get(base_url + '/user?type=1', {
      cancelToken: source.token
    });
    result.data.reverse();
    result.data.map(user => {
      user.late = 0;
      user.attendance = 0;
      return false;
    });
    setUsers(result.data);
    setLoading(false);
  }

  async function getAccesses() {
    let result = await axios.get(base_url + '/access?type=attendance', {
      cancelToken: source.token
    });
    result.data.reverse();
    setAccesses(result.data);
    setDate([
      moment()
        .locale('ko')
        .format('YYYY-MM-DD'),
      moment()
        .locale('ko')
        .format('YYYY-MM-DD')
    ]);
    setSearchVal('');
  }

  useEffect(() => {
    getUsers();
    getAccesses();
    return () => {
      source.cancel('Operation canceled by the user.');
    };
  }, []);

  useEffect(() => {
    if (accesses.length) {
      let todayAccesses = accesses.filter(
        access => access.access_time.split(' ')[0] === date[0]
      );
      let tempUsers = JSON.parse(JSON.stringify(users));
      if (todayAccesses.length) {
        todayAccesses.map(access => {
          let index = users.findIndex(j => j._id === access.user_obid);
          if (access.access_time.split(' ')[1] > '09:00:00' && index !== -1) {
            tempUsers[index].late = 1;
          } else if (index !== -1) {
            tempUsers[index].attendance = 1;
          }
          return false;
        });
        setUsers(tempUsers);
      }
    }
  }, [accesses]);

  const classes = useStyles();

  const searchEvent = e => {
    setSearchVal(e.target.value);
    if (e.target.value === '') {
      setFilteredUsers([]);
    } else {
      setFilteredUsers(
        users.filter(
          user =>
            user.name.indexOf(e.target.value) !== -1 ||
            user.location.indexOf(e.target.value) !== -1 ||
            user.department_id.indexOf(e.target.value) !== -1 ||
            user.position.indexOf(e.target.value) !== -1
        )
      );
    }
  };

  const handleDate = val => {
    setDate(val);
    let date_accesses = accesses.filter(
      access =>
        access.access_time.split(' ')[0] >= val[0] &&
        access.access_time.split(' ')[0] <= val[1]
    );
    let tempUsers = JSON.parse(JSON.stringify(users));
    tempUsers.map(user => {
      user.late = 0;
      user.attendance = 0;
      return false;
    });

    if (date_accesses.length) {
      date_accesses.map(access => {
        let index = users.findIndex(j => j._id === access.user_obid);
        if (access.access_time.split(' ')[1] > '09:00:00' && index !== -1) {
          tempUsers[index].late++;
        } else if (index !== -1) {
          tempUsers[index].attendance++;
        }
        return false;
      });
      setUsers(tempUsers);
    }
  };

  return (
    <div className={classes.root}>
      <Card className={(classes.root, classes.cardcontent)}>
        <UsersToolbar
          className={classes.toolbar}
          dateChange={handleDate}
          loading={loading}
          search_val={searchVal}
          search_event={searchEvent}
        />
        <div className={classes.content}>
          <UsersTable
            activeType={activeType}
            sortAccesses={sortAccesses}
            loading={loading}
            users={searchVal !== '' ? filteredUsers : users}
          />
        </div>
      </Card>
    </div>
  );
};

export default UserList;
