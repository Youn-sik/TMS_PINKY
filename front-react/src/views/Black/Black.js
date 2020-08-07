import React,{ useState,useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import axios from 'axios';
import { AccountProfile, AccountDetails, UsersTable } from './components';
import ImageUploader from "react-images-upload";

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  }
}));

const Black = (props) => {
  const [groups,setGroups] = useState([]);
  const [userSearch,setUserSearch] = useState('');
  const [filteredGroups,setFilteredGroups] = useState([]);
  const [search,setSearch] = useState('');
  const [users,setUsers] = useState([]);
  const [filteredUsers,setFilteredUsers] = useState([]);
  const [clickedNode,setClickedNode] = useState({});
  const [count,setCount] = useState(true);
  const [selectedNode , setSelectedNode] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    if(search !== '') {
      let copyGroups = groups;
      let tempFilteredGroups = filterGroup(copyGroups)
      setFilteredGroups(tempFilteredGroups)
    }
  },[search])

  useEffect(() => {
    if(userSearch !== '') {
      let copyUsers = users;
      let tempFilteredUsers = filterUsers(copyUsers);
      setFilteredUsers(tempFilteredUsers);
    }
  },[userSearch])

  const _setClickedNode = (node) => {
    setClickedNode(node);
  }

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

  const _setSelectedNode = (nodeId) => {
    let node = JSON.parse(JSON.stringify(selectedNode));
    nodeId = nodeId.split('/');
    let nodeDepth = parseInt(nodeId[1]);
    if(nodeDepth === 0) {
      node = [nodeId[0]];
    } else if(nodeDepth === 1) {
      node[1] = nodeId[0];
      node[2] = '';
    } else {
      node[2] = nodeId[0];
    }
    setSelectedNode(node);
  }

  const filterGroup = (groups) => {
    let temp = []
    groups.map((group) => {
      let tempChild = []
      if(group.name.indexOf(search) > -1) {
        temp.push(group)
      } else if(Array.isArray(group.children)){
        tempChild = filterGroup(group.children)
        if(tempChild.length > 0) {
          temp.push(group)
          temp[temp.length - 1].filteredChildren = tempChild
        }
      }
    })
    return temp
  }

  const filterUsers = (users) => {
    let temp = []
    users.map((user) => {
      if(user.name.indexOf(userSearch) > -1) {
        temp.push(user)
      }
    })
    return temp
  }

  const searchNode = (e) => {
    setSearch(e.target.value)
  }

  const moveUserIds = (data) => { //그룹의 obid를 한곳에 몰아넣는 작업
    if(data.children[0] !== undefined) {
        data.children.map((i) => {
            moveUserIds(i)
        })
    }
    if(data.user_obids[0] !== undefined) {
      data.children = data.children.concat(data.user_obids);
    }
  }

  async function getGroups() {
    let tempGroups = await axios.get('http://172.16.135.89:3000/group?type=5')
    tempGroups.data.map((i) => {//user_obids에 있는 데이터 children으로 옮기기
      moveUserIds(i);
    })
    let index = tempGroups.data.findIndex(i => i.name == "undefined");
    if(index !== -1) {
      let undefinedGroup = tempGroups.data.splice(index,1);
      tempGroups.data.push(undefinedGroup[0]);
    }
    setGroups(tempGroups.data);
  }

  const deleteGroupNode = async (node) => {
    if(window.confirm("삭제시 해당 그룹의 사용자는 undefined 그룹으로 \n변경됩니다 삭제 하시겠습니까?")){
      await axios.delete('http://172.16.135.89:3000/group/'+node._id)
      let tempGroups = await axios.get('http://172.16.135.89:3000/group?type=5')
      tempGroups.data.map((i) => {//user_obids에 있는 데이터 children으로 옮기기
        moveUserIds(i);
      })
      let index = tempGroups.data.findIndex(i => i.name == "undefined");
      if(index !== -1) {
        let undefinedGroup = tempGroups.data.splice(index,1);
        tempGroups.data.push(undefinedGroup[0]);
      }
      setGroups(tempGroups.data);
      alert('삭제 되었습니다');
    }
  }

  const deleteUsers = async (selectedUsers) => {
    if(window.confirm('정말 삭제 하시겠습니까?')) {
      await axios.delete('http://172.16.135.89:3000/user/'+users[0]._id,{
        data:{
          type:5,
          selectedData:selectedUsers,
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
      console.log(temp);
      await setUsers(temp);
      
      let groups_list = clickedNode.children.filter(child => Array.isArray(child.children))
      let groups_length = groups_list.length
      clickedNode.children.splice(groups_length)
      temp.map(i=>clickedNode.children.push(i))

      setCount(!count);
    }
  }

  useEffect(() => {
    getGroups();
  },[])


  return (
    <div className={classes.root}>
      <Grid
        container
        spacing={4}
      >
        <Grid
          item
          lg={4}
          md={4}
          xl={3}
          xs={12}
        >
          <AccountProfile 
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
        <Grid
          item
          lg={8}
          md={8}
          xl={9}
          xs={12}
        >
          {/* <AccountDetails users={users}/> */}
          <UsersTable 
          setClickedNode={_setClickedNode} 
          clickedNode={clickedNode} 
          setUsers={_setUsers}  
          selectedNode={selectedNode}
          groups={groups} 
          deleteUsers={deleteUsers} 
          users={userSearch === '' ?  users : filteredUsers } 
          userSearch={userSearch}
          setUserSearch={setUserSearch}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default Black;
