import React,{ useState,useEffect,useCallback } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import axios from 'axios';
import { Stream, DeviceTable } from './components';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  }
}));

const Employee = (props) => {
  const [search,setSearch] = useState('');
  const [device,setDevice] = useState([]);
  const [filteredDevice,setFilteredDevice] = useState([]);
  const [clickedNode,setClickedNode] = useState({});
  const [stream,setStream] = useState("");
  const [streamId,setStreamId] = useState("");
  const [loading,setLoading] = useState(true);
  const classes = useStyles();

  const filterDevice = useCallback((device) => {
    let temp = []
    device.map((device) => {
      if(device.name.indexOf(search) > -1) {
        temp.push(device)
      }
      return false;
    })
    return temp
  },[search])

  useEffect(() => {
    if(search !== '') {
      let copyUsers = device;
      let tempFilteredDevice = filterDevice(copyUsers);
      setFilteredDevice(tempFilteredDevice);
    }
  },[search,device,filterDevice])

  useEffect(() => {
    getDevcie()
  },[]);

  const _setClickedNode = (node) => {
    setClickedNode(node);
  }

  const _setDevice = (node,length) => {
    let groupLength = 0
    let children = JSON.parse(JSON.stringify(node.children))
    for(let i = 0; i<children.length; i++) {
      if(Array.isArray(children[i].children)) {
        groupLength++;
      } else {
        break;
      }
    }
    setDevice(children.splice(groupLength))
  }

  const _setStreamId = (id) => {
    setStreamId(id)
  }

  const _setStream = (ip) => {
    setStream(ip);
  }

  const getDevcie = async () => {
    let result = await axios.get('http://172.16.135.89:3000/camera')
    setStream(result.data[0].ip);
    setDevice(result.data);
    setLoading(false)
  }

  const deleteDevice = async (selectedDevice) => {
    if(window.confirm('정말 삭제 하시겠습니까?')) {
      await axios.delete('http://172.16.135.89:3000/camera/'+selectedDevice._id,{
        data:{
          account : 'admin' // to do :나중에 계정 정보 넣을것
        }
      })
  
      let temp = device.filter(i => i._id !== selectedDevice._id)
      await setDevice(temp);
    }
  }

  const videoJsOptions = {
    autoplay: true,
    controls: true,
    sources: [
      {
        src: streamId === '' ? './sample.m3u8' :'http://172.16.135.89:4000/stream/'+streamId+'/'+streamId+'.m3u8',
      },
    ],
  };


  return (
    <div className={classes.root}>
      <Grid
        container
        spacing={4}
      >
        <Grid
          item
          lg={12}
          md={12}
          xl={12}
          xs={12}
        >
          {/* <AccountDetails users={users}/> */}
          <Stream setStreamId={_setStreamId} stream={stream} {...videoJsOptions}/>
        </Grid>
        <Grid
          item
          lg={12}
          md={12}
          xl={12}
          xs={12}
        >
          {/* <AccountDetails users={users}/> */}
          <DeviceTable
          stream={stream}
          history={props.history}
          setStream={_setStream}
          setClickedNode={_setClickedNode} 
          clickedNode={clickedNode} 
          setDevice={_setDevice}
          deleteDevice={deleteDevice} 
          device={search === '' ?  device : filteredDevice } 
          search={search}
          setSearch={setSearch}
          loading={loading}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default Employee;
