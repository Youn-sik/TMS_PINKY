import React,{ useState,useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import axios from 'axios';
import { UsersTable } from './components';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  }
}));

const Account = (props) => {
  const [groups,setGroups] = useState([]);
  const [userSearch,setUserSearch] = useState('');
  const [users,setUsers] = useState([]);
  const [filteredUsers,setFilteredUsers] = useState([]);
  const [clickedNode,setClickedNode] = useState({});
  const [loading,setLoading] = useState(true);
  const [selectedNode , setSelectedNode] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    if(userSearch !== '') {
      let copyUsers = users;
      let tempFilteredUsers = filterUsers(copyUsers);
      setFilteredUsers(tempFilteredUsers);
    }
  },[userSearch])


  const _setUsers = (node,length) => {
    let groupLength = 0
    let children = JSON.parse(JSON.stringify(node.children))
    for(let i = 0; i<children.length; i++) {
      if(Array.isArray(children[i].children)) {
        groupLength++;
      } else {
        break;
      }
    }
    setUsers(children.splice(groupLength))
  }

  const filterUsers = (users) => {
    let temp = []
    users.map((user) => {
      if(user.user_name.indexOf(userSearch) > -1 || user.user_id.indexOf(userSearch) > -1) {
        temp.push(user)
      }
    })
    return temp
  }

  async function getAccounts() {
    let result = await axios.get('http://172.16.135.89:3000/account')
    setUsers(result.data);
    setLoading(false)
  }

  const deleteUsers = async (selectedUsers) => {
    if(window.confirm('정말 삭제 하시겠습니까?')) {
      await axios.delete('http://172.16.135.89:3000/account/'+users[0]._id,{
        data:{
          account : 'admin' // to do :나중에 계정 정보 넣을것
        }
      })

      selectedUsers.sort((a, b) =>{
        if(a.index > b.index){
          return 1
        } else {
          return -1
        }
      })
  
      let temp = JSON.parse(JSON.stringify(users)); //테이블에서 제거
      if(temp.length === selectedUsers) {
        temp=[]
      } else {
        selectedUsers.map((user,index) => {
          temp.splice(user.index-index,1);
        })
      }
      await setUsers(temp);
    }
  }

  useEffect(() => {
    getAccounts();
  },[])


  return (
    <div className={classes.root}>
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
          {/* <AccountDetails users={users}/> */}
          <UsersTable 
          clickedNode={clickedNode} 
          selectedNode={selectedNode}
          groups={groups} 
          deleteUsers={deleteUsers} 
          users={userSearch === '' ?  users : filteredUsers } 
          userSearch={userSearch}
          setUserSearch={setUserSearch}
          loading={loading}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default Account;
