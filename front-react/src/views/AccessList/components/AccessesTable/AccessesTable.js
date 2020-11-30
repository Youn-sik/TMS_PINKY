import React, { useState,useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import Pagination from '@material-ui/lab/Pagination';
import { makeStyles } from '@material-ui/styles';
import { NavLink as RouterLink } from 'react-router-dom';
import { Grid } from '@material-ui/core';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import LinearProgress from '@material-ui/core/LinearProgress';
import Checkbox from '@material-ui/core/Checkbox';
import axios from 'axios';
import {base_url} from 'server.json';
import GroupIcon from '@material-ui/icons/FolderShared';
import PersonIcon from '@material-ui/icons/Person';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import {
  Card,
  CardActions,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Dialog,
  DialogTitle,
  Paper,
  Button
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {},
  content: {
    padding: 0
  },
  inner: {
    minWidth: 1050
  },
  nameContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  avatar: {
    margin: '0 0 0 3px',
    marginRight: theme.spacing(2)
  },
  hightTempAvatar: {
    marginRight: theme.spacing(2)
  },
  actions: {
    justifyContent: 'flex-end'
  },
  highTempRow: {
    borderLeft: '3px solid red',
    background: 'rgba(255, 204, 204, 0.575)'
  },
  lowPerRow: {
    borderLeft: '3px solid orange',
    background: 'rgba(255, 166, 43, 0.18)'
  },
  redFont: {
    color: 'red'
  },
  orangeFont: {
    color: 'orange'
  },
  tree: {
    height: 240,
    flexGrow: 1,
    maxWidth: '100%'
  },

  treeItem: {
    fontSize: '18px'
  },
  labelRoot: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0.5, 0)
  },
  labelIcon: {
    marginRight: theme.spacing(1)
  },
  labelText: {
    fontWeight: 'inherit',
    fontSize: '16px',
    flexGrow: 1
  }
}));

