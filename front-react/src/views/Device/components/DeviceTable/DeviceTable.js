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
  DialogTitle,
  CardContent,
  Dialog,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  DialogContent,
  DialogContentText,
  DialogActions,
  LinearProgress
} from '@material-ui/core';

import { getInitials } from 'helpers';
import mqtt from 'mqtt'

const client = mqtt.connect('ws://172.16.135.89:8083/mqtt')

client.on('connect',() => {
  console.log('mqtt was connected');
  client.subscribe('/access/realtime/result/+')
  client.subscribe('/control/log/result/+')
  client.subscribe('/control/capture/start/result/+')
  client.subscribe('/control/capture/end/result+')
  client.subscribe('/control/sdcard/delete/result/+')
  client.subscribe('/control/sdcard/part/delete/result+')
  client.subscribe('/control/reboot/result/+')
  client.subscribe('/control/get_device_file_list/result/+')
  client.subscribe('/control/reset/result/+')
})

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

const DeviceTable = props => {
  const {loading,stream,setStream,userSearch,setSearch,selectedNode,setClickedNode,clickedNode,setUsers,deleteDevice,className,device, ...rest } = props;

  const classes = useStyles();

  const [rowsPerPage, setRowsPerPage] = useState(7);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState([]);
  const [selectedObject, setSelectedObject] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [captureTime,setCaptureTime] = useState({
    min:"",
    sec:""
  });
  const [temp,setTemp] = useState();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = device.map((n) => n._id);
      setSelected(newSelecteds);
      setSelectedObject(device)
      return;
    }
    setSelected([]);
  };

  const handlePageChange = (event, page) => {
    setPage(page);
  };

  const handleClick = (event, node, index) => {
    if(node.config_data && node.config_data.capture_time) {
      let time = node.config_data.capture_time.split(":")
      setCaptureTime({min:time[0],sec:time[1]})
    } else {
      setCaptureTime({min:'',sec:''});
    }

    if(selected.length === 0) {
      setSelectedObject(node)
    }
    // const selectedIndex = selected.indexOf(node._id);
    // let newSelected = [];
    // let newSelectedObject = [];
    // if (selectedIndex === -1) {
    //   node.index = index;
    setSelectedObject(node);
    setSelected([node._id]);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  }

  const handleChange = (e) => {
    if(e.target.value.length < 3 && (e.target.value < 61)) {
      setCaptureTime({
        ...captureTime,
        [e.target.name]: e.target.value
      })
    }
  }

  const handleTempChange = (e) => {
    if(e.target.value.length < 3 && (e.target.value < 40)) {
      setTemp(e.target.value)
    }
  }

  const mqttPubl = (name) => {
    if(name==="capture_start") client.publish('/control/capture/start/'+selectedObject.serial_number,JSON.stringify({stb_sn:selectedObject.serial_number,"capture_time":`${captureTime.min.length === 1 ? "0"+captureTime.min:captureTime.min}:${captureTime.sec.length === 1 ? "0"+captureTime.sec:captureTime.sec}`,"capture_size":"320*240", "capture_status":"Y"}));
    else if(name==="capture_end") client.publish('/control/capture/end/'+selectedObject.serial_number,JSON.stringify({stb_sn:selectedObject.serial_number,"stb_id":"", "capture_time":`${captureTime.min.length === 1 ? "0"+captureTime.min:captureTime.min}:${captureTime.sec.length === 1 ? "0"+captureTime.sec:captureTime.sec}`,"capture_size":"320*240", "capture_status":"N"}))
    else if(name==="log") client.publish('/control/log/'+selectedObject.serial_number,JSON.stringify({stb_sn:selectedObject.serial_number}));
    else if(name==="sd") client.publish('/control/sdcard/delete/'+selectedObject.serial_number,JSON.stringify({stb_sn:selectedObject.serial_number}));
    else if(name==="sd_unused") client.publish('/control/sdcard/part/delete/'+selectedObject.serial_number,JSON.stringify({stb_sn:selectedObject.serial_number}));
    else if(name==="reboot") client.publish('/control/reboot/'+selectedObject.serial_number,JSON.stringify({stb_sn:selectedObject.serial_number, "message":"reboot"}));
    else if(name==="contents") client.publish('/control/get_device_file_list/'+selectedObject.serial_number,JSON.stringify({stb_sn:selectedObject.serial_number, "message":"get_device_file_list"}));
    else if(name==="reset") client.publish('/control/reset/'+selectedObject.serial_number,JSON.stringify({stb_sn:selectedObject.serial_number}));
    else if (name==='temp') client.publish('/control/temperature/' + selectedObject.serial_number,JSON.stringify({type:1,stb_sn : selectedObject.serial_number,temperature_max : temp}));
    alert('제어성공')
  }

  const isSelected = (_id) => selected.indexOf(_id) !== -1;

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Mqtt 제어"}</DialogTitle>
        <DialogContent style={{textAlign: "center"}}>
          {/* <DialogContentText style={{textAlign: "center"}} id="alert-dialog-description"> */}
            <TextField
              id="standard-start-adornment"
              style={{width:40}}
              value={captureTime.min}
              name="min"
              onChange={handleChange}
              InputProps={{
                endAdornment: <InputAdornment position="end">분</InputAdornment>,
              }}
            />
            <span style={{margin:"0px 3px 0px 3px"}}>:</span>
            <TextField
              id="standard-start-adornment"
              style={{width:40}}
              name="sec"
              value={captureTime.sec}
              onChange={handleChange}
              InputProps={{
                endAdornment: <InputAdornment position="end">초</InputAdornment>,
              }}
            /><br/><br/>
            <Button variant="contained" onClick={() => {mqttPubl("capture_start")}} style={{margin:'0 3px 0 0'}} color="primary">캡쳐 시작</Button>
            <Button variant="contained" onClick={() => {mqttPubl("capture_end")}} style={{margin:'0 0 0 3px'}} color="primary">캡쳐 종료</Button><br/><br/>
            <Button variant="contained" onClick={() => {mqttPubl("log")}} style={{margin:'0 3px 0 0'}} color="primary">단말기 로그 요청</Button>
            <Button variant="contained" onClick={() => {mqttPubl("sd")}} style={{margin:'0 0 0 3px'}} color="primary">SD카드 삭제</Button><br/><br/>
            <Button variant="contained" onClick={() => {mqttPubl("sd_unused")}} style={{margin:'0 3px 0 0'}} color="primary">SD카드 미사용 파일 삭제</Button>
            <Button variant="contained" onClick={() => {mqttPubl("reboot")}} style={{margin:'0 0 0 3px'}} color="primary">재부팅</Button><br/><br/>
            <Button variant="contained" onClick={() => {mqttPubl("contents")}} style={{margin:'0 3px 0 0'}} color="primary">단말 컨텐츠 목록 요청</Button>
            <Button variant="contained" onClick={() => {mqttPubl("reset")}} style={{margin:'0 0 0 3px'}} color="primary">시스템 초기화</Button><br/><br/>
            <TextField
              id="standard-start-adornment"
              style={{width:40}}
              name="temp"
              value={temp}
              onChange={handleTempChange}
              InputProps={{
                endAdornment: <InputAdornment position="end">℃</InputAdornment>,
              }}
            />
            <Button variant="contained" onClick={() => {mqttPubl("temp")}} style={{margin:'0 0 0 3px'}} color="primary">온도 조절</Button>
          {/* </DialogContentText> */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            닫기
          </Button>
        </DialogActions>
      </Dialog>
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
              selected.length === 1 ? 
              <Button variant="contained" color="secondary" className={classes.buttonStyle} onClick={() =>{ deleteDevice(selectedObject); setSelectedObject([])}}>삭제</Button> :
              <Button variant="contained" color="secondary" className={classes.buttonStyle} disabled>삭제</Button>
            }
            {
              selected.length === 1 ? 
              <Button variant="contained" color="primary" onClick={() =>{ 
                if(selectedObject.status === "N") {
                  alert("단말을 연결해주세요")
                } else {
                  setOpen(true)
                }
              }}>제어</Button> :
              <Button variant="contained" color="primary" disabled>제어</Button>
            }
            {
              selected.length === 1 ? 
              <RouterLink style={{ textDecoration: 'none' }} to={{
                pathname:"/device/edit",
                deviceObject:selectedObject,
                }}><Button variant="contained" color="primary" className={classes.buttonStyle}>수정</Button></RouterLink> :
              <Button variant="contained" color="primary" className={classes.buttonStyle} disabled>수정</Button> 
            }
            
            <RouterLink style={{ textDecoration: 'none' }} to={{
              pathname:"/device/add",
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
                  </TableCell>
                  <TableCell>단말명</TableCell>
                  <TableCell>시리얼 넘버</TableCell>
                  <TableCell>버전</TableCell>
                  <TableCell>IP</TableCell>
                  <TableCell>포트</TableCell>
                  <TableCell>위치</TableCell>
                  <TableCell>연결상태</TableCell>
                  <TableCell>스트리밍</TableCell>
                </TableRow>
              </TableHead>
              {loading ? <LinearProgress style={{width:"5750%"}} /> : null}
              <TableBody>
                {props.device.slice((page-1) * rowsPerPage, (page-1) * rowsPerPage + rowsPerPage).map((device,index) => {
                  const isItemSelected = isSelected(device._id);
                  return(
                    <TableRow
                      key={props.device._id}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          onChange={(event) => handleClick(event, device, index)}
                          checked={isItemSelected}
                        />
                      </TableCell>
                      <TableCell>{device.name}</TableCell>
                      <TableCell>{device.serial_number}</TableCell>
                      <TableCell>{device.app_version}</TableCell>
                      <TableCell>{device.ip}</TableCell>
                      <TableCell>{device.port}</TableCell>
                      <TableCell>{device.location}</TableCell>
                      <TableCell>{device.status}</TableCell>
                      <TableCell>
                        {stream === device.ip ? <Button size="small" disabled variant="contained" color="primary" onClick={() => {setStream(device.ip)}}>스트리밍 재생</Button> :
                        <Button size="small" variant="contained" color="primary" onClick={() => {setStream(device.ip)}}>스트리밍 재생</Button>}
                      </TableCell>
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
          count={ props.device.length%rowsPerPage === 0 ? parseInt(props.device.length/rowsPerPage) :
          parseInt(props.device.length/rowsPerPage+(parseInt(props.device.length%rowsPerPage)/parseInt(props.device.length%rowsPerPage)))}
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

DeviceTable.propTypes = {
  className: PropTypes.string,
  deleteDevice : PropTypes.func,
  setClickedNode : PropTypes.func,
  clickedNode : PropTypes.object,
  setUsers : PropTypes.func,
  selectedNode : PropTypes.array,
  setStream : PropTypes.func,
  stream : PropTypes.string,
  setSearch : PropTypes.func,
};



export default DeviceTable;
