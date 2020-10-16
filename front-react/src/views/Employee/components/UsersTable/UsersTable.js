import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import Pagination from '@material-ui/lab/Pagination';
import TextField from '@material-ui/core/TextField';
import Search from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import { NavLink as RouterLink } from 'react-router-dom';
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
    userSearch,
    selectedNode,
    setUserSearch,
    setClickedNode,
    exportExcel,
    clickedNode,
    setUsers,
    deleteUsers,
    className,
    users,
    ...rest
  } = props;

  const classes = useStyles();

  const rowsPerPage = 7;
  const [page, setPage] = useState(1);
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
      let seleted = props.users.slice(
        (page - 1) * rowsPerPage,
        (page - 1) * rowsPerPage + rowsPerPage)
      const newSelecteds = seleted.map(n => n._id)
      setSelected(newSelecteds);
      setSelectedObject(seleted);
      return;
    }
    setSelected([]);
  };

  const handlePageChange = (event, page) => {
    setPage(page);
  };

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

  const isSelected = _id => selected.indexOf(_id) !== -1;

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
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
              <InputAdornment position="end">
                <Search></Search>
              </InputAdornment>
            )
          }}
        />
        <Button style={{width: '164px' }} variant="contained" color="primary" onClick={exportExcel}>
          엑셀로 다운로드
        </Button>
        <Grid container justify="flex-end" className={classes.buttonActions}>
          {selected.length ? (
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                deleteUsers(selectedObject);
                setSelectedObject([]);
                setSelected([]);
              }}>
              삭제
            </Button>
          ) : (
            <Button variant="contained" color="secondary" disabled>
              삭제
            </Button>
          )}
          {selected.length === 1 ? (
            <RouterLink
              style={{ textDecoration: 'none' }}
              to={{
                pathname: '/users/employee/edit',
                groups: props.groups,
                setClickedNode: props.setClickedNode,
                clickedNode: props.clickedNode,
                setUsers: props.setUsers,
                userObject: selectedObject,
                selectedNode: selectedNode
              }}>
              <Button
                variant="contained"
                color="primary"
                className={classes.buttonStyle}>
                수정
              </Button>
            </RouterLink>
          ) : (
            <Button
              variant="contained"
              color="primary"
              className={classes.buttonStyle}
              disabled>
              수정
            </Button>
          )}

          <RouterLink
            style={{ textDecoration: 'none' }}
            to={{
              pathname: '/users/employee/add',
              groups: props.groups,
              setClickedNode: props.setClickedNode,
              clickedNode: props.clickedNode,
              setUsers: props.setUsers
            }}>
            <Button variant="contained" color="primary">
              추가
            </Button>
          </RouterLink>
        </Grid>
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
                      selected.length === users.length && users.length !== 0
                        ? true
                        : false
                    }
                    onChange={handleSelectAllClick}
                  />
                </TableCell>
                <TableCell>사진</TableCell>
                <TableCell>
                  {props.users.length > 0 ? (
                    <TableSortLabel
                      active={activeType === 'name'}
                      direction={sort}
                      onClick={() => {
                        createSortHandler('name');
                      }}>
                      이름
                    </TableSortLabel>
                  ) : (
                    '이름'
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
                      성별
                    </TableSortLabel>
                  ) : (
                    '성별'
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
                      근무지
                    </TableSortLabel>
                  ) : (
                    '근무지'
                  )}
                </TableCell>
                <TableCell>
                  {props.users.length > 0 ? (
                    <TableSortLabel
                      active={activeType === 'depart'}
                      direction={sort}
                      onClick={() => {
                        createSortHandler('depart');
                      }}>
                      부서
                    </TableSortLabel>
                  ) : (
                    '부서'
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
                      직급
                    </TableSortLabel>
                  ) : (
                    '직급'
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
                      휴대폰번호
                    </TableSortLabel>
                  ) : (
                    '휴대폰번호'
                  )}
                </TableCell>
                <TableCell>
                  {props.users.length > 0 ? (
                    <TableSortLabel
                      active={activeType === 'mail'}
                      direction={sort}
                      onClick={() => {
                        createSortHandler('mail');
                      }}>
                      이메일
                    </TableSortLabel>
                  ) : (
                    '이메일'
                  )}
                </TableCell>
                <TableCell>
                  {props.users.length > 0 ? (
                    <TableSortLabel
                      active={activeType === 'create_at'}
                      direction={sort}
                      onClick={() => {
                        createSortHandler('create_at');
                      }}>
                      생성일
                    </TableSortLabel>
                  ) : (
                    '생성일'
                  )}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {props.users
                .slice(
                  (page - 1) * rowsPerPage,
                  (page - 1) * rowsPerPage + rowsPerPage
                )
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
                            alt="프로필사진"
                            height="90px"
                            width="70px"
                            src={user.avatar_file_url}></img>
                        </div>
                      </TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>
                        {user.gender === 1 ? '남자' : '여자'}
                      </TableCell>
                      <TableCell>{user.location}</TableCell>
                      <TableCell>{user.department_id}</TableCell>
                      <TableCell>{user.position}</TableCell>
                      <TableCell>{user.mobile}</TableCell>
                      <TableCell>{user.mail}</TableCell>
                      <TableCell>{user.create_at}</TableCell>
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
            count={
              props.users.length % rowsPerPage === 0
                ? parseInt(props.users.length / rowsPerPage)
                : parseInt(
                    props.users.length / rowsPerPage +
                      parseInt(props.users.length % rowsPerPage) /
                        parseInt(props.users.length % rowsPerPage)
                  )
            }
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
  setUsers: PropTypes.func,
  selectedNode: PropTypes.array
};

export default UsersTable;