const AccessesTable = props => {
  const {
    tempType,
    tempLimit,
    sortAccesses,
    activeType,
    loading,
    className,
    accesses,
    handleClick,
    isSelected,
    handleSelectAllClick,
    selected,
    page,
    pages,
    sort,
    setSort,
    setPage,
    ...rest
  } = props;

  const [currentUrl,setCurrnetUrl] = useState("");
  const [imageModal,setImageModal] = useState(false)
  const [openEdit,setOpenEdit] = useState(false)
  const [selectedAccess,setSelectedAccess] = useState({})
  const [users,setUsers] = useState([])
  const [currentType,setCurrnetType] = useState("1")
  const [groups,setGroups] = useState([])
  const [selectedGroup,setSelectedGroup] = useState({})
  const classes = useStyles();

  // const getUsers = async () => {
  //   let result = await axios.get(base_url+'users')
  //   console.log(result.data)
  //   setUsers(result.data);
  // }

  const getGroups = async () => {
    let tempGroups = await axios.get(base_url + '/group?type=1&auth='+props.authority);
    if(tempGroups && tempGroups.data.length){ 
      let index = tempGroups.data.findIndex(i => i.name === 'undefined');
      if (index !== -1) {
        let undefinedGroup = tempGroups.data.splice(index, 1);
        tempGroups.data.push(undefinedGroup[0]);
      }
      setGroups(tempGroups.data);
    }
  }

  const renderTree = node => (
    <TreeItem
      onIconClick={() => {
        setSelectedGroup(node);
      }}
      onLabelClick={() => {
        setSelectedGroup(node);
      }}
      className={classes.treeItem}
      key={node._id}
      nodeId={node._id}
      label={
        <div className={classes.labelRoot}>
          {Array.isArray(node.children) ? (
            <GroupIcon color="inherit" className={classes.labelIcon} />
          ) : (
            <PersonIcon color="inherit" className={classes.labelIcon} />
          )}
          <Typography
            color="inherit"
            variant="body2"
            className={classes.labelText}>
            {node.name === 'undefined' ? '미분류' : node.name}
          </Typography>
        </div>
      }
      style={{
        '--tree-view-color': '#1a73e8',
        '--tree-view-bg-color': '#e8f0fe'
      }}
      classes={{
        root: classes.treeItemStyle,
        content: classes.content,
        expanded: classes.expanded,
        selected: classes.selected,
        group: classes.group,
        label: classes.label
      }}>
      {Array.isArray(node.children)
        ? node.children.map(child => renderTree(child))
        : null}
    </TreeItem>
  );

  useEffect(() => {
    // getUsers()
    getGroups()
  },[])

  const handlePageChange = (event, page) => {
    setPage(page);
  };

  const createSortHandler = headerType => {
    if (sort === 'desc') {
      setSort('asc');
      sortAccesses('asc', headerType);
    } else {
      setSort('desc');
      sortAccesses('desc', headerType);
    }
  };

  const clickImage = url => {
    setCurrnetUrl(url);
    setImageModal(true);
  }

  const handleClose = () => {
    setImageModal(false);
    setOpenEdit(false)
  }

  const handleEdit = (access) => {
    setOpenEdit(true)
    setSelectedAccess(access)
  }

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={imageModal}>
        <img
        alt="screenShot"
        style={{maxWidth:'50vw'}}
        src={currentUrl}></img>
      </Dialog>
      <Dialog onClose={handleClose} open={openEdit}>
        <Card >
          <TreeView
            style={{width:"50vw",height:"50vh"}}
            className={classes.tree}
            defaultCollapseIcon={<ArrowDropDownIcon />}
            defaultExpandIcon={<ArrowRightIcon />}
            defaultEndIcon={<div style={{ width: 24 }} />}>
            {groups.length ? (
              groups.map(group => renderTree(group))
            ) : (
              <div></div>
            )}
        </TreeView>
        </Card>
        <Card>
          <CardContent className={classes.content}>
            <TableContainer component={Paper}>
              <Table size="small" className={classes.inner}>
                <TableHead>
                  <TableRow>
                    {/* <TableCell padding="checkbox">
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
                    </TableCell> */}
                    <TableCell>사진</TableCell>
                    <TableCell>이름</TableCell>
                    <TableCell>사번</TableCell>
                    <TableCell>성별</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users
                    .map((user, index) => {
                      const isItemSelected = isSelected(user._id);
                      return (
                        <TableRow key={user._id}>
                          {/* <TableCell padding="checkbox">
                            <Checkbox
                              onChange={event => handleClick(event, user, index)}
                              checked={isItemSelected}
                            />
                          </TableCell> */}
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
                          <TableCell>{user.user_id}</TableCell>
                          <TableCell>
                            {user.gender === 1 ? '남자' : '여자'}
                          </TableCell>
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
      </Dialog>
      <CardContent className={classes.content}>
        {loading ? <LinearProgress style={{ width: '100%' }} /> : null}
        <TableContainer component={Paper}>
          <Table className={classes.inner} size="small">
            <TableHead>
              <TableRow>
              <TableCell>
                  <Checkbox
                    checked={
                      selected.length === accesses.length && accesses.length !== 0
                        ? true
                        : false
                    }
                    onChange={handleSelectAllClick}
                  />
                </TableCell>
                <TableCell style={{paddingLeft:"38px"}}>사진</TableCell>
                <TableCell>
                  {accesses.length > 0 ? (
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
                <TableCell>{accesses.length > 0 ? (
                    <TableSortLabel
                      active={activeType === 'avatar_type'}
                      direction={sort}
                      onClick={() => {
                        createSortHandler('avatar_type');
                      }}>
                      타입
                    </TableSortLabel>
                  ) : (
                    '타입'
                  )}</TableCell>
                <TableCell>
                  {accesses.length > 0 ? (
                    <TableSortLabel
                      active={activeType === 'stb_location'}
                      direction={sort}
                      onClick={() => {
                        createSortHandler('stb_location');
                      }}>
                      단말 위치
                    </TableSortLabel>
                  ) : (
                    '단말 위치'
                  )}
                </TableCell>
                <TableCell>
                  {accesses.length > 0 ? (
                    <TableSortLabel
                      active={activeType === 'stb_name'}
                      direction={sort}
                      onClick={() => {
                        createSortHandler('stb_name');
                      }}>
                      단말기 이름
                    </TableSortLabel>
                  ) : (
                    '단말기 이름'
                  )}
                </TableCell>
                <TableCell>
                  {accesses.length > 0 ? (
                    <TableSortLabel
                      active={activeType === 'stb_sn'}
                      direction={sort}
                      onClick={() => {
                        createSortHandler('stb_name');
                      }}>
                      단말기 시리얼
                    </TableSortLabel>
                  ) : (
                    '단말기 시리얼'
                  )}
                </TableCell>
                <TableCell>
                  {accesses.length > 0 ? (
                    <TableSortLabel
                      active={activeType === 'avatar_distance'}
                      direction={sort}
                      onClick={() => {
                        createSortHandler('avatar_distance');
                      }}>
                      거리
                    </TableSortLabel>
                  ) : (
                    '거리'
                  )}
                </TableCell>
                <TableCell>
                  {accesses.length > 0 ? (
                    <TableSortLabel
                      active={activeType === 'avatar_temperature'}
                      direction={sort}
                      onClick={() => {
                        createSortHandler('avatar_temperature');
                      }}>
                      온도
                    </TableSortLabel>
                  ) : (
                    '온도'
                  )}
                </TableCell>
                <TableCell>{accesses.length > 0 ? (
                    <TableSortLabel
                      active={activeType === 'distnace'}
                      direction={sort}
                      onClick={() => {
                        createSortHandler('distnace');
                      }}>
                      확률
                    </TableSortLabel>
                  ) : (
                    '확률'
                  )}</TableCell>
                <TableCell>
                  {accesses.length > 0 ? (
                    <TableSortLabel
                      active={activeType === 'access_time'}
                      direction={sort}
                      onClick={() => {
                        createSortHandler('access_time');
                      }}>
                      출입시간
                    </TableSortLabel>
                  ) : (
                    '출입시간'
                  )}
                </TableCell>
                <TableCell>동작</TableCell>
              </TableRow>
            </TableHead>
            {
              <TableBody>
                {props.accesses
                  .map((access,index) => {
                    const isItemSelected = isSelected(access._id);
                    if (access.avatar_temperature >= tempLimit) {
                      //출입 기록 37.5도 이상일때
                      return (
                        <TableRow
                          className={classes.highTempRow}
                          key={access._id}>
                          <TableCell>
                          <Checkbox
                              onChange={event => handleClick(event, access, index)}
                              checked={isItemSelected}
                            />
                          </TableCell>
                          <TableCell>
                            <div className={classes.nameContainer}>
                              <img
                                style={{cursor: 'pointer'}} onClick={()=>{clickImage(access.avatar_file_url)}}
                                alt="screenShot"
                                height="90px"
                                width="70px"
                                className={classes.hightTempAvatar}
                                src={access.avatar_file_url}></img>
                            </div>
                          </TableCell>
                          <TableCell className={classes.redFont}>
                            {access.name!=='unknown' ? access.name : ''}
                          </TableCell>
                          <TableCell className={classes.redFont}>
                            {access.avatar_type === 1
                              ? '사원'
                              : access.avatar_type === 2
                              ? '방문자'
                              : access.avatar_type === 4
                              ? '블랙리스트'
                              : '미등록자'}
                          </TableCell>
                          <TableCell className={classes.redFont}>
                            {access.stb_location ? access.stb_location : ''}
                          </TableCell>
                          <TableCell className={classes.redFont}>
                            {access.stb_name}
                          </TableCell>
                          <TableCell className={classes.redFont}>
                            {access.stb_sn}
                          </TableCell>
                          <TableCell className={classes.redFont}>
                            {access.avatar_distance
                              ? String(access.avatar_distance).substr(0, 3)
                              : 0}
                            M
                          </TableCell>
                          <TableCell className={classes.redFont}>
                            {tempType === 1
                              ? String(access.avatar_temperature).substring(
                                  0,
                                  4
                                )
                              : '비정상 체온'}
                          </TableCell>
                          <TableCell className={classes.redFont}>
                            {access.distance ? String(access.distance).substr(0,4) : 0}%
                          </TableCell>
                          <TableCell className={classes.redFont}>
                            {access.access_time.split(' ')[0]}
                          </TableCell>
                          <TableCell>
                            {
                              access.distance <= 57.5 && access.name !== 'unknown' ? <Button variant="contained" color="primary" onClick={() => {handleEdit(access)}}>수정</Button>:
                              access.avatar_type === 3 ? 
                              <RouterLink
                                style={{ textDecoration: 'none' }}
                                to={{
                                  pathname: '/users/stranger/add',
                                  userObject: {
                                    avatar_file_url: access.avatar_file_url,
                                    avatar_file: access.avatar_file,
                                    _id: access.avatar_file_url
                                  }
                                }}>
                                <Button variant="contained" color="primary">
                                  등록
                                </Button>
                              </RouterLink> : null
                            }
                          </TableCell>
                        </TableRow>
                      );
                    } else if (access.distance <= 57.5 && access.name !== "unknown") {
                      return (
                        <TableRow
                          className={classes.lowPerRow}
                          key={access._id}>
                          <TableCell>
                          <Checkbox
                              onChange={event => handleClick(event, access, index)}
                              checked={isItemSelected}
                            />
                          </TableCell>
                          <TableCell>
                            <div className={classes.nameContainer}>
                              <img
                                style={{cursor: 'pointer'}} onClick={()=>{clickImage(access.avatar_file_url)}}
                                alt="screenShot"
                                height="90px"
                                width="70px"
                                className={classes.hightTempAvatar}
                                src={access.avatar_file_url}></img>
                            </div>
                          </TableCell>
                          <TableCell className={classes.orangeFont}>
                            {access.name!=='unknown' ? access.name : ''}
                          </TableCell>
                          <TableCell className={classes.orangeFont}>
                            {access.avatar_type === 1
                              ? '사원'
                              : access.avatar_type === 2
                              ? '방문자'
                              : access.avatar_type === 4
                              ? '블랙리스트'
                              : '미등록자'}
                          </TableCell>
                          <TableCell className={classes.orangeFont}>
                            {access.stb_location ? access.stb_location : ''}
                          </TableCell>
                          <TableCell className={classes.orangeFont}>
                            {access.stb_name}
                          </TableCell>
                          <TableCell className={classes.orangeFont}>
                            {access.stb_sn}
                          </TableCell>
                          <TableCell className={classes.orangeFont}>
                            {access.avatar_distance
                              ? String(access.avatar_distance).substr(0, 3)
                              : 0}
                            M
                          </TableCell>
                          <TableCell className={classes.orangeFont}>
                            {tempType === 1
                              ? String(access.avatar_temperature).substring(
                                  0,
                                  4
                                )
                              : '비정상 체온'}
                          </TableCell>
                          <TableCell className={classes.orangeFont}>
                            {access.distance ? String(access.distance).substr(0,4) : 0}%
                          </TableCell>
                          <TableCell className={classes.orangeFont}>
                            {access.access_time.split(' ')[0]}
                          </TableCell>
                          <TableCell>
                            {
                              access.distance <= 57.5 && access.name !== 'unknown' ? <Button variant="contained" color="primary" onClick={() => {handleEdit(access)}}>수정</Button>:
                              access.avatar_type === 3 ? 
                              <RouterLink
                                style={{ textDecoration: 'none' }}
                                to={{
                                  pathname: '/users/stranger/add',
                                  userObject: {
                                    avatar_file_url: access.avatar_file_url,
                                    avatar_file: access.avatar_file,
                                    _id: access.avatar_file_url
                                  }
                                }}>
                                <Button variant="contained" color="primary">
                                  등록
                                </Button>
                              </RouterLink> : null
                            }
                          </TableCell>
                        </TableRow>
                      );
                    } else {
                      return (
                        <TableRow className={classes.tableRow} key={access._id}>
                          <TableCell>
                          <Checkbox
                              onChange={event => handleClick(event, access, index)}
                              checked={isItemSelected}
                            />
                          </TableCell>
                          <TableCell>
                            <div className={classes.nameContainer}>
                              <img
                                style={{cursor: 'pointer'}} onClick={()=>{clickImage(access.avatar_file_url)}}
                                alt="screenShot"
                                height="90px"
                                width="70px"
                                className={classes.avatar}
                                src={access.avatar_file_url}></img>
                            </div>
                          </TableCell>
                          <TableCell>
                            {access.name !== 'unknown'? access.name : ''}
                          </TableCell>
                          <TableCell>
                            {access.avatar_type === 1
                              ? '사원'
                              : access.avatar_type === 2
                              ? '방문자'
                              : access.avatar_type === 4
                              ? '블랙리스트'
                              : '미등록자'}
                          </TableCell>
                          <TableCell>
                            {access.stb_location ? access.stb_location : ''}
                          </TableCell>
                          <TableCell>
                            {access.stb_name}
                          </TableCell>
                          <TableCell>
                            {access.stb_sn}
                          </TableCell>
                          <TableCell>
                            {access.avatar_distance
                              ? String(access.avatar_distance).substr(0, 3)
                              : 0}
                            M
                          </TableCell>
                          <TableCell>
                            {tempType === 1
                              ? String(access.avatar_temperature).substring(
                                  0,
                                  4
                                )
                              : '정상 체온'}
                          </TableCell>
                          <TableCell>
                            {access.distance ? String(access.distance).substr(0,4) : 0}%
                          </TableCell>
                          <TableCell>{access.access_time.split(' ')[0]}</TableCell>
                          <TableCell>
                            {
                              access.distance <= 57.5 && access.name !== 'unknown' ? <Button variant="contained" color="primary" onClick={() => {handleEdit(access)}}>수정</Button>:
                              access.avatar_type === 3 ? 
                              <RouterLink
                                style={{ textDecoration: 'none' }}
                                to={{
                                  pathname: '/users/stranger/add',
                                  userObject: {
                                    avatar_file_url: access.avatar_file_url,
                                    avatar_file: access.avatar_file,
                                    _id: access.avatar_file_url
                                  }
                                }}>
                                <Button variant="contained" color="primary">
                                  등록
                                </Button>
                              </RouterLink> : null
                            }
                          </TableCell>
                        </TableRow>
                      );
                    }
                  })}
              </TableBody>
            }
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

AccessesTable.propTypes = {
  className: PropTypes.string
};

export default AccessesTable;
