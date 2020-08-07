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
  TablePagination,
  LinearProgress
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
  const {loading,userSearch,selectedNode,setUserSearch,setClickedNode,clickedNode,setUsers,deleteUsers,className,users, ...rest } = props;

  const classes = useStyles();

  const [rowsPerPage, setRowsPerPage] = useState(7);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState([]);
  const [selectedObject, setSelectedObject] = useState([]);

  const handlePageChange = (event, page) => {
    setPage(page);
  };

  const handleClick = (event, node, index) => {
    setSelectedObject([node]);
    setSelected([node._id]);
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
              <Button variant="contained" color="secondary" onClick={() =>{ deleteUsers(selectedObject); setSelected([]); setSelectedObject([])}}>삭제</Button> :
              <Button variant="contained" color="secondary" disabled>삭제</Button>
            }
            {
              selected.length ? 
              <RouterLink style={{ textDecoration: 'none' }} to={{
                pathname:"/system/account/edit",
                selectedUser:selectedObject,
                }}><Button variant="contained" color="primary">수정</Button></RouterLink> :
              <Button variant="contained" color="primary" className={classes.buttonStyle} disabled>수정</Button> 
            }
            
            <RouterLink style={{ textDecoration: 'none' }} to={{
              pathname:"/system/account/add",
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
                  </TableCell>
                  <TableCell>아이디</TableCell>
                  <TableCell>이름</TableCell>
                  <TableCell>언어</TableCell>
                </TableRow>
                {loading ? <LinearProgress style={{width:"6220%"}}/> : null}
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
                      <TableCell>{user.user_id}</TableCell>
                      <TableCell>{user.user_name}</TableCell>
                      <TableCell>{user.user_lang}</TableCell>
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
