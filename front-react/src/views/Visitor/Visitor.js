import React, { useState, useEffect, useCallback } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import axios from 'axios';
import { Groups, UsersTable } from './components';
import {base_url as in_base_url,out_base_url} from 'server.json';

let currentUrl = window.location.href
let base_url = in_base_url
// console.log(currentUrl.indexOf("172.16.41.114"))
if(currentUrl.indexOf("172.16.41.114") <= -1) {
  base_url = out_base_url
}


const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  }
}));

const Visitor = props => {
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

  const filterUsers = useCallback(
    users => {
      let temp = [];
      users.map(user => {
        if (
          user.name.indexOf(userSearch) > -1 ||
          user.guest_company.indexOf(userSearch) > -1 ||
          user.guest_purpose.indexOf(userSearch) > -1 ||
          user.position.indexOf(userSearch) > -1
        ) {
          temp.push(user);
        }
      });
      return temp;
    },
    [userSearch]
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
      } else if (headerType === 'guest_company') {
        if (type === 'asc') {
          setUsers(
            users.sort((a, b) => {
              if (a.guest_company < b.guest_company) return -1;
              else if (b.guest_company < a.guest_company) return 1;
              else return 0;
            })
          );
        } else {
          setUsers(
            users.sort((a, b) => {
              if (a.guest_company > b.guest_company) return -1;
              else if (b.guest_company > a.guest_company) return 1;
              else return 0;
            })
          );
        }
      } else if (headerType === 'guest_purpose') {
        if (type === 'asc') {
          setUsers(
            users.sort((a, b) => {
              if (a.guest_purpose < b.guest_purpose) return -1;
              else if (b.guest_purpose < a.guest_purpose) return 1;
              else return 0;
            })
          );
        } else {
          setUsers(
            users.sort((a, b) => {
              if (a.guest_purpose > b.guest_purpose) return -1;
              else if (b.guest_purpose > a.guest_purpose) return 1;
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
        } else {
          setFilteredUsers(
            filteredUsers.sort((a, b) => {
              if (a.name > b.name) return -1;
              else if (b.name > a.name) return 1;
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

  async function getGroups() {
    let tempGroups = await axios.get(base_url + '/group?type=2');
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

  const deleteGroupNode = async node => {
    if (
      window.confirm(
        '????????? ?????? ????????? ???????????? undefined ???????????? \n??????????????? ?????? ???????????????????'
      )
    ) {
      await axios.delete(base_url + '/group/' + node._id);
      let tempGroups = await axios.get(base_url + '/group?type=2');
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
        setSelectedNode([]);
        setClickedNode({});
        setUsers([]);
        setFilteredUsers([]);
        alert('?????? ???????????????');
      }
    }
  };

  const deleteUsers = async selectedUsers => {
    if (window.confirm('?????? ?????? ???????????????????')) {
      await axios.delete(base_url + '/user/' + users[0]._id, {
        data: {
          type: 2,
          selectedData: selectedUsers,
          account: props.user_id
        }
      });

      selectedUsers.sort((a, b) => {
        if (a.index > b.index) {
          return 1;
        } else {
          return -1;
        }
      });

      let temp = JSON.parse(JSON.stringify(users)); //??????????????? ??????
      if (temp.length === selectedUsers) {
        temp = [];
      } else {
        selectedUsers.map((user, index) => {
          temp.splice(user.index - index, 1);
          return false;
        });
      }
      await setUsers(temp);

      let groups_list = clickedNode.children.filter(child =>
        Array.isArray(child.children)
      );
      let groups_length = groups_list.length;
      clickedNode.children.splice(groups_length);
      temp.map(i => clickedNode.children.push(i));

      setCount(!count);
    }
  };

  useEffect(() => {
    getGroups();
  }, []);

  return (
    <div className={classes.root}>
      <Grid container spacing={4}>
        <Grid item lg={4} md={4} xl={3} xs={12}>
          <Groups
            user_id={props.user_id}
            setClickedNode={_setClickedNode}
            setSelectedNode={_setSelectedNode}
            clickedNode={clickedNode}
            deleteGroupNode={deleteGroupNode}
            search={search}
            searchNode={searchNode}
            setUsers={_setUsers}
            groups={search === '' ? groups : filteredGroups}
          />
        </Grid>
        <Grid item lg={8} md={8} xl={9} xs={12}>
          {/* <AccountDetails users={users}/> */}
          <UsersTable
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

export default Visitor;
