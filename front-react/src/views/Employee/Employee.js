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
  const [searchType, setSearchType] = useState('name');
  const [selectedNode, setSelectedNode] = useState([]);
  const [activeType, setActiveType] = useState('create_at');
  const classes = useStyles();
  const [date, setDate] = useState(['']); 
  const [page , setPage] = useState(1);
  const [pages,setPages] = useState(0);
  const [usersCount,setUsersCount] = useState(0);
  const [sortHeaderType,setSortHeaderType] = useState('-_id');
  const rowsPerPage = 7;

  const getUsers = async (headerType = '-_id') => {
    let result
    if(clickedNode._id) {
      result = await axios.get(base_url + `/user?rowsPerPage=${rowsPerPage}&type=1&group_obid=`+clickedNode._id+`&page=${page}&searchType=${searchType}&entered=${date[0]}&headerType=${headerType}&search=${userSearch}&type=1&auth=`+props.authority)
    } else {
      result = await axios.get(base_url + `/user?rowsPerPage=${rowsPerPage}&page=${page}&searchType=${searchType}&entered=${date[0]}&headerType=${headerType}&search=${userSearch}&type=1&auth=`+props.authority)
    }

    if(result && result.data.data.length > 0) {
      setUsersCount(result.data.count);
      let temp = parseInt(result.data.count/rowsPerPage)
      if(parseInt(result.data.count%rowsPerPage))
        temp++;
      setPages(temp)
      setUsers(result.data.data)
    }

  }

  useEffect(() => {
    getUsers()
  },[page,clickedNode,date])


  const handleDate = val => {
    setDate(val);
  };

  const _setSearchType = (e) => {
    setSearchType(e.target.value)
  }

  const resetSearch = () => {
    setDate(['']);
    setSearchType('name')
    setUserSearch('')
    setActiveType('create_at')
    setPage(1)
    getUsers();
  }

  const exportExcel = async () => {
    let rowsPerPage = 5000;
    let temp = parseInt(usersCount/rowsPerPage)
      if(parseInt(usersCount%rowsPerPage))
        temp++;
    let users = []

    for(let i=0; i<temp; i++){
      let result
      if(clickedNode._id) {
        result = await axios.get(base_url + '/user?rowsPerPage=5000&type=1&group_obid='+clickedNode._id+`&page=${page}&searchType=${searchType}&entered=${date[0]}&headerType=${sortHeaderType}&search=${userSearch}&type=1&auth=`+props.authority)
      } else {
        result = await axios.get(base_url + `/user?rowsPerPage=5000&page=${page}&searchType=${searchType}&entered=${date[0]}&headerType=${sortHeaderType}&search=${userSearch}&type=1&auth=`+props.authority)
      }

      if(result && result.data.data.length > 0){
        users=users.concat(result.data.data);
      }

    }

    const wb = new ExcelJS.Workbook()

    const ws = wb.addWorksheet("Info", {properties:{ defaultRowHeight: 50 }})
    
    ws.addRow(['이름','사번', '성별','근무지','부서','직급','휴대폰 번호','이메일','생성일'])

    if(users.length > 0) {
      users.map((user,index) => {
        let temp = []
  
        temp.push(user['name']);
        temp.push(user['user_id']);
        temp.push(user['gender'] === 1 ? '남자' : '여자')
        temp.push(user['location']);
        temp.push(user['department_id']);
        temp.push(user['position']);
        temp.push(user['mail']);
        temp.push(user['entered']);
        temp.push(user['create_at']);
  
        ws.addRow(temp)
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
    if(type === 'desc')
      headerType = "-"+headerType
    
    setSortHeaderType(headerType);
    getUsers(headerType)
  };


  const clickSearch = () => {
    getUsers()
  }

  useEffect(() => {
    if(Object.keys(clickedNode).length > 0) {
      clickSearch()
    }
  },[date])

  useEffect(() => {
    if (search !== '') {
      let copyGroups = groups;
      let tempFilteredGroups = filterGroup(copyGroups);
      setFilteredGroups(tempFilteredGroups);
    }
  }, [search, groups, filterGroup]);

  const _setClickedNode = node => {
    setClickedNode(node);
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
    let tempGroups = await axios.get(base_url + '/group?type=1&auth='+props.authority);
    if(tempGroups && tempGroups.data.length){
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
    }
  }, []);

  const deleteGroupNode = async node => {
    if (
      window.confirm(
        '삭제시 되돌릴수 없습니다.\n정말 삭제 하시겠습니까?'
      )
    ) {
      await axios.delete(base_url + '/group/' + node._id,{
        data: {
          type : 1,
          clickedNode
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
        '수정한 내용은 되돌릴수 없습니다\n정말로 수정 하시겠습니까?'
      )
    ) {
      node.name = name;
      await axios.put(base_url + '/group/' + node._id,node);
      alert('수정 되었습니다.');

    }
  };

  const deleteUsers = async selectedUsers => {
    if (window.confirm('삭제한 내용은 되돌릴수 없습니다\n정말 삭제 하시겠습니까?')) {
      await axios.delete(base_url + '/user/' + users[0]._id, {
        data: {
          type: 1,
          selectedData: selectedUsers,
          account: props.user_id
        }
      });
      
      alert('삭제 되었습니다.')
      getUsers();
    }
  };

  useEffect(() => {
    getGroups();
  }, [getGroups]);

  const deleteAllUsers = async () => {
    if (window.confirm('삭제한 내용은 되돌릴수 없습니다\n정말 삭제 하시겠습니까?')) {
      let temp = clickedNode._id ? clickedNode._id : ''
      await axios.delete(base_url + '/user/'+users[0]._id+'?type=1&group_obid='+temp+`&searchType=${searchType}&entered=${date[0]}&search=${userSearch}&type=1&auth=`+props.authority, {
        data: {
          type: 1,
          selectedData: users,
          deleteAll:true,
          account: props.user_id,
          count : usersCount
        }
      });
      
      alert('삭제 되었습니다.')
      getUsers();
    }
  }

  const handlePageChange = (event, page) => {
    setPage(page);
  };

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
            groups={search === '' ? groups : filteredGroups}
          />
        </Grid>
        <Grid item lg={8} md={8} xl={9} xs={12}>
          {/* <AccountDetails users={users}/> */}
          <UsersTable
            pages={pages}
            page={page}
            handlePageChange={handlePageChange}
            resetSearch={resetSearch}
            date={date}
            dateChange={handleDate}
            deleteAllUsers={deleteAllUsers}
            clickSearch={clickSearch}
            searchType={searchType}
            setSearchType={_setSearchType}
            authority={props.authority}
            exportExcel={exportExcel}
            activeType={activeType}
            sortAccesses={sortAccesses}
            setClickedNode={_setClickedNode}
            clickedNode={clickedNode}
            selectedNode={selectedNode}
            groups={groups}
            deleteUsers={deleteUsers}
            users={users}
            userSearch={userSearch}
            setUserSearch={setUserSearch}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default Employee;
