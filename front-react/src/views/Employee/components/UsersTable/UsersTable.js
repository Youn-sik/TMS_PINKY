import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import Pagination from '@material-ui/lab/Pagination';
import TextField from '@material-ui/core/TextField';
import Search from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import { NavLink as RouterLink } from 'react-router-dom';
import {DatePicker} from 'rsuite';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import {
  Card,
  CardActions,
  CardContent,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Paper,
  TableContainer
} from '@material-ui/core';

let isOut = false
let currentUrl = window.location.href
// console.log(currentUrl.indexOf("172.16.41.114"))
if(currentUrl.indexOf('172.16.41.114') <= -1){
  isOut = true
}

Date.prototype.yyyymmdd = function() {
  var yyyy = this.getFullYear().toString();
  var mm = (this.getMonth() + 1).toString();
  var dd = this.getDate().toString();
  var hh = (this.getHours() + 12).toString();
  return (
    yyyy + '-' + (mm[1] ? mm : '0' + mm[0]) + '-' + (dd[1] ? dd : '0' + dd[0])
  );
};

const useStyles = makeStyles(theme => ({
  root: {},
  content: {
    padding: 0
  },
  inner: {
    minWidth: 1050
  },
  action: {
    padding: '10px 20px'
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
    width: '100%'
  },
  buttonStyle: {
    margin: '0 8px'
  },
  activeStyle: {
    color: 'white',
    textDecoration: 'none'
  }
}));

