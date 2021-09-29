import React, { useState,useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import Pagination from '@material-ui/lab/Pagination';
import TextField from '@material-ui/core/TextField';
import Search from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
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
  TableContainer,
  Paper
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
    handlePageChange,
    pages,
    page,
    resetSearch,
    setUserSearch,
    exportExcel,
    setClickedNode,
    clickedNode,
    clickSearch,
    searchType,
    setSearchType,
    deleteAllUsers,
    setUsers,
    deleteUsers,
    className,
    users,
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
      const newSelecteds = users.map(n => n._id);
      setSelected(newSelecteds);
      setSelectedObject(users);
      return;
    }
    setSelected([]);
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

  useEffect(() => {
    setSelectedObject([])
    setSelected([])
  },[page])

  const isSelected = _id => selected.indexOf(_id) !== -1;

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      {/* <CardHeader subheader={ */}
      <CardActions style={{display:'flex'}} className={classes.action}>
          <RouterLink
            style={{ textDecoration: 'none' }}
            to={{
              pathname: '/users/black/add',
              groups: props.groups,
              setClickedNode: props.setClickedNode,
              clickedNode: props.clickedNode,
              setUsers: props.setUsers
            }}>
            <Button variant="contained" color="primary">
              추가
            </Button>
          </RouterLink>
          {selected.length === 1 ? (
            <RouterLink
              style={{ textDecoration: 'none' }}
              to={{
                pathname: '/users/black/edit',
                groups: props.groups,
                setClickedNode: props.setClickedNode,
                clickedNode: props.clickedNode,
                setUsers: props.setUsers,
                userObject: selectedObject,
                selectedNode: selectedNode
              }}>
              <Button
                variant="contained"
                color="primary">
                수정
              </Button>
            </RouterLink>
          ) : (
            <Button
              variant="contained"
              color="primary"
              disabled>
              수정
            </Button>
          )}
          {selected.length ? (
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                deleteUsers(selectedObject);
                setSelectedObject([]);
              }}>
              삭제
            </Button>
          ) : (
            <Button variant="contained" color="secondary" disabled>
              삭제
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
            전체 삭제
          </Button>
        ) : (
          <Button variant="contained" color="secondary" disabled>
            전체 삭제
          </Button>
        )}
        <div style={{ flex:1 ,float: 'right'}}>
        <Button style={{float: 'right' }} variant="contained" color="primary" onClick={exportExcel}>
          엑셀로 다운로드
        </Button>
        <Button
            variant="contained"
            color="secondary"
            style={{float: 'right', marginRight: '10px'}}
            onClick={() => {
              resetSearch();
            }}>
            검색 초기화
          </Button>
        <TextField
            style={{ float: 'right', marginRight: '10px' }}
            className={classes.search}
            id="input-with-icon-textfield"
            // label="검색"
            value={userSearch}
            onChange={handleSearch}
            onKeyUp={()=>{if(window.event.keyCode === 13) clickSearch();}}
            placeholder="검색"
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
            <MenuItem value={'name'}>이름</MenuItem>
            <MenuItem value={'location'}>장소</MenuItem>
            <MenuItem value={'position'}>사유</MenuItem>
            <MenuItem value={'mobile'}>휴대폰 번호</MenuItem>
          </Select>
        </div>
      </CardActions>
      {/* }/> */}

      <CardContent className={classes.content}>
        <TableContainer component={Paper}>
          <Table className={classes.inner} size="small">
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
                      소속 학교/원
                    </TableSortLabel>
                  ) : (
                    '소속 학교/원'
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
                      학년/반
                    </TableSortLabel>
                  ) : (
                    '학년/반'
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
                      휴대폰 번호
                    </TableSortLabel>
                  ) : (
                    '휴대폰 번호'
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
                      <TableCell>{user.position}</TableCell>
                      <TableCell>{user.mobile}</TableCell>
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
  setUsers: PropTypes.func,
  selectedNode: PropTypes.array,
  setSearchType: PropTypes.func,
  selectedNode: PropTypes.array,
};

export default UsersTable;
