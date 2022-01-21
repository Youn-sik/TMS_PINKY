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
import {base_url as in_base_url,out_base_url} from 'server.json';
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

let currentUrl = window.location.href
let base_url = in_base_url
let isOut = false
// console.log(currentUrl.indexOf("172.16.41.114"))
if(currentUrl.indexOf("172.16.41.114") <= -1) {
  base_url = out_base_url
  isOut = true
}

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
    background: 'rgba(255, 204, 204, 0.275)'
  },
  emergencyRow: {
    borderLeft: '3px solid red',
    background: 'rgba(255, 102, 102, 0.73)'
  },
  blacklistRow: {
    borderLeft: '3px solid gray',
    background: 'rgba(224, 224, 224, 0.8)'
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
    // getGroups()
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
        src={isOut ? currentUrl.replace('172.16.41.114:3000','211.204.122.90:10891') : currentUrl}></img>
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
                    <TableCell>사진</TableCell>
                    <TableCell>이름</TableCell>
                    <TableCell>성별</TableCell>
                    <TableCell>생년월일</TableCell>
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
                                src={isOut ? user.avatar_file_url.replace('172.16.41.114:3000','211.204.122.90:10891') : user.avatar_file_url}></img>
                            </div>
                          </TableCell>
                          <TableCell>{user.name}</TableCell>
                          <TableCell>
                            {user.gender === 1 ? '남자' : '여자'}
                          </TableCell>
                          <TableCell>{user.user_id}</TableCell>
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
          <Table className={classes.inner} size="small" style={{width: '100%'}}>
            <TableHead>
              <TableRow style={{width: '100%'}}>
              <TableCell style={{width: '40px'}}>
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
                    <TableSortLabel style={{width: '52px'}}
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
                  {accesses.length > 0 ? (
                    <TableSortLabel style={{width: '52px'}}
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
                <TableCell>{accesses.length > 0 ? (
                    <TableSortLabel style={{width: '52px'}}
                      active={activeType === 'alarm_type'}
                      direction={sort}
                      onClick={() => {
                        createSortHandler('alarm_type');
                      }}>
                      타입
                    </TableSortLabel>
                  ) : (
                    '타입'
                  )}</TableCell>
                <TableCell>{accesses.length > 0 ? (
                    <TableSortLabel style={{width: '52px'}}
                      active={activeType === 'user_id'}
                      direction={sort}
                      onClick={() => {
                        createSortHandler('user_id');
                      }}>
                      생년<br/>월일
                    </TableSortLabel>
                  ) : (
                    '생년월일'
                  )}</TableCell>
                  <TableCell>
                  {accesses.length > 0 ? (
                    <TableSortLabel style={{width: '70px'}}
                      active={activeType === 'location'}
                      direction={sort}
                      onClick={() => {
                        createSortHandler('location');
                      }}>
                      소속<br/>학교/원
                    </TableSortLabel>
                  ) : (
                    '소속 학교/원'
                  )}
                </TableCell>
                <TableCell>
                  {accesses.length > 0 ? (
                    <TableSortLabel style={{width: '70px'}}
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
                  {accesses.length > 0 ? (
                    <TableSortLabel style={{width: '52px'}}
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
                <TableCell>
                  {accesses.length > 0 ? (
                    <TableSortLabel style={{width: '52px'}}
                      active={activeType === 'stb_location'}
                      direction={sort}
                      onClick={() => {
                        createSortHandler('stb_location');
                      }}>
                      단말<br/>위치
                    </TableSortLabel>
                  ) : (
                    '단말 위치'
                  )}
                </TableCell>
                <TableCell>
                  {accesses.length > 0 ? (
                    <TableSortLabel style={{width: '65px'}}
                      active={activeType === 'stb_name'}
                      direction={sort}
                      onClick={() => {
                        createSortHandler('stb_name');
                      }}>
                      단말명
                    </TableSortLabel>
                  ) : (
                    '단말명'
                  )}
                </TableCell>
                <TableCell>
                  {accesses.length > 0 ? (
                    <TableSortLabel style={{width: '65px'}}
                      active={activeType === 'stb_sn'}
                      direction={sort}
                      onClick={() => {
                        createSortHandler('stb_sn');
                      }}>
                      단말기<br/>시리얼
                    </TableSortLabel>
                  ) : (
                    '단말기 시리얼'
                  )}
                </TableCell>
                {/* <TableCell>
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
                </TableCell> */}
                
                {/* <TableCell>{accesses.length > 0 ? (
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
                  )}</TableCell> */}
                <TableCell>
                  {accesses.length > 0 ? (
                    <TableSortLabel style={{width: '78px'}}
                      active={activeType === 'sensor_dust'} //#####################
                      direction={sort}
                      onClick={() => {
                        createSortHandler('sensor_dust'); //#####################
                      }}>
                      미세먼지<br/>(ug/m3)
                    </TableSortLabel>
                  ) : (
                    '미세먼지(ug/m3)'
                  )}
                </TableCell>
                <TableCell>
                  {accesses.length > 0 ? (
                    <TableSortLabel style={{width: '72px'}}
                      active={activeType === 'sensor_humidity'} //#####################
                      direction={sort}
                      onClick={() => {
                        createSortHandler('sensor_humidity'); //#####################
                      }}>
                      습도(%)
                    </TableSortLabel>
                  ) : (
                    '습도(%)'
                  )}
                </TableCell>
                <TableCell>
                  {accesses.length > 0 ? (
                    <TableSortLabel style={{width: '65px'}}
                      active={activeType === 'sensor_CO2'} //#####################
                      direction={sort}
                      onClick={() => {
                        createSortHandler('sensor_CO2'); //#####################
                      }}>
                      CO2<br/>(ppm)
                    </TableSortLabel>
                  ) : (
                    'CO2(ppm)'
                  )}
                </TableCell>
                <TableCell>
                  {accesses.length > 0 ? (
                    <TableSortLabel style={{width: '52px'}}
                      active={activeType === 'sensor_temperature'} //#####################
                      direction={sort}
                      onClick={() => {
                        createSortHandler('sensor_temperature'); //#####################
                      }}>
                      센서<br/>온도
                    </TableSortLabel>
                  ) : (
                    '센서 온도'
                  )}
                </TableCell>
                
                <TableCell>
                  {accesses.length > 0 ? (
                    <TableSortLabel style={{width: '72px'}}
                      active={activeType === 'access_time'}
                      direction={sort}
                      onClick={() => {
                        createSortHandler('access_time');
                      }}>
                      시간
                    </TableSortLabel>
                  ) : (
                    '시간'
                  )}
                </TableCell>
                <TableCell>
                {accesses.length > 0 ? (
                    <TableSortLabel style={{width: '70px'}}>
                      기상<br/>데이터
                    </TableSortLabel>
                  ) : (
                    '기상 데이터'
                  )}
                </TableCell>
                {/* <TableCell style={{width:110}}>알람</TableCell> */}
                <TableCell>동작</TableCell>
              </TableRow>
              
            </TableHead>
            {
              <TableBody>
                {props.accesses
                  .map((access,index) => {
                    // console.log(JSON.stringify(access))
                    const isItemSelected = isSelected(access._id);
                    if (access.alarm_type == 5){
                      //비상 버튼일 때
                      return (
                        <TableRow
                          className={classes.emergencyRow}
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
                                src={isOut ? access.avatar_file_url.replace('172.16.41.114:3000','211.204.122.90:10891') : access.avatar_file_url}></img>
                            </div>
                          </TableCell>
                          <TableCell className={classes.redFont}>
                            {access.name !== 'unknown'? access.name : ''}
                          </TableCell>
                          <TableCell className={classes.redFont}>
                            
                          </TableCell>
                          <TableCell className={classes.redFont}>
                          {access.alarm_type === 1
                          ? '승차'
                          : access.alarm_type === 2
                          ? '하차'
                          : access.alarm_type === 3
                          ? '등원'
                          : access.alarm_type === 4
                          ? '하원'
                          : '비상'}
                          </TableCell>
                          <TableCell className={classes.redFont}>
                          {access.name !== 'unknown' ? access.employee_id : ''}
                          </TableCell>
                          <TableCell className={classes.redFont}>
                            {access.location}
                          </TableCell>
                          <TableCell className={classes.redFont}>
                            {access.position}
                          </TableCell>
                          <TableCell  className={classes.redFont}>
                            
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
                          
                          {/* <TableCell className={classes.redFont}>
                            {access.distance ? String(access.distance).substr(0,4) : 0}%
                          </TableCell> */}
                          <TableCell className={classes.redFont} style={{"white-space": "pre-wrap"}}>
                              {access.sensor_dust
                              ?"PM10: "+access.sensor_dust+"\n"+
                              "PM2.5: "+access.sensor_pm25+"\n"+
                              "PM1: "+access.sensor_pm1+" "
                              : ''}
                            </TableCell>
                            <TableCell>
                                  {access.sensor_humidity
                                  ? access.sensor_humidity
                                  : ''}
                              </TableCell>
                          <TableCell className={classes.redFont}>
                            {access.sensor_CO2
                            ? access.sensor_CO2
                            : ''}
                          </TableCell>
                          <TableCell>
                            {access.sensor_temperature
                            ? access.sensor_temperature
                            : ''}
                          </TableCell>
                          <TableCell className={classes.redFont} style={{"white-space": "pre-wrap"}}>
                            {access.access_time.split(' ')[0]+"\n"+
                            access.access_time.split(' ')[1]}
                          </TableCell>
                          <TableCell className={classes.redFont} style={{"white-space": "pre-wrap"}}>
                              {access.weather_temperature
                              ?"온도: "+access.weather_temperature+"°C "+"\n"+
                              "강수: "+access.weather_rain+"\n"+
                              "습도: "+access.weather_humidity+"% "+"\n"+
                              "풍속: "+access.weather_windSpeed+"m/s"
                              : ''}
                          </TableCell>
                          {/* <TableCell className={classes.redFont}>
                          {access.access_time.split(' ')[0]+"\n"+
                            access.access_time.split(' ')[1]}
                          </TableCell> */}
                          <TableCell className={classes.redFont}>
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
                    else {
                      if(access.avatar_type == 4){
                        return (
                          <TableRow className={classes.blacklistRow} key={access._id}>
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
                                  src={isOut ? access.avatar_file_url.replace('172.16.41.114:3000','211.204.122.90:10891') : access.avatar_file_url}></img>
                              </div>
                            </TableCell>
                            <TableCell>
                              {access.name !== 'unknown'? access.name : ''}
                            </TableCell>
                            <TableCell>
                              {access.name !== 'unknown'? access.gender == 1 ? '남자' : '여자' : ''}
                            </TableCell>
                            <TableCell>
                            {access.alarm_type === 1
                            ? '승차'
                            : access.alarm_type === 2
                            ? '하차'
                            : access.alarm_type === 3
                            ? '등원'
                            : access.alarm_type === 4
                            ? '하원'
                            : '비상'}
                            </TableCell>
                            <TableCell>
                              {access.employee_id == 0 ? '' : ''}
                            </TableCell>
                            <TableCell>
                              {access.name !== 'unknown'? access.location : ''}
                            </TableCell>
                            <TableCell>
                              {access.name !== 'unknown'? access.position : ''}
                              <TableCell>
                              {tempType === 1
                                ? String(access.avatar_temperature).substring(
                                    0,
                                    4
                                  )
                                : '정상 체온'}
                            </TableCell>
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
                            
                            {/* <TableCell>
                              {access.distance ? String(access.distance).substr(0,4) : 0}%
                            </TableCell> */}
                            <TableCell style={{"white-space": "pre-wrap"}}>
                                  {access.sensor_dust
                                  ?"PM10: "+access.sensor_dust+"\n"+
                                  "PM2.5: "+access.sensor_pm25+"\n"+
                                  "PM1: "+access.sensor_pm1+" "
                                  : ''}
                              </TableCell>
                              <TableCell>
                                  {access.sensor_humidity
                                  ? access.sensor_humidity
                                  : ''}
                              </TableCell>
                            <TableCell>
                              {access.sensor_CO2
                              ? access.sensor_CO2
                              : ''}
                            </TableCell>
                            <TableCell>
                              {access.sensor_temperature
                              ? access.sensor_temperature
                              : ''}
                            </TableCell>
                            <TableCell style={{"white-space": "pre-wrap"}}>
                            {access.access_time.split(' ')[0]+"\n"+
                              access.access_time.split(' ')[1]}
                            </TableCell>
                            <TableCell style={{"white-space": "pre-wrap"}}>
                                {access.weather_temperature
                                ?"온도: "+access.weather_temperature+"°C "+"\n"+
                                "강수: "+access.weather_rain+"\n"+
                                "습도: "+access.weather_humidity+"% "+"\n"+
                                "풍속: "+access.weather_windSpeed+"m/s"
                                : ''}
                            </TableCell>
                            {/* <TableCell>
                              {access.alarm_type === 5 
                                ? access.access_time.split(' ')[0]+"\n"+
                                access.access_time.split(' ')[1]
                                : ''}
                            </TableCell> */}
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
                      else{
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
                                    src={isOut ? access.avatar_file_url.replace('172.16.41.114:3000','211.204.122.90:10891') : access.avatar_file_url}></img>
                                </div>
                              </TableCell>
                              <TableCell className={classes.redFont}>
                                {access.name !== 'unknown'? access.name : ''}
                              </TableCell>
                              <TableCell className={classes.redFont}>
                                {access.name !== 'unknown' ? (access.gender == 1 ? '남자' : '여자') : ''}
                              </TableCell>
                              <TableCell className={classes.redFont}>
                              {access.alarm_type === 1
                              ? '승차'
                              : access.alarm_type === 2
                              ? '하차'
                              : access.alarm_type === 3
                              ? '등원'
                              : access.alarm_type === 4
                              ? '하원'
                              : '비상'}
                              </TableCell>
                              <TableCell className={classes.redFont}>
                              {access.name !== 'unknown' ? access.employee_id : ''}
                              </TableCell>
                              <TableCell className={classes.redFont}>
                                {access.name !== 'unknown' ? access.location : ''}
                              </TableCell>
                              <TableCell className={classes.redFont}>
                                {access.name !== 'unknown' ? access.position : ''}
                              </TableCell>
                              <TableCell className={classes.redFont}>
                                {tempType === 1
                                  ? String(access.avatar_temperature).substring(
                                      0,
                                      4
                                    )
                                  : '정상 체온'}
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
                              
                              {/* <TableCell className={classes.redFont}>
                                {access.distance ? String(access.distance).substr(0,4) : 0}%
                              </TableCell> */}
                              
                              <TableCell className={classes.redFont} style={{"white-space": "pre-wrap"}}>
                                  {access.sensor_dust
                                  ?"PM10: "+access.sensor_dust+"\n"+
                                  "PM2.5: "+access.sensor_pm25+"\n"+
                                  "PM1: "+access.sensor_pm1+" "
                                  : ''}
                              </TableCell>
                              <TableCell>
                                  {access.sensor_humidity
                                  ? access.sensor_humidity
                                  : ''}
                              </TableCell>
                              <TableCell>
                                {access.sensor_temperature
                                ? access.sensor_temperature
                                : ''}
                              </TableCell>
                              <TableCell className={classes.redFont} style={{"white-space": "pre-wrap"}}>
                                {access.access_time.split(' ')[0]+"\n"+
                                access.access_time.split(' ')[1]}
                              </TableCell>
                              <TableCell className={classes.redFont} style={{"white-space": "pre-wrap"}}>
                                  {access.weather_temperature
                                  ?"온도: "+access.weather_temperature+"°C "+"\n"+
                                  "강수: "+access.weather_rain+"\n"+
                                  "습도: "+access.weather_humidity+"% "+"\n"+
                                  "풍속: "+access.weather_windSpeed+"m/s"
                                  : ''}
                              </TableCell>
                              {/* <TableCell className={classes.redFont}>
                              {access.alarm_type === 5 
                                  ? access.access_time.split(' ')[0]+"\n"+
                                  access.access_time.split(' ')[1]
                                  : ''}
                              </TableCell> */}
                              <TableCell className={classes.redFont}>
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
                              <TableCell className={classes.orangeFont}>
                                <div className={classes.nameContainer}>
                                  <img
                                    style={{cursor: 'pointer'}} onClick={()=>{clickImage(access.avatar_file_url)}}
                                    alt="screenShot"
                                    height="90px"
                                    width="70px"
                                    className={classes.avatar}
                                    src={isOut ? access.avatar_file_url.replace('172.16.41.114:3000','211.204.122.90:10891') : access.avatar_file_url}></img>
                                </div>
                              </TableCell>
                              <TableCell className={classes.orangeFont}>
                                {access.name !== 'unknown'? access.name : ''}
                              </TableCell>
                              <TableCell className={classes.orangeFont}>
                                {access.gender == 1 ? '남자' : '여자'}
                              </TableCell>
                              <TableCell className={classes.orangeFont}>
                              {access.alarm_type === 1
                              ? '승차'
                              : access.alarm_type === 2
                              ? '하차'
                              : access.alarm_type === 3
                              ? '등원'
                              : access.alarm_type === 4
                              ? '하원'
                              : '비상'}
                              </TableCell>
                              <TableCell className={classes.orangeFont}>
                              {access.name !== 'unknown' ? access.employee_id : ''}
                              </TableCell>
                              <TableCell className={classes.orangeFont}>
                                {access.location}
                              </TableCell>
                              <TableCell className={classes.orangeFont}>
                                {access.position}
                              </TableCell>
                              <TableCell className={classes.orangeFont}>
                                {tempType === 1
                                  ? String(access.avatar_temperature).substring(
                                      0,
                                      4
                                    )
                                  : '정상 체온'}
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
                              
                              {/* <TableCell className={classes.orangeFont}>
                                {access.distance ? String(access.distance).substr(0,4) : 0}%
                              </TableCell> */}
                      
                              <TableCell className={classes.orangeFont} style={{"white-space": "pre-wrap"}}>
                                  {access.sensor_dust
                                  ?"PM10: "+access.sensor_dust+"\n"+
                                  "PM2.5: "+access.sensor_pm25+"\n"+
                                  "PM1: "+access.sensor_pm1+" "
                                  : ''}
                              </TableCell>
                              <TableCell>
                                  {access.sensor_humidity
                                  ? access.sensor_humidity
                                  : ''}
                              </TableCell>
                              <TableCell className={classes.orangeFont}>
                                {access.sensor_CO2
                                ? access.sensor_CO2
                                : ''}
                              </TableCell>
                              <TableCell>
                                {access.sensor_temperature
                                ? access.sensor_temperature
                                : ''}
                              </TableCell>
                              <TableCell className={classes.orangeFont} style={{"white-space": "pre-wrap"}}>
                              {access.access_time.split(' ')[0]+"\n"+
                                access.access_time.split(' ')[1]}
                              </TableCell>
                              <TableCell className={classes.orangeFont} style={{"white-space": "pre-wrap"}}>
                                  {access.weather_temperature
                                  ?"온도: "+access.weather_temperature+"°C "+"\n"+
                                  "강수: "+access.weather_rain+"\n"+
                                  "습도: "+access.weather_humidity+"% "+"\n"+
                                  "풍속: "+access.weather_windSpeed+"m/s"
                                  : ''}
                              </TableCell>
                              {/* <TableCell className={classes.orangeFont}>
                              {access.alarm_type === 5 
                                  ? access.access_time.split(' ')[0]+"\n"+
                                  access.access_time.split(' ')[1]
                                  : ''}
                              </TableCell> */}
                              <TableCell className={classes.orangeFont}>
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
                                    src={isOut ? access.avatar_file_url.replace('172.16.41.114:3000','211.204.122.90:10891') : access.avatar_file_url}></img>
                                </div>
                              </TableCell>
                              <TableCell>
                                {access.name !== 'unknown'? access.name : ''}
                              </TableCell>
                              <TableCell>
                                {access.name !== 'unknown'? access.gender == 1 ? '남자' : '여자' : ''}
                              </TableCell>
                              <TableCell>
                              {access.alarm_type === 1
                              ? '승차'
                              : access.alarm_type === 2
                              ? '하차'
                              : access.alarm_type === 3
                              ? '등원'
                              : access.alarm_type === 4
                              ? '하원'
                              : '비상'}
                              </TableCell>
                              <TableCell>
                                {access.name !== 'unknown' ? access.employee_id : ''}
                              </TableCell>
                              <TableCell>
                                {access.name !== 'unknown'? access.location : ''}
                              </TableCell>
                              <TableCell>
                                {access.name !== 'unknown'? access.position : ''}
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
                                {access.stb_location ? access.stb_location : ''}
                              </TableCell>
                              <TableCell>
                                {access.stb_name}
                              </TableCell>
                              <TableCell>
                                {access.stb_sn}
                              </TableCell>
                              
                              {/* <TableCell>
                                {access.distance ? String(access.distance).substr(0,4) : 0}%
                              </TableCell> */}
                              <TableCell style={{"white-space": "pre-wrap"}}>
                                  {access.sensor_dust
                                  ?"PM10: "+access.sensor_dust+"\n"+
                                  "PM2.5: "+access.sensor_pm25+"\n"+
                                  "PM1: "+access.sensor_pm1+" "
                                  : ''}
                              </TableCell>
                              <TableCell>
                                  {access.sensor_humidity
                                  ? access.sensor_humidity
                                  : ''}
                              </TableCell>
                              <TableCell>
                                {access.sensor_CO2
                                ? access.sensor_CO2
                                : ''}
                              </TableCell>
                              <TableCell>
                                {access.sensor_temperature
                                ? access.sensor_temperature
                                : ''}
                              </TableCell>
                              <TableCell style={{"white-space": "pre-wrap"}}>
                              {access.access_time.split(' ')[0]+"\n"+
                                access.access_time.split(' ')[1]}
                              </TableCell>
                              <TableCell style={{"white-space": "pre-wrap"}}>
                                  {access.weather_temperature
                                  ?"온도: "+access.weather_temperature+"°C "+"\n"+
                                  "강수: "+access.weather_rain+"\n"+
                                  "습도: "+access.weather_humidity+"% "+"\n"+
                                  "풍속: "+access.weather_windSpeed+"m/s"
                                  : ''}
                              </TableCell>
                              {/* <TableCell>
                                {access.alarm_type === 5 
                                  ? access.access_time.split(' ')[0]+"\n"+
                                  access.access_time.split(' ')[1]
                                  : ''}
                              </TableCell> */}
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
                      }
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