const UsersTable = props => {
  const {
    sortAccesses,
    activeType,
    resetSearch,
    userSearch,
    selectedNode,
    handlePageChange,
    pages,
    page,
    setUserSearch,
    setClickedNode,
    exportExcel,
    clickedNode,
    deleteUsers,
    date,
    clickSearch,
    dateChange,
    searchType,
    setSearchType,
    deleteAllUsers,
    className,
    users,
    // handleQRModal,
    ...rest
  } = props;

  const classes = useStyles();

  const rowsPerPage = 7;
  const [selected, setSelected] = useState([]);
  const [selectedObject, setSelectedObject] = useState([]);
  const [sort, setSort] = useState('desc');

  const createSortHandler = headerType => {
    if (sort === 'desc') {
      setSort('asc');
      sortAccesses('asc', headerType);
    } else {
      setSort('desc');
      sortAccesses('desc', headerType);
    }
  };

  const handleSelectAllClick = event => {
    if (event.target.checked) {
      const newSelecteds = users.map(n => n._id)
      setSelected(newSelecteds);
      setSelectedObject(users);
      return;
    }
    setSelected([]);
  };

  const locale = {
    sunday: '???',
    monday: '???',
    tuesday: '???',
    wednesday: '???',
    thursday: '???',
    friday: '???',
    saturday: '???',
    ok: '??????',
    today: '??????',
    yesterday: '??????',
    hours: '??????',
    minutes: '???',
    seconds: '???',
    last7Days: '????????????'
  }

  const handleClick = (event, node, index) => {
    if (selected.length === 0) {
      setSelectedObject(node);
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
        selected.slice(selectedIndex + 1)
      );
      newSelectedObject = newSelectedObject.concat(
        selectedObject.slice(0, selectedIndex),
        selectedObject.slice(selectedIndex + 1)
      );
    }
    setSelectedObject(newSelectedObject);
    setSelected(newSelected);
  };

  const handleSearch = e => {
    setUserSearch(e.target.value);
  };

  useEffect(() => {
    // console.log(users);
    setSelectedObject([])
    setSelected([])
  },[page])

  const isSelected = _id => selected.indexOf(_id) !== -1;

  console.log(props.users)

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      {/* <CardHeader subheader={ */}
      <CardActions style={{display:'flex'}} className={classes.action}>

      <RouterLink
        style={{ textDecoration: 'none' }}
        to={{
          pathname: '/users/employee/add',
          groups: props.groups,
          setClickedNode: props.setClickedNode,
          clickedNode: props.clickedNode,
        }}>
        <Button variant="contained" color="primary">
          ??????
        </Button>
      </RouterLink>

      {selected.length === 1 ? (
        <RouterLink
          style={{ textDecoration: 'none' }}
          to={{
            pathname: '/users/employee/edit',
            groups: props.groups,
            setClickedNode: props.setClickedNode,
            clickedNode: props.clickedNode,
            userObject: selectedObject,
            selectedNode: selectedNode
          }}>
          <Button
            variant="contained"
            color="primary"
            >
            ??????
          </Button>
        </RouterLink>
      ) : (
        <Button
          variant="contained"
          color="primary"

          disabled>
          ??????
        </Button>
      )}
      {selected.length ? (
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              deleteUsers(selectedObject);
              setSelectedObject([]);
              setSelected([]);
            }}>
            ??????
          </Button>
        ) : (
          <Button variant="contained" color="secondary" disabled>
            ??????
          </Button>
        )}
        {users.length ? (
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              deleteAllUsers();
              setSelectedObject([]);
              setSelected([]);
            }}>
            ?????? ??????
          </Button>
        ) : (
          <Button variant="contained" color="secondary" disabled>
            ?????? ??????
          </Button>
        )}
        <DatePicker
            format="YYYY-MM-DD"
            block
            cleanable={false}
            placeholder="?????????"
            onChange={val => {
                dateChange([val.yyyymmdd()]);
            }}
            vlaue={date[0]}
            locale={locale}/>
        <div style={{flex:1, float: 'right'}}>
          <Button style={{float: 'right' }} variant="contained" color="primary" onClick={exportExcel}>
            ????????? ????????????
          </Button>
          <Button
            variant="contained"
            color="secondary"
            style={{float: 'right', marginRight: '10px'}}
            onClick={() => {
              resetSearch();
            }}>
            ?????? ?????????
          </Button>
          <TextField
            style={{ float: 'right', marginRight: '10px' }}
            className={classes.search}
            id="input-with-icon-textfield"
            // label="??????"
            value={userSearch}
            onChange={handleSearch}
            onKeyUp={()=>{if(window.event.keyCode === 13) clickSearch();}}
            placeholder="??????"
            InputProps={{
              endAdornment: (
                <InputAdornment style={{cursor:'pointer'}} onClick={clickSearch} position="end">
                  <Search></Search>
                </InputAdornment>
              )
            }}
          />
          <Select
            style={{ float: 'right',marginRight: '10px',width:"100px" }}
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            value={searchType}
            onChange={setSearchType}
          >
            <MenuItem value={'name'}>??????</MenuItem>
            <MenuItem value={'user_id'}>????????????</MenuItem>
            <MenuItem value={'position'}>??????/???</MenuItem>
            <MenuItem value={'mobile'}>????????? ?????????</MenuItem>
            {/* <MenuItem value={'mail'}>?????????</MenuItem> */}
          </Select>
        </div>
      </CardActions>
      {/* }/> */}

      <CardContent className={classes.content}>
        <TableContainer component={Paper}>
          <Table size="small" className={classes.inner}>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={
                      selected.length === 7 ?
                        true
                        :
                        selected.length === props.users.length && props.users.length !== 0 ?
                        true
                        :
                        false
                    }
                    onChange={handleSelectAllClick}
                  />
                </TableCell>
                <TableCell>??????</TableCell>
                <TableCell>
                  {props.users.length > 0 ? (
                    <TableSortLabel
                      active={activeType === 'name'}
                      direction={sort}
                      onClick={() => {
                        createSortHandler('name');
                      }}>
                      ??????
                    </TableSortLabel>
                  ) : (
                    '??????'
                  )}
                </TableCell>
                <TableCell>
                  {props.users.length > 0 ? (
                    <TableSortLabel
                      active={activeType === 'gender'}
                      direction={sort}
                      onClick={() => {
                        createSortHandler('gender');
                      }}>
                      ??????
                    </TableSortLabel>
                  ) : (
                    '??????'
                  )}
                </TableCell>
                <TableCell>
                  {props.users.length > 0 ? (
                    <TableSortLabel
                      active={activeType === 'user_id'}
                      direction={sort}
                      onClick={() => {
                        createSortHandler('user_id');
                      }}>
                      ????????????
                    </TableSortLabel>
                  ) : (
                    '????????????'
                  )}
                </TableCell>
                <TableCell>
                  {props.users.length > 0 ? (
                    <TableSortLabel
                      active={activeType === 'location'}
                      direction={sort}
                      onClick={() => {
                        createSortHandler('location');
                      }}>
                      ?????? ??????/???
                    </TableSortLabel>
                  ) : (
                    ['?????? ??????/???']
                  )}
                </TableCell>
                <TableCell>
                  {props.users.length > 0 ? (
                    <TableSortLabel
                      active={activeType === 'position'}
                      direction={sort}
                      onClick={() => {
                        createSortHandler('position');
                      }}>
                      ??????/???
                    </TableSortLabel>
                  ) : (
                    '??????/???'
                  )}
                </TableCell>
                <TableCell>
                  {props.users.length > 0 ? (
                    <TableSortLabel
                      active={activeType === 'mobile'}
                      direction={sort}
                      onClick={() => {
                        createSortHandler('mobile');
                      }}>
                      ????????? ?????????
                    </TableSortLabel>
                  ) : (
                    '????????? ?????????'
                  )}
                </TableCell>
                {/* <TableCell>
                  {props.users.length > 0 ? (
                    <TableSortLabel
                      active={activeType === 'mail'}
                      direction={sort}
                      onClick={() => {
                        createSortHandler('mail');
                      }}>
                      ?????????
                    </TableSortLabel>
                  ) : (
                    '?????????'
                  )}
                </TableCell> */}
                <TableCell>
                  {props.users.length > 0 ? (
                    <TableSortLabel
                      active={activeType === 'entered'}
                      direction={sort}
                      onClick={() => {
                        createSortHandler('entered');
                      }}>
                      ?????????
                    </TableSortLabel>
                  ) : (
                    '?????????'
                  )}
                </TableCell>
                {/* <TableCell>
                  QR
                </TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {
              props.users
                .map((user, index) => {
                  const isItemSelected = isSelected(user._id);
                  return (
                    <TableRow key={user._id}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          onChange={event => handleClick(event, user, index)}
                          checked={isItemSelected}
                        />
                      </TableCell>
                      <TableCell>
                        <div className={classes.nameContainer}>
                          <img
                            alt="???????????????"
                            height="90px"
                            width="70px"
                            src={isOut ? user.avatar_file_url.replace("172.16.41.114:3000","211.204.122.90:10891") : user.avatar_file_url}></img>
                        </div>
                      </TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>
                        {user.gender === 1 ? '??????' : '??????'}
                      </TableCell>
                      <TableCell>{user.user_id}</TableCell>
                      <TableCell>{user.location}</TableCell>
                      <TableCell>{user.position}</TableCell>
                      <TableCell>{user.mobile}</TableCell>
                      <TableCell>{user.entered}</TableCell>
                      {/* <TableCell>
                        <Button variant="contained" color="primary" onClick={()=>{handleQRModal(user.rfid,user.mail)}}>
                          QR??????
                        </Button>
                      </TableCell> */}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
      <CardActions className={classes.actions}>
        <Grid container alignItems="center" justify="center">
          <Pagination
            count={pages}
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
  deleteUsers: PropTypes.func,
  setClickedNode: PropTypes.func,
  clickedNode: PropTypes.object,
  setSearchType: PropTypes.func,
  selectedNode: PropTypes.array,
};

export default UsersTable;
