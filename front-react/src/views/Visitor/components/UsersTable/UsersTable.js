import React, { useState,useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Pagination from '@material-ui/lab/Pagination';
import TextField from '@material-ui/core/TextField';
import Search from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';
import { NavLink as RouterLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import {
  Card,
  CardActions,
  CardHeader,
  CardContent,
  Avatar,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Typography,
  TablePagination
} from '@material-ui/core';

import { getInitials } from 'helpers';

const useStyles = makeStyles(theme => ({
  root: {},
  content: {
    padding: 0
  },
  inner: {
    minWidth: 1050
  },
  action: {
    padding:"10px 20px"
  },
  nameContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  avatar: {
    marginRight: theme.spacing(2)
  },
  hightTempAvatar: {
    marginRight: theme.spacing(2)
  },
  actions: {
    justifyContent: 'flex-end'
  },
  buttonActions: {
    width: "100%",
  },
  buttonStyle: {
    margin:"0 8px"
  },
  activeStyle:{
    color: "white",
    textDecoration:"none"
  }
}));

const UsersTable = props => {
  const {userSearch,selectedNode,setUserSearch,setClickedNode,clickedNode,setUsers,deleteUsers,className,users, ...rest } = props;

  const classes = useStyles();

  const [rowsPerPage, setRowsPerPage] = useState(7);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState([]);
  const [selectedObject, setSelectedObject] = useState([]);


  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = users.map((n) => n._id);
      setSelected(newSelecteds);
      setSelectedObject(users)
      return;
    }
    setSelected([]);
  };

  const handlePageChange = (event, page) => {
    setPage(page);
  };

  const handleClick = (event, node, index) => {
    if(selected.length === 0) {
      setSelectedObject(node)
    }
    const selectedIndex = selected.indexOf(node._id);
    let newSelected = [];
    let newSelectedObject = [];
    if (selectedIndex === -1) {
      node.index = index;
      newSelected = newSelected.concat(selected, node._id);
      newSelectedObject = newSelectedObject.concat(selectedObject, node);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
      newSelectedObject = newSelectedObject.concat(selectedObject.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
      newSelectedObject = newSelectedObject.concat(selectedObject.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
      newSelectedObject = newSelectedObject.concat(
        selectedObject.slice(0, selectedIndex),
        selectedObject.slice(selectedIndex + 1),
      );
    }
    setSelectedObject(newSelectedObject);
    setSelected(newSelected);
  };

  const handleSearch = (e) => {
    setUserSearch(e.target.value);
  }

  const isSelected = (_id) => selected.indexOf(_id) !== -1;

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      {/* <CardHeader subheader={ */}
        <CardActions className={classes.action}>
          <TextField
          className={classes.search}
          id="input-with-icon-textfield"
          // label="검색"
          value={userSearch}
          onChange={handleSearch}
          placeholder="검색"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end"><Search></Search></InputAdornment>
            ),
          }}
          />
          <Grid container justify="flex-end" className={classes.buttonActions}>
            {
              selected.length ? 
              <Button variant="contained" color="secondary" onClick={() =>{ deleteUsers(selectedObject); setSelectedObject([])}}>삭제</Button> :
              <Button variant="contained" color="secondary" disabled>삭제</Button>
            }
            {
              selected.length === 1 ? 
              <RouterLink style={{ textDecoration: 'none' }} to={{
                pathname:"/users/visitor/edit",
                groups:props.groups,
                setClickedNode:props.setClickedNode,
                clickedNode:props.clickedNode,
                setUsers:props.setUsers,
                userObject:selectedObject,
                selectedNode:selectedNode
                }}><Button variant="contained" color="primary">수정</Button></RouterLink> :
              <Button variant="contained" color="primary" className={classes.buttonStyle} disabled>수정</Button> 
            }
            
            <RouterLink style={{ textDecoration: 'none' }} to={{
              pathname:"/users/visitor/add",
              groups:props.groups,
              setClickedNode:props.setClickedNode,
              clickedNode:props.clickedNode,
              setUsers:props.setUsers,
              }}><Button variant="contained" color="primary">추가</Button></RouterLink>
          </Grid>
        </CardActions>
      {/* }/> */}

      <CardContent className={classes.content}>
        <PerfectScrollbar>
          <div className={classes.inner}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox checked={(selected.length === users.length) && users.length !== 0 ? true : false} onChange={handleSelectAllClick}/>
                  </TableCell>
                  <TableCell>사진</TableCell>
                  <TableCell>이름</TableCell>
                  <TableCell>성별</TableCell>
                  <TableCell>회사</TableCell>
                  <TableCell>방문목적</TableCell>
                  <TableCell>직급</TableCell>
                  <TableCell>휴대폰 번호</TableCell>
                  <TableCell>이메일</TableCell>
                  <TableCell>생성일</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {props.users.slice((page-1) * rowsPerPage, (page-1) * rowsPerPage + rowsPerPage).map((user,index) => {
                  const isItemSelected = isSelected(user._id);
                  return(
                    <TableRow
                      key={props.users._id}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          onChange={(event) => handleClick(event, user, index)}
                          checked={isItemSelected}
                        />
                      </TableCell>
                      <TableCell>
                        <div className={classes.nameContainer}>
                          <img
                            height="90px"
                            width="70px"
                            src={user.avatar_file_url}
                          >
                          </img>
                        </div>
                      </TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.gender === 1 ? '남자' : '여자'}</TableCell>
                      <TableCell>{user.guest_company}</TableCell>
                      <TableCell>{user.guest_purpose}</TableCell>
                      <TableCell>{user.position}</TableCell>
                      <TableCell>{user.mobile}</TableCell>
                      <TableCell>{user.mail}</TableCell>
                      <TableCell>{user.create_at}</TableCell>
                    </TableRow>
                  )
                  })}
              </TableBody>
            </Table>
          </div>
        </PerfectScrollbar>
      </CardContent>
      <CardActions className={classes.actions}>
        <Grid
          container
          alignItems="center"
          justify="center"
        >
         <Pagination
          count={ props.users.length%rowsPerPage === 0 ? parseInt(props.users.length/rowsPerPage) :
          parseInt(props.users.length/rowsPerPage+(parseInt(props.users.length%rowsPerPage)/parseInt(props.users.length%rowsPerPage)))}
          onChange={handlePageChange}
          page={page}
          variant="outlined" 
          shape="rounded"
          />
        </Grid>
      </CardActions>
    </Card>
  );
};

UsersTable.propTypes = {
  className: PropTypes.string,
  deleteUsers : PropTypes.func,
  setClickedNode : PropTypes.func,
  clickedNode : PropTypes.object,
  setUsers : PropTypes.func,
  selectedNode : PropTypes.array
};



export default UsersTable;
