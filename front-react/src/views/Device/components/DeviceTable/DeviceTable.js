import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import Pagination from '@material-ui/lab/Pagination';
import TextField from '@material-ui/core/TextField';
import Search from '@material-ui/icons/Search';
import PowerSettingsNew from '@material-ui/icons/PowerSettingsNew';
import InputAdornment from '@material-ui/core/InputAdornment';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import { NavLink as RouterLink } from 'react-router-dom';
import NumberFormat from 'react-number-format';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import {
  Card,
  CardActions,
  DialogTitle,
  CardContent,
  Dialog,
  FormControlLabel,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  DialogContent,
  DialogActions,
  LinearProgress,
  TableContainer,
  Paper
} from '@material-ui/core';

import mqtt from 'mqtt';

let mqtt_url = window.location.href.split('/')[2];
const client = mqtt.connect('ws://'+mqtt_url+':8083/mqtt');

client.on('connect', () => {
  console.log('mqtt was connected');
  client.subscribe('/access/realtime/result/+');
  client.subscribe('/control/log/result/+');
  client.subscribe('/control/capture/start/result/+');
  client.subscribe('/control/capture/end/result+');
  client.subscribe('/control/sdcard/delete/result/+');
  client.subscribe('/control/sdcard/part/delete/result+');
  client.subscribe('/control/reboot/result/+');
  client.subscribe('/control/get_device_file_list/result/+');
  client.subscribe('/control/reset/result/+');
});

function NumberFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={values => {
        onChange({
          target: {
            name: props.name,
            value: values.value
          }
        });
      }}
      thousandSeparator
      isNumericString
    />
  );
}

NumberFormatCustom.propTypes = {
  inputRef: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
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
    margin: '5px',
    [theme.breakpoints.down(540)]: {
      margin: '5px 10%'
    }
  },
  activeStyle: {
    color: 'white',
    textDecoration: 'none'
  },
  on: {
    color: 'green'
  },
  off: {
    color: 'red'
  }
}));

