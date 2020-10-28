import React, { useState, useEffect, useCallback } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import axios from 'axios';
import { Groups, UsersTable } from './components';
import {base_url} from 'server.json';
import ExcelJS from 'exceljs/dist/es5/exceljs.browser.js'
import { saveAs } from 'file-saver'
import moment from 'moment';
import 'moment/locale/ko';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  }
}));

const Employee = props => {
  const [groups, setGroups] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [clickedNode, setClickedNode] = useState({});
  const [count, setCount] = useState(true);
  const [selectedNode, setSelectedNode] = useState([]);
  const [activeType, setActiveType] = useState('create_at');
  const classes = useStyles();

  const exportExcel = async () => {
    const wb = new ExcelJS.Workbook()

    const ws = wb.addWorksheet("Info", {properties:{ defaultRowHeight: 50 }})
    
    ws.addRow(['사진', '이름', '성별','근무지','부서','직급','이메일','생성일'])

    if(search === '' && users.length > 0) {
      users.slice(0,7).map((user,index) => {
        let temp = []
        let image = wb.addImage({
          base64: user.avatar_file,
          extension: 'png'
        })
  
        temp.push('');
        temp.push(user['name']);
        temp.push(user['gender'] === 1 ? '남자' : '여자')
        temp.push(user['location']);
        temp.push(user['department_id']);
        temp.push(user['position']);
        temp.push(user['mail']);
        temp.push(user['create_at']);
  
        ws.addRow(temp)
        ws.addImage(image,{
          tl: { col: 0, row: 1+index },
          br: { col: 0.7, row: 2+index }
        })
      })
    } else if(filteredUsers.length > 0){
      filteredUsers.slice(0,7).map((user,index) => {
        let temp = []
        let image = wb.addImage({
          base64: user.avatar_file,
          extension: 'png'
        })
  
        temp.push('');
        temp.push(user['name']);
        temp.push(user['gender'] === 1 ? '남자' : '여자')
        temp.push(user['location']);
        temp.push(user['department_id']);
        temp.push(user['position']);
        temp.push(user['mail']);
        temp.push(user['create_at']);
  
        ws.addRow(temp)
        ws.addImage(image,{
          tl: { col: 0, row: 1+index },
          br: { col: 0.7, row: 2+index }
        })
      })
    } else {
      alert('Error: 사용자가 없습니다.')
      return 0;
    }

    const buf = await wb.csv.writeBuffer()

    saveAs(new Blob(["\uFEFF"+buf]), 'employee '+moment().format('YYYY-MM-DD_HH-mm-ss')+'.csv',{type: 'text/plain;charset=utf-8'})
  }

  const filterGroup = useCallback(
    groups => {
      let temp = [];
      groups.map(group => {
        let tempChild = [];
        if (group.name.indexOf(search) > -1) {
          temp.push(group);
        } else if (Array.isArray(group.children)) {
          tempChild = filterGroup(group.children);
          if (tempChild.length > 0) {
            temp.push(group);
            temp[temp.length - 1].filteredChildren = tempChild;
          }
        }
        return false;
      });
      return temp;
    },
    [search]
  );

  const sortAccesses = (type, headerType) => {
    setActiveType(headerType);
    if (search === '') {
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
      } else if (headerType === 'gender') {
        if (type === 'asc') {
          setUsers(
            users.sort((a, b) => {
              if (a.gender < b.gender) return -1;
              else if (b.gender < a.gender) return 1;
              else return 0;
            })
          );
        } else {
          setUsers(
            users.sort((a, b) => {
              if (a.gender > b.gender) return -1;
              else if (b.gender > a.gender) return 1;
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
      } else if (headerType === 'mobile') {
        if (type === 'asc') {
          setUsers(
            users.sort((a, b) => {
              if (a.mobile < b.mobile) return -1;
              else if (b.mobile < a.mobile) return 1;
              else return 0;
            })
          );
        } else {
          setUsers(
            users.sort((a, b) => {
              if (a.mobile > b.mobile) return -1;
              else if (b.mobile > a.mobile) return 1;
              else return 0;
            })
          );
        }
      } else if (headerType === 'mail') {
        if (type === 'asc') {
          setUsers(
            users.sort((a, b) => {
              if (a.mail < b.mail) return -1;
              else if (b.mail < a.mail) return 1;
              else return 0;
            })
          );
        } else {
          setUsers(
            users.sort((a, b) => {
              if (a.mail > b.mail) return -1;
              else if (b.mail > a.mail) return 1;
              else return 0;
            })
          );
        }
      } else if (headerType === 'create_at') {
        if (type === 'asc') {
          setUsers(
            users.sort((a, b) => {
              if (a.create_at < b.create_at) return -1;
              else if (b.create_at < a.create_at) return 1;
              else return 0;
            })
          );
        } else {
          setUsers(
            users.sort((a, b) => {
              if (a.create_at > b.create_at) return -1;
              else if (b.create_at > a.create_at) return 1;
              else return 0;
            })
          );
        }
      }
    } else {
      if (headerType === 'name') {
        if (type === 'asc') {
          setFilteredUsers(
            filteredUsers.sort((a, b) => {
              if (a.name < b.name) return -1;
              else if (b.name < a.name) return 1;
              else return 0;
            })
          );
        } else {
          setFilteredUsers(
            filteredUsers.sort((a, b) => {
              if (a.name > b.name) return -1;
              else if (b.name > a.name) return 1;
              else return 0;
            })
          );
        }
      } else if (headerType === 'gender') {
        if (type === 'asc') {
          setFilteredUsers(
            filteredUsers.sort((a, b) => {
              if (a.gender < b.gender) return -1;
              else if (b.gender < a.gender) return 1;
              else return 0;
            })
          );
        } else {
          setFilteredUsers(
            filteredUsers.sort((a, b) => {
              if (a.gender > b.gender) return -1;
              else if (b.gender > a.gender) return 1;
              else return 0;
            })
          );
        }
      } else if (headerType === 'location') {
        if (type === 'asc') {
          setFilteredUsers(
            filteredUsers.sort((a, b) => {
              if (a.location < b.location) return -1;
              else if (b.location < a.location) return 1;
              else return 0;
            })
          );
        } else {
          setFilteredUsers(
            filteredUsers.sort((a, b) => {
              if (a.location > b.location) return -1;
              else if (b.location > a.location) return 1;
              else return 0;
            })
          );
        }
      } else if (headerType === 'depart') {
        if (type === 'asc') {
          setFilteredUsers(
            filteredUsers.sort((a, b) => {
              if (a.department_id < b.department_id) return -1;
              else if (b.department_id < a.department_id) return 1;
              else return 0;
            })
          );
        } else {
          setFilteredUsers(
            filteredUsers.sort((a, b) => {
              if (a.department_id > b.department_id) return -1;
              else if (b.department_id > a.department_id) return 1;
              else return 0;
            })
          );
        }
      } else if (headerType === 'position') {
        if (type === 'asc') {
          setFilteredUsers(
            filteredUsers.sort((a, b) => {
              if (a.position < b.position) return -1;
              else if (b.position < a.position) return 1;
              else return 0;
            })
          );
        } else {
          setFilteredUsers(
            filteredUsers.sort((a, b) => {
              if (a.position > b.position) return -1;
              else if (b.position > a.position) return 1;
              else return 0;
            })
          );
        }
      } else if (headerType === 'mobile') {
        if (type === 'asc') {
          setFilteredUsers(
            filteredUsers.sort((a, b) => {
              if (a.mobile < b.mobile) return -1;
              else if (b.mobile < a.mobile) return 1;
              else return 0;
            })
          );
        } else {
          setFilteredUsers(
            filteredUsers.sort((a, b) => {
              if (a.mobile > b.mobile) return -1;
              else if (b.mobile > a.mobile) return 1;
              else return 0;
            })
          );
        }
      } else if (headerType === 'mail') {
        if (type === 'asc') {
          setFilteredUsers(
            filteredUsers.sort((a, b) => {
              if (a.mail < b.mail) return -1;
              else if (b.mail < a.mail) return 1;
              else return 0;
            })
          );
        } else {
          setFilteredUsers(
            filteredUsers.sort((a, b) => {
              if (a.mail > b.mail) return -1;
              else if (b.mail > a.mail) return 1;
              else return 0;
            })
          );
        }
      } else if (headerType === 'create_at') {
        if (type === 'asc') {
          setFilteredUsers(
            filteredUsers.sort((a, b) => {
              if (a.create_at < b.create_at) return -1;
              else if (b.create_at < a.create_at) return 1;
              else return 0;
            })
          );
        } else {
          setFilteredUsers(
            filteredUsers.sort((a, b) => {
              if (a.create_at > b.create_at) return -1;
              else if (b.create_at > a.create_at) return 1;
              else return 0;
            })
          );
        }
      }
    }
  };

  const filterUsers = useCallback(
    users => {
      let temp = [];
      users.map(user => {
        if (
          user.name.indexOf(userSearch) > -1 ||
          user.location.indexOf(userSearch) !== -1 ||
          user.department_id.indexOf(userSearch) !== -1 ||
          user.position.indexOf(userSearch) !== -1
        ) {
          temp.push(user);
        }
        return false;
      });
      return temp;
    },
    [userSearch]
  );

  useEffect(() => {
    if (search !== '') {
      let copyGroups = groups;
      let tempFilteredGroups = filterGroup(copyGroups);
      setFilteredGroups(tempFilteredGroups);
    }
  }, [search, groups, filterGroup]);

  useEffect(() => {
    if (userSearch !== '') {
      let copyUsers = users;
      let tempFilteredUsers = filterUsers(copyUsers);
      setFilteredUsers(tempFilteredUsers);
    }
  }, [userSearch, users, filterUsers]);

  const _setClickedNode = node => {
    setClickedNode(node);
  };

  const _setUsers = (node, length) => {
    let groupLength = 0;
    let children = JSON.parse(JSON.stringify(node.children));
    for (let i = 0; i < children.length; i++) {
      if (Array.isArray(children[i].children)) {
        groupLength++;
      } else {
        break;
      }
    }
    setUsers(children.splice(groupLength));
  };

  const _setSelectedNode = nodeId => {
    let node = JSON.parse(JSON.stringify(selectedNode));
    nodeId = nodeId.split('/');
    let nodeDepth = parseInt(nodeId[1]);
    if (nodeDepth === 0) {
      node = [nodeId[0]];
    } else if (nodeDepth === 1) {
      node[1] = nodeId[0];
      node[2] = '';
    } else {
      node[2] = nodeId[0];
    }
    setSelectedNode(node);
  };

  const searchNode = e => {
    setSearch(e.target.value);
  };

  const countChildren = data => {
    //그룹의 obid를 한곳에 몰아넣는 작업
    if (data.children[0] !== undefined) {
      data.children.map(i => {
        countChildren(i);
        return false;
      });
    }
    if (data.user_obids[0] !== undefined) {
      data.userCount = data.user_obids.length;
      data.groupCount = data.children.length;
    }
  };

  const getGroups = useCallback(async () => {
    console.log(props.authority);
    let tempGroups = await axios.get(base_url + '/group?type=1&auth='+props.authority);
    tempGroups.data.map(i => {
      countChildren(i);
      return false;
    });
    let index = tempGroups.data.findIndex(i => i.name === 'undefined');
    if (index !== -1) {
      let undefinedGroup = tempGroups.data.splice(index, 1);
      tempGroups.data.push(undefinedGroup[0]);
    }
    setGroups(tempGroups.data);
  }, []);

  const deleteGroupNode = async node => {
    if (
      window.confirm(
        '삭제시 되돌릴수 없습니다.\n정말 삭제 하시겠습니까?'
      )
    ) {
      await axios.delete(base_url + '/group/' + node._id,{
        data: {
          type : 1
        }
      });
      getGroups()
      setSelectedNode([]);
      setClickedNode({});
      setUsers([]);
      setFilteredUsers([]);
      alert('삭제 되었습니다');
    }
  };

  const editGroupNode = async (node,name) => {
    if (
      window.confirm(
        '정말로 수정 하시겠습니까?'
      )
    ) {
      node.name = name;
      await axios.put(base_url + '/group/' + node._id,node);
      alert('수정 되었습니다.');
    }
  };

  const deleteUsers = async selectedUsers => {
    if (window.confirm('정말 삭제 하시겠습니까?')) {
      await axios.delete(base_url + '/user/' + users[0]._id, {
        data: {
          type: 1,
          selectedData: selectedUsers,
          account: props.user_id
        }
      });

      getUsers();
      // selectedUsers.sort((a, b) => {
      //   if (a.index > b.index) {
      //     return 1;
      //   } else {
      //     return -1;
      //   }
      // });

      // let temp = JSON.parse(JSON.stringify(users)); //테이블에서 제거
      // if (temp.length === selectedUsers) {
      //   temp = [];
      // } else {
      //   selectedUsers.map((user, index) => {
      //     temp.splice(user.index - index, 1);
      //     return false;
      //   });
      // }
      // await setUsers(temp);

      // let groups_list = clickedNode.children.filter(child =>
      //   Array.isArray(child.children)
      // );
      // let groups_length = groups_list.length;
      // clickedNode.children.splice(groups_length);
      // temp.map(i => clickedNode.children.push(i));

      // setCount(!count);
    }
  };

  const getUsers = async () => {
    if(clickedNode._id) {
      let result = await axios.get(base_url + '/user?type=1&group_obid='+clickedNode._id+'&auth='+props.authority)
      setFilteredUsers([]);
      setSearch('')
      setActiveType('create_at');
      setUsers(result.data);
    }
  }

  useEffect(() => {
    getUsers()
  },[clickedNode])

  useEffect(() => {
    getGroups();
  }, [getGroups]);

  return (
    <div className={classes.root}>
      <Grid container spacing={4}>
        <Grid item lg={4} md={4} xl={3} xs={12}>
          <Groups
            authority={props.authority}
            user_id={props.user_id}
            setClickedNode={_setClickedNode}
            setSelectedNode={_setSelectedNode}
            clickedNode={clickedNode}
            deleteGroupNode={deleteGroupNode}
            editGroupNode={editGroupNode}
            search={search}
            searchNode={searchNode}
            setUsers={_setUsers}
            groups={search === '' ? groups : filteredGroups}
          />
        </Grid>
        <Grid item lg={8} md={8} xl={9} xs={12}>
          {/* <AccountDetails users={users}/> */}
          <UsersTable
            authority={props.authority}
            exportExcel={exportExcel}
            activeType={activeType}
            sortAccesses={sortAccesses}
            setClickedNode={_setClickedNode}
            clickedNode={clickedNode}
            setUsers={_setUsers}
            selectedNode={selectedNode}
            groups={groups}
            deleteUsers={deleteUsers}
            users={userSearch === '' ? users : filteredUsers}
            userSearch={userSearch}
            setUserSearch={setUserSearch}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default Employee;
