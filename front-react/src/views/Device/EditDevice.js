import React,{ useState,useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid,Card,CardContent,TextField,Button } from '@material-ui/core';
import axios from 'axios';
import './image.css'
import {base_url} from 'server.json'
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

const EditDevice = (props) => {
    const deviceObject = props.location.state;
    const classes = useStyles();
    const history = props.history;
    const [device, setDevice] = useState({
        name : '',
        location : '',
        gateway_obid : '',
        description: '',
        serial_number:'',
        status : 'N',
        protocol : '1',
    })
    const [gate,setGate] = useState([])

    const getGate = async () => {
        let result = await axios.get(base_url+'/gateway')
        setGate(result.data);
    }

    const handleDeviceChange = (event) => {
        setDevice({
            ...device,
            [event.target.name]: event.target.value,
        });
    };
    
    const addDevice = async () => {
        await axios.post(base_url+'/camera',{
            ...device,
            account : props.user_id,
            authority : props.authority
        })
        window.alert('단말기 등록 완료.')
        history.push('/device/list')
    }

    useEffect(() => {
        let device = JSON.parse(JSON.stringify(deviceObject))
        let editedUser = {
            name : device.name,
            location : device.location,
            description: device.description,
            serial_number:device.serial_number,
            status : 'N',
        }
        setDevice(editedUser);
        getGate()
    },[deviceObject])

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
                        <div>
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
                            id="standard-required" 
                            label="비고"
                            onChange={handleDeviceChange}
                            />
                            </div>
                            <div style={{width: '100%',textAlign:'center',marginTop:"15px"}}>    
                                <Button variant="contained" color="primary" onClick={addDevice}>수정</Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
        </div>
    );
};

export default EditDevice;