const DeviceTable = props => {
  const {
    sortAccesses,
    activeType,
    loading,
    history,
    stream,
    setStream,
    userSearch,
    setSearch,
    selectedNode,
    setClickedNode,
    clickedNode,
    setUsers,
    deleteDevice,
    className,
    device,
    ...rest
  } = props;
  // const history = props.history;
  const classes = useStyles();

  const rowsPerPage = 7;
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState([]);
  const [selectedObject, setSelectedObject] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [captureTime, setCaptureTime] = useState({
    min: '',
    sec: ''
  });
  const [check, setCheck] = useState(false);
  const [sort, setSort] = useState('desc');
  const [temp, setTemp] = useState();

  const createSortHandler = headerType => {
    if (sort === 'desc') {
      setSort('asc');
      sortAccesses('asc', headerType);
    } else {
      setSort('desc');
      sortAccesses('desc', headerType);
    }
  };

  const handleClose = () => {
    setOpen(false);
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

  // const handleClick = (event, node, index) => {
  //   if(node.config_data && node.config_data.capture_time) {
  //     let time = node.config_data.capture_time.split(":")
  //     setCaptureTime({min:time[0],sec:time[1]})
  //   } else {
  //     setCaptureTime({min:'1',sec:''});
  //   }

  //   if(selected.length === 0) {
  //     setSelectedObject(node)
  //   }
  //   // const selectedIndex = selected.indexOf(node._id);
  //   // let newSelected = [];
  //   // let newSelectedObject = [];
  //   // if (selectedIndex === -1) {
  //   //   node.index = index;
  //   setSelectedObject(node);
  //   setSelected([node._id]);
  // };

  const handleSelectAllClick = event => {
    if (event.target.checked) {
      const newSelecteds = props.device.map(n => n._id);
      setSelected(newSelecteds);
      setSelectedObject(props.device);
      return;
    }
    setSelected([]);
  };

  const handleSearch = e => {
    setSearch(e.target.value);
  };

  const handleChange = e => {
    if (e.target.value < 999) {
      setCaptureTime({
        ...captureTime,
        [e.target.name]: e.target.value
      });
    }
  };

  const handleTempChange = e => {
    // if(e.target.value.length < 5 && (e.target.value < 40)) {
    setTemp(e.target.value);
    // }
  };

  const clickEdit = () => {
    history.push({ pathname: '/device/edit', state: selectedObject[0] });
    // history.push('/system/account')
  };

  const mqttPubl = name => {
    if (name === 'capture_start')
      client.publish(
        '/control/capture/start/' + selectedObject[0].serial_number,
        JSON.stringify({
          stb_sn: selectedObject[0].serial_number,
          capture_time: `${
            captureTime.min.length === 1
              ? '0' + captureTime.min
              : captureTime.min
          }:${
            captureTime.sec.length === 1
              ? '0' + captureTime.sec
              : captureTime.sec
          }`,
          capture_size: '320*240',
          capture_status: 'Y'
        })
      );
    else if (name === 'capture_end')
      client.publish(
        '/control/capture/end/' + selectedObject[0].serial_number,
        JSON.stringify({
          stb_sn: selectedObject[0].serial_number,
          stb_id: '',
          capture_time: `${
            captureTime.min.length === 1
              ? '0' + captureTime.min
              : captureTime.min
          }:${
            captureTime.sec.length === 1
              ? '0' + captureTime.sec
              : captureTime.sec
          }`,
          capture_size: '320*240',
          capture_status: 'N'
        })
      );
    else if (name === 'log')
      client.publish(
        '/control/log/' + selectedObject[0].serial_number,
        JSON.stringify({ stb_sn: selectedObject[0].serial_number })
      );
    else if (name === 'sd')
      client.publish(
        '/control/sdcard/delete/' + selectedObject[0].serial_number,
        JSON.stringify({ stb_sn: selectedObject[0].serial_number })
      );
    else if (name === 'sd_unused')
      client.publish(
        '/control/sdcard/part/delete/' + selectedObject[0].serial_number,
        JSON.stringify({ stb_sn: selectedObject[0].serial_number })
      );
    else if (name === 'reboot')
      client.publish(
        '/control/reboot/' + selectedObject[0].serial_number,
        JSON.stringify({
          stb_sn: selectedObject[0].serial_number,
          message: 'reboot'
        })
      );
    else if (name === 'contents')
      client.publish(
        '/control/get_device_file_list/' + selectedObject[0].serial_number,
        JSON.stringify({
          stb_sn: selectedObject[0].serial_number,
          message: 'get_device_file_list'
        })
      );
    else if (name === 'reset')
      client.publish(
        '/control/reset/' + selectedObject[0].serial_number,
        JSON.stringify({ stb_sn: selectedObject[0].serial_number })
      );
    else if (name === 'temp') {
      if (temp.split('.')[1] === '') {
        setTemp(temp + '0');
      }
      client.publish(
        '/control/temperature/' + selectedObject[0].serial_number,
        JSON.stringify({
          type: 1,
          stb_sn: selectedObject[0].serial_number,
          temperature_max: temp
        })
      );
    }
    alert('제어성공');
  };

  const devicesMqttPubl = name => {
    let stb_sns;
    if (check) {
      stb_sns = props.device.map(i => i.serial_number);
    } else {
      stb_sns = selectedObject.map(i => i.serial_number);
    }
    if (name === 'capture_start')
      client.publish(
        '/control/capture/start/devices',
        JSON.stringify({
          stb_sn: stb_sns,
          capture_time: `${
            captureTime.min.length === 1
              ? '0' + captureTime.min
              : captureTime.min
          }:${
            captureTime.sec.length === 1
              ? '0' + captureTime.sec
              : captureTime.sec
          }`,
          capture_size: '320*240',
          capture_status: 'Y'
        })
      );
    else if (name === 'capture_end')
      client.publish(
        '/control/capture/end/devices',
        JSON.stringify({
          stb_sn: stb_sns,
          stb_id: '',
          capture_time: `${
            captureTime.min.length === 1
              ? '0' + captureTime.min
              : captureTime.min
          }:${
            captureTime.sec.length === 1
              ? '0' + captureTime.sec
              : captureTime.sec
          }`,
          capture_size: '320*240',
          capture_status: 'N'
        })
      );
    else if (name === 'log')
      client.publish(
        '/control/log/devices',
        JSON.stringify({ stb_sn: stb_sns })
      );
    else if (name === 'sd')
      client.publish(
        '/control/sdcard/delete/devices',
        JSON.stringify({ stb_sn: stb_sns })
      );
    else if (name === 'sd_unused')
      client.publish(
        '/control/sdcard/part/delete/devices',
        JSON.stringify({ stb_sn: stb_sns })
      );
    else if (name === 'reboot')
      client.publish(
        '/control/reboot/devices',
        JSON.stringify({ stb_sn: stb_sns, message: 'reboot' })
      );
    else if (name === 'contents')
      client.publish(
        '/control/get_device_file_list/devices',
        JSON.stringify({ stb_sn: stb_sns, message: 'get_device_file_list' })
      );
    else if (name === 'reset')
      client.publish(
        '/control/reset/devices',
        JSON.stringify({ stb_sn: stb_sns })
      );
    else if (name === 'temp') {
      if (temp.split('.')[1] === '') {
        setTemp(temp + '0');
      }
      client.publish(
        '/control/temperature/devices',
        JSON.stringify({
          type: 1,
          stb_sn: stb_sns.serial_number,
          temperature_max: temp
        })
      );
    }
    alert('제어성공');
  };

  const handleCheckChange = e => {
    if (check === false) {
      if (
        window.confirm(
          '체크 할 시 목록에 존재하는\n모든 단말을 제어 합니다\n체크 하시겠습니까?'
        )
      ) {
        setCheck(!check);
      }
    } else {
      setCheck(!check);
    }
  };

  const isSelected = _id => selected.indexOf(_id) !== -1;

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth={'sm'}
        fullWidth={true}>
        <DialogTitle id="alert-dialog-title">{'Mqtt 제어'}</DialogTitle>
        <DialogContent
          style={{ textAlign: 'center', width: '70%', margin: '0 auto' }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={check}
                onChange={handleCheckChange}
                inputProps={{ 'aria-label': 'primary checkbox' }}
              />
            }
            label="모든 단말에 적용하기"
          />
          <div style={{ marginLeft: 15 }}>
            <TextField
              id="standard-start-adornment"
              style={{ width: 70 }}
              value={captureTime.min || '1'}
              name="min"
              onChange={handleChange}
              InputProps={{
                endAdornment: <InputAdornment position="end">분</InputAdornment>
              }}
            />
            <span
              style={{
                margin: '0px 10px 0px 10px',
                position: 'relative',
                top: 6
              }}>
              :
            </span>
            <TextField
              id="standard-start-adornment"
              style={{ width: 70, margin: '0 15px 0 0' }}
              name="sec"
              value={captureTime.sec || '0'}
              onChange={handleChange}
              InputProps={{
                endAdornment: <InputAdornment position="end">초</InputAdornment>
              }}
            />
          </div>
          <br />
          {selectedObject.length === 1 ? (
            <div>
              <Button
                variant="contained"
                onClick={() => {
                  !check
                    ? mqttPubl('capture_start')
                    : devicesMqttPubl('capture_start');
                }}
                style={{ margin: '0 4px 0 0' }}
                color="primary">
                캡쳐 시작
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  !check
                    ? mqttPubl('capture_end')
                    : devicesMqttPubl('capture_end');
                }}
                style={{ margin: '0 0 0 4px' }}
                color="primary">
                캡쳐 종료
              </Button>
              <br />
              <br />
              <TextField
                id="standard-start-adornment"
                style={{ width: 70 }}
                name="temp"
                value={temp || '36.5'}
                onChange={handleTempChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">℃</InputAdornment>
                  )
                }}
              />
              <Button
                variant="contained"
                onClick={() => {
                  !check ? mqttPubl('temp') : devicesMqttPubl('temp');
                }}
                style={{ margin: '0 0 0 25px' }}
                color="primary">
                온도 조절
              </Button>
              <br />
              <br />
              <Button
                variant="contained"
                onClick={() => {
                  !check ? mqttPubl('reboot') : devicesMqttPubl('reboot');
                }}
                style={{ width: '181.58px' }}
                color="primary">
                재부팅
              </Button>
              <br />
              <br />
              <Button
                variant="contained"
                onClick={() => {
                  !check ? mqttPubl('sd') : devicesMqttPubl('sd');
                }}
                style={{ width: '181.58px' }}
                color="primary">
                SD카드 삭제
              </Button>
              <br />
              <br />
              <Button
                variant="contained"
                onClick={() => {
                  !check ? mqttPubl('reset') : devicesMqttPubl('reset');
                }}
                style={{ width: '181.58px' }}
                color="primary">
                시스템 초기화
              </Button>
              <br />
              <br />
              <Button
                variant="contained"
                onClick={() => {
                  !check ? mqttPubl('log') : devicesMqttPubl('log');
                }}
                style={{ width: '181.58px' }}
                color="primary">
                단말기 로그 요청
              </Button>
              <br />
              <br />
              <Button
                variant="contained"
                onClick={() => {
                  !check ? mqttPubl('contents') : devicesMqttPubl('contents');
                }}
                style={{ width: '181.58px' }}
                color="primary">
                단말 컨텐츠 목록 요청
              </Button>
              <br />
              <br />
              <Button
                variant="contained"
                onClick={() => {
                  !check ? mqttPubl('sd_unused') : devicesMqttPubl('sd_unused');
                }}
                style={{ width: '181.58px' }}
                color="primary">
                SD카드 미사용 파일 삭제
              </Button>
              <br />
              <br />
            </div>
          ) : (
            <div>
              <Button
                variant="contained"
                onClick={() => {
                  devicesMqttPubl('capture_start');
                }}
                style={{ margin: '0 4px 0 0' }}
                color="primary">
                캡쳐 시작
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  devicesMqttPubl('capture_end');
                }}
                style={{ margin: '0 0 0 4px' }}
                color="primary">
                캡쳐 종료
              </Button>
              <br />
              <br />
              <TextField
                id="standard-start-adornment"
                style={{ width: 70 }}
                name="temp"
                value={temp || '36.5'}
                onChange={handleTempChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">℃</InputAdornment>
                  )
                }}
              />
              <Button
                variant="contained"
                onClick={() => {
                  devicesMqttPubl('temp');
                }}
                style={{ margin: '0 0 0 25px' }}
                color="primary">
                온도 조절
              </Button>
              <br />
              <br />
              <Button
                variant="contained"
                onClick={() => {
                  devicesMqttPubl('reboot');
                }}
                style={{ width: '181.58px' }}
                color="primary">
                재부팅
              </Button>
              <br />
              <br />
              <Button
                variant="contained"
                onClick={() => {
                  devicesMqttPubl('sd');
                }}
                style={{ width: '181.58px' }}
                color="primary">
                SD카드 삭제
              </Button>
              <br />
              <br />
              <Button
                variant="contained"
                onClick={() => {
                  devicesMqttPubl('reset');
                }}
                style={{ width: '181.58px' }}
                color="primary">
                시스템 초기화
              </Button>
              <br />
              <br />
              <Button
                variant="contained"
                onClick={() => {
                  devicesMqttPubl('log');
                }}
                style={{ width: '181.58px' }}
                color="primary">
                단말기 로그 요청
              </Button>
              <br />
              <br />
              <Button
                variant="contained"
                onClick={() => {
                  devicesMqttPubl('contents');
                }}
                style={{ width: '181.58px' }}
                color="primary">
                단말 컨텐츠 목록 요청
              </Button>
              <br />
              <br />
              <Button
                variant="contained"
                onClick={() => {
                  devicesMqttPubl('sd_unused');
                }}
                style={{ width: '181.58px' }}
                color="primary">
                SD카드 미사용 파일 삭제
              </Button>
              <br />
              <br />
            </div>
          )}
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
              <InputAdornment position="end">
                <Search></Search>
              </InputAdornment>
            )
          }}
        />
        <Grid container justify="flex-end" className={classes.buttonActions}>
          {selected.length >= 1 ? (
            <Button
              variant="contained"
              color="secondary"
              className={classes.buttonStyle}
              onClick={() => {
                deleteDevice(selectedObject);
                setSelectedObject([]);
                setSelected([]);
              }}>
              삭제
            </Button>
          ) : (
            <Button
              variant="contained"
              color="secondary"
              className={classes.buttonStyle}
              disabled>
              삭제
            </Button>
          )}
          {selected.length >= 1 ? (
            <Button
              variant="contained"
              className={classes.buttonStyle}
              color="primary"
              onClick={() => {
                if (selectedObject.status === 'N') {
                  alert('단말을 연결해주세요');
                } else {
                  setOpen(true);
                }
              }}>
              제어
            </Button>
          ) : (
            <Button
              variant="contained"
              className={classes.buttonStyle}
              color="primary"
              disabled>
              제어
            </Button>
          )}
          {selected.length === 1 ? (
            <Button
              variant="contained"
              color="primary"
              onClick={clickEdit}
              className={classes.buttonStyle}>
              수정
            </Button>
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
            className={classes.buttonStyle}
            to={{
              pathname: '/device/add',
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
        {loading ? <LinearProgress style={{ width: '100%' }} /> : null}
        <TableContainer component={Paper}>
          <Table className={classes.inner} size="small">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={
                      selected.length === props.device.length &&
                      props.device.length !== 0
                        ? true
                        : false
                    }
                    onChange={handleSelectAllClick}
                  />
                </TableCell>
                <TableCell>
                  {props.device.length > 0 ? (
                    <TableSortLabel
                      active={activeType === 'name'}
                      direction={sort}
                      onClick={() => {
                        createSortHandler('name');
                      }}>
                      단말명
                    </TableSortLabel>
                  ) : (
                    '단말명'
                  )}
                </TableCell>
                <TableCell>
                  {props.device.length > 0 ? (
                    <TableSortLabel
                      active={activeType === 'stb_sn'}
                      direction={sort}
                      onClick={() => {
                        createSortHandler('stb_sn');
                      }}>
                      시리얼번호
                    </TableSortLabel>
                  ) : (
                    '시리얼번호'
                  )}
                </TableCell>
                <TableCell>
                  {props.device.length > 0 ? (
                    <TableSortLabel
                      active={activeType === 'ip'}
                      direction={sort}
                      onClick={() => {
                        createSortHandler('ip');
                      }}>
                      IP
                    </TableSortLabel>
                  ) : (
                    'IP'
                  )}
                </TableCell>
                <TableCell>
                  {props.device.length > 0 ? (
                    <TableSortLabel
                      active={activeType === 'location'}
                      direction={sort}
                      onClick={() => {
                        createSortHandler('location');
                      }}>
                      위치
                    </TableSortLabel>
                  ) : (
                    '위치'
                  )}
                </TableCell>
                <TableCell>
                  {props.device.length > 0 ? (
                    <TableSortLabel
                      style={{ textAlign: 'center' }}
                      active={activeType === 'status'}
                      direction={sort}
                      onClick={() => {
                        createSortHandler('status');
                      }}>
                      연결상태
                    </TableSortLabel>
                  ) : (
                    '연결상태'
                  )}
                </TableCell>
                {/* <TableCell>스트리밍</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {props.device
                .slice(
                  (page - 1) * rowsPerPage,
                  (page - 1) * rowsPerPage + rowsPerPage
                )
                .map((device, index) => {
                  const isItemSelected = isSelected(device._id);
                  return (
                    <TableRow key={device._id}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          onChange={event => handleClick(event, device, index)}
                          checked={isItemSelected}
                        />
                      </TableCell>
                      <TableCell>{device.name}</TableCell>
                      <TableCell>{device.serial_number}</TableCell>
                      <TableCell>{device.ip}</TableCell>
                      <TableCell>{device.location}</TableCell>
                      <TableCell style={{ padding: '0 0 0 30px' }}>
                        {device.status === 'Y' ? (
                          <PowerSettingsNew className={classes.on} />
                        ) : (
                          <PowerSettingsNew className={classes.off} />
                        )}
                      </TableCell>
                      {/* <TableCell>
                        {stream === device.ip ? <Button size="small" disabled variant="contained" color="primary" onClick={() => {setStream(device.ip)}}>스트리밍 재생</Button> :
                        <Button size="small" variant="contained" color="primary" onClick={() => {setStream(device.ip)}}>스트리밍 재생</Button>}
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
            count={
              props.device.length % rowsPerPage === 0
                ? parseInt(props.device.length / rowsPerPage)
                : parseInt(
                    props.device.length / rowsPerPage +
                      parseInt(props.device.length % rowsPerPage) /
                        parseInt(props.device.length % rowsPerPage)
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

DeviceTable.propTypes = {
  className: PropTypes.string,
  deleteDevice: PropTypes.func,
  setClickedNode: PropTypes.func,
  clickedNode: PropTypes.object,
  setUsers: PropTypes.func,
  selectedNode: PropTypes.array,
  setStream: PropTypes.func,
  stream: PropTypes.string,
  setSearch: PropTypes.func
};

export default DeviceTable;
