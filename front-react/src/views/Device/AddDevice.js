import React,{ useState,useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid,Card,CardContent,TextField,Button } from '@material-ui/core';
import axios from 'axios';
import PropTypes from 'prop-types';
import './image.css'
import Radio from '@material-ui/core/Radio';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  },
  details: {
    display: 'flex'
  },
  avatar: {
    marginLeft: 'auto',
    height: 110,
    width: 100,
    flexShrink: 0,
    flexGrow: 0
  },
  progress: {
    marginTop: theme.spacing(2)
  },
  search: {
    width:"100%"
  },
  action: {
    padding:"10px 20px"
  },
  tree: {
    // height: 240,
    flexGrow: 1,
    maxWidth: "100%",
  },
  treeItem: {
    fontSize:"18px",
  },
  labelRoot: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0.5, 0),
  },
  labelIcon: {
    marginRight: theme.spacing(1),
  },
  labelText: {
    fontWeight: 'inherit',
    fontSize:"16px",
    flexGrow: 1,
  },
}));

const AddDevice = (props) => {
  const classes = useStyles();
  const history = props.history;
  const [selectedValue, setSelectedValue] = useState('device');
  const [gateway,setGateway] = useState([])
  const [device, setDevice] = useState({
    name : '',
    location : '',
    gateway_obid : '',
    description: '',
    serial_number:'',
    status : 'N',
    protocol : '1',
  })
  const [gate, setGate] = useState({
    name:'',
    location:'',
    ip:'',
    port:0,
  })

  useEffect(() => {
    getGateway()
  },[])

  const getGateway = async () => {
    let result = await axios.get('http://172.16.135.89:3000/gateway')
    setGateway(result.data)
  }
  
  const handleDeviceChange = (event) => {
    setDevice({
      ...device,
      [event.target.name]: event.target.value,
    });
  };

  const handleGateChange = (event) => {
    setGate({
      ...gate,
      [event.target.name]: event.target.value,
    });
  };

  const handleRadioChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const addDevice = async () => {
    await axios.post('http://172.16.135.89:3000/camera',{
      ...device,
      account : props.user_id,
      authority : props.authority
    })
    window.alert('단말기 등록 완료.')
    history.push('/device/list')
  }

  const addGate = async () => {
    const port = 'port';
    await axios.post('http://172.16.135.89:3000/gateway',{
      ...gate,
      [port] : parseInt(gate.port),
      account : props.user_id,
    })
    window.alert('게이트웨이 등록 완료.')
    history.push('/device/list')
  }

  const renderDevice = () => {
    return (
      <div>
        {/* <FormControl style={{width: '100%'}}>
          <InputLabel id="gatewaySelector">게이트웨이</InputLabel>
          <Select
            name="gateway_obid"
            value={device.gateway_obid}
            labelId="gatewaySelector"
            style={{width:'100%'}} 
            onChange={handleDeviceChange}
            >
              {gateway.map((i) => (
                <MenuItem value={i._id}>{i.name}</MenuItem>
              ))}
          </Select>
        </FormControl> */}
        <div style={{width: '100%'}}>
          <TextField 
          name="name"
          value={device.name}
          style={{width:'100%'}} 
          required 
          id="standard-required" 
          label="이름"
          onChange={handleDeviceChange}
          />
        </div>
        <div style={{width: '100%'}}>
          <TextField 
          name="location"
          value={device.location}
          style={{width:'100%'}} 
          required 
          id="standard-required" 
          label="장소"
          onChange={handleDeviceChange}
          />
        </div>
        <div style={{width: '100%'}}>
          <TextField 
          name="serial_number"
          value={device.serial_number}
          style={{width:'100%'}} 
          required 
          id="standard-required" 
          label="시리얼넘버"
          onChange={handleDeviceChange}
          />
        </div>
        <div style={{width: '100%'}}>
          <TextField 
          name="description"
          value={device.description}
          style={{width:'100%'}} 
          required 
          id="standard-required" 
          label="비고"
          onChange={handleDeviceChange}
          />
        </div>
        <div style={{width: '100%',textAlign:'center',marginTop:"15px"}}>    
            <Button variant="contained" color="primary" onClick={addDevice}>추가</Button>
        </div>
      </div>
    )
  }

  // name:'',
  // location:'',
  // ip:'',
  // port:0,

  const renderGate = () => {
    return (
      <div>
        <div style={{width: '100%'}}>
          <TextField 
          name="name"
          value={gateway.name}
          style={{width:'100%'}} 
          required 
          id="standard-required" 
          label="이름"
          onChange={handleGateChange}
          />
        </div>
        <div style={{width: '100%'}}>
          <TextField 
          name="location"
          value={gateway.location}
          style={{width:'100%'}} 
          required 
          id="standard-required" 
          label="장소"
          onChange={handleGateChange}
          />
        </div>
        <div style={{width: '100%'}}>
          <TextField 
          name="ip"
          value={gateway.ip}
          style={{width:'100%'}} 
          required 
          id="standard-required" 
          label="IP"
          onChange={handleGateChange}
          />
        </div>
        <div style={{width: '100%'}}>
          <TextField 
          name="port"
          value={gateway.port}
          style={{width:'100%'}} 
          required 
          id="standard-required" 
          label="포트 번호"
          onChange={handleGateChange}
          />
        </div>
        <div style={{width: '100%',textAlign:'center',marginTop:"15px"}}>    
            <Button variant="contained" color="primary" onClick={addGate}>추가</Button>
        </div>
      </div>
    )
  }

  return (
      <div className={classes.root}>
      <Grid
          container
          justify="center"
          alignItems="center"
          spacing={4}
      >
          <Grid
          item
          lg={5}
          md={5}
          xl={5}
          xs={12}
          >
              <Card>
                  <CardContent style={{width: '50%', margin:'0 auto'}}>
                    {/* <div style={{width: '100%',textAlign:'center'}}>
                      <Radio
                        checked={selectedValue === 'gate'}
                        onChange={handleRadioChange}
                        value="gate"
                        name="radio-button-demo"
                        inputProps={{ 'aria-label': 'Gate' }}
                      />게이트웨이
                      <Radio
                        checked={selectedValue === 'device'}
                        onChange={handleRadioChange}
                        value="device"
                        name="radio-button-demo"
                        inputProps={{ 'aria-label': 'Device' }}
                      />단말기
                    </div> */}
                      {selectedValue === 'gate' ? renderGate() : renderDevice()}
                      {/* <Select
                          name="gender"
                          value={userInfo.gender}
                          style={{width:'100%'}} 
                          onChange={handleChange}
                          >
                          <MenuItem value={1}>남자</MenuItem>
                          <MenuItem value={0}>여자</MenuItem>
                      </Select>
                      <div style={{width: '100%'}}>
                          <TextField 
                          name="name"
                          value={userInfo.name}
                          style={{width:'100%'}} 
                          required 
                          id="standard-required" 
                          label="이름"
                          onChange={handleChange}
                          />
                      </div>
                      <div style={{width: '100%',textAlign:'center',marginTop:"15px"}}>
                          <Button variant="contained" color="primary" onClick={addUser}>추가</Button>
                      </div> */}
                  </CardContent>
              </Card>
          </Grid>
      </Grid>
      </div>
  );
};

AddDevice.propTypes = {
    className: PropTypes.string,
    groups : PropTypes.array,
    clickedNode : PropTypes.object,
    setClickedNode : PropTypes.func,
    search : PropTypes.string,
    searchNode : PropTypes.func,
    setUsers : PropTypes.func,
    deleteGroupNode : PropTypes.func,
};

export default AddDevice;