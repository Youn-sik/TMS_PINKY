import React,{ useState,useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import MaskedInput from 'react-text-mask';
import { Grid,Card,CardContent,TextField,Button,Typography } from '@material-ui/core';
import axios from 'axios';
import PropTypes from 'prop-types';
import ImageUploader from "react-images-upload";
import emailMask from 'text-mask-addons/dist/emailMask'
import './image.css'
import InputLabel from '@material-ui/core/InputLabel';
import TreeItem from '@material-ui/lab/TreeItem';
import GroupIcon from '@material-ui/icons/FolderShared';
import PersonIcon from '@material-ui/icons/Person';
import DialogContent from '@material-ui/core/DialogContent';
import TreeView from '@material-ui/lab/TreeView';
import DialogTitle from '@material-ui/core/DialogTitle';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
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

const TextMaskCustom = (props) => {
    const { inputRef, ...other } = props;
    return (
        <MaskedInput
        {...other}
        ref={(ref) => {
            inputRef(ref ? ref.inputElement : null);
        }}
        guide={false}
        mask={[ /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
        placeholderChar={'\u2000'}
        showMask
        />
    ) 
}

const emailMaskCustom = (props) => {
    const { inputRef, ...other } = props;
    return (
        <MaskedInput
        {...other}
        ref={(ref) => {
            inputRef(ref ? ref.inputElement : null);
        }}
        mask={emailMask}
        placeholderChar={'\u2000'}
        showMask
        />
    ) 
}

const EditDevice = (props) => {
    const {deviceObject} = props.location;
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
        let result = await axios.get('http://172.16.135.89:3000/gateway')
        setGate(result.data);
    }

    const handleDeviceChange = (event) => {
        setDevice({
            ...device,
            [event.target.name]: event.target.value,
        });
    };
    
    const addDevice = async () => {
        await axios.post('http://172.16.135.89:3000/camera',{
            ...device,
            account:'admin'
        })
        window.alert('단말기 등록 완료.')
        history.push('/device/list')
    }

    useEffect(() => {
        console.log(deviceObject);
        let device = JSON.parse(JSON.stringify(deviceObject))
        let editedUser = {
            name : device.name,
            location : device.location,
            gateway_obid : device.gateway_obid._id,
            description: device.description,
            serial_number:device.serial_number,
            status : 'N',
            protocol : '1',
        }
        setDevice(editedUser);
        getGate()
    },[])

    const handleChange = (event) => {
        setDevice({
          ...device,
          [event.target.name]: event.target.value,
        });
    };

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
                            <FormControl style={{width: '100%'}}>
                                <InputLabel id="gatewaySelector">게이트웨이</InputLabel>
                                <Select
                                name="gateway_obid"
                                value={device.gateway_obid}
                                labelId="gatewaySelector"
                                style={{width:'100%'}} 
                                onChange={handleDeviceChange}
                                >
                                    {gate.map((i) => (
                                    <MenuItem value={i._id}>{i.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
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
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
        </div>
    );
};

export default EditDevice;
