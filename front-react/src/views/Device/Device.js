import React, { useState, useEffect, useCallback } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import axios from 'axios';
import { Stream, DeviceTable } from './components';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  }
}));

const Employee = props => {
  const base_url = 'http://' + window.location.href.split('/')[2] + ':3000';
  const [search, setSearch] = useState('');
  const [device, setDevice] = useState([]);
  const [filteredDevice, setFilteredDevice] = useState([]);
  const [clickedNode, setClickedNode] = useState({});
  const [stream, setStream] = useState('');
  const [streamId, setStreamId] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState('create_at');
  const classes = useStyles();

  const filterDevice = useCallback(
    device => {
      let temp = [];
      device.map(device => {
        if (device.name.indexOf(search) > -1) {
          temp.push(device);
        }
        return false;
      });
      return temp;
    },
    [search]
  );

  useEffect(() => {
    if (search !== '') {
      let copyUsers = device;
      let tempFilteredDevice = filterDevice(copyUsers);
      setFilteredDevice(tempFilteredDevice);
    }
  }, [search, device, filterDevice]);

  useEffect(() => {
    getDevcie();
  }, []);

  const _setClickedNode = node => {
    setClickedNode(node);
  };

  const sortAccesses = (type, headerType) => {
    setActiveType(headerType);
    if (search === '') {
      if (headerType === 'name') {
        if (type === 'asc') {
          setDevice(
            device.sort((a, b) => {
              if (a.name < b.name) return -1;
              else if (b.name < a.name) return 1;
              else return 0;
            })
          );
        } else {
          setDevice(
            device.sort((a, b) => {
              if (a.name > b.name) return -1;
              else if (b.name > a.name) return 1;
              else return 0;
            })
          );
        }
      } else if (headerType === 'stb_sn') {
        if (type === 'asc') {
          setDevice(
            device.sort((a, b) => {
              if (a.serial_number < b.serial_number) return -1;
              else if (b.serial_number < a.serial_number) return 1;
              else return 0;
            })
          );
        } else {
          setDevice(
            device.sort((a, b) => {
              if (a.serial_number > b.serial_number) return -1;
              else if (b.serial_number > a.serial_number) return 1;
              else return 0;
            })
          );
        }
      } else if (headerType === 'app_version') {
        if (type === 'asc') {
          setDevice(
            device.sort((a, b) => {
              if (a.app_version < b.app_version) return -1;
              else if (b.app_version < a.app_version) return 1;
              else return 0;
            })
          );
        } else {
          setDevice(
            device.sort((a, b) => {
              if (a.app_version > b.app_version) return -1;
              else if (b.app_version > a.app_version) return 1;
              else return 0;
            })
          );
        }
      } else if (headerType === 'ip') {
        if (type === 'asc') {
          setDevice(
            device.sort((a, b) => {
              if (a.ip < b.ip) return -1;
              else if (b.ip < a.ip) return 1;
              else return 0;
            })
          );
        } else {
          setDevice(
            device.sort((a, b) => {
              if (a.ip > b.ip) return -1;
              else if (b.ip > a.ip) return 1;
              else return 0;
            })
          );
        }
      } else if (headerType === 'location') {
        if (type === 'asc') {
          setDevice(
            device.sort((a, b) => {
              if (a.location < b.location) return -1;
              else if (b.location < a.location) return 1;
              else return 0;
            })
          );
        } else {
          setDevice(
            device.sort((a, b) => {
              if (a.location > b.location) return -1;
              else if (b.location > a.location) return 1;
              else return 0;
            })
          );
        }
      } else if (headerType === 'status') {
        if (type === 'asc') {
          setDevice(
            device.sort((a, b) => {
              if (a.status < b.status) return -1;
              else if (b.status < a.status) return 1;
              else return 0;
            })
          );
        } else {
          setDevice(
            device.sort((a, b) => {
              if (a.status > b.status) return -1;
              else if (b.status > a.status) return 1;
              else return 0;
            })
          );
        }
      }
    } else {
      if (headerType === 'name') {
        if (type === 'asc') {
          setFilteredDevice(
            filteredDevice.sort((a, b) => {
              if (a.name < b.name) return -1;
              else if (b.name < a.name) return 1;
              else return 0;
            })
          );
        } else {
          setFilteredDevice(
            filteredDevice.sort((a, b) => {
              if (a.name > b.name) return -1;
              else if (b.name > a.name) return 1;
              else return 0;
            })
          );
        }
      } else if (headerType === 'stb_sn') {
        if (type === 'asc') {
          setFilteredDevice(
            filteredDevice.sort((a, b) => {
              if (a.serial_number < b.serial_number) return -1;
              else if (b.serial_number < a.serial_number) return 1;
              else return 0;
            })
          );
        } else {
          setFilteredDevice(
            filteredDevice.sort((a, b) => {
              if (a.serial_number > b.serial_number) return -1;
              else if (b.serial_number > a.serial_number) return 1;
              else return 0;
            })
          );
        }
      } else if (headerType === 'app_version') {
        if (type === 'asc') {
          setFilteredDevice(
            filteredDevice.sort((a, b) => {
              if (a.app_version < b.app_version) return -1;
              else if (b.app_version < a.app_version) return 1;
              else return 0;
            })
          );
        } else {
          setFilteredDevice(
            filteredDevice.sort((a, b) => {
              if (a.app_version > b.app_version) return -1;
              else if (b.app_version > a.app_version) return 1;
              else return 0;
            })
          );
        }
      } else if (headerType === 'ip') {
        if (type === 'asc') {
          setFilteredDevice(
            filteredDevice.sort((a, b) => {
              if (a.ip < b.ip) return -1;
              else if (b.ip < a.ip) return 1;
              else return 0;
            })
          );
        } else {
          setFilteredDevice(
            filteredDevice.sort((a, b) => {
              if (a.ip > b.ip) return -1;
              else if (b.ip > a.ip) return 1;
              else return 0;
            })
          );
        }
      } else if (headerType === 'location') {
        if (type === 'asc') {
          setFilteredDevice(
            filteredDevice.sort((a, b) => {
              if (a.location < b.location) return -1;
              else if (b.location < a.location) return 1;
              else return 0;
            })
          );
        } else {
          setFilteredDevice(
            filteredDevice.sort((a, b) => {
              if (a.location > b.location) return -1;
              else if (b.location > a.location) return 1;
              else return 0;
            })
          );
        }
      } else if (headerType === 'status') {
        if (type === 'asc') {
          setFilteredDevice(
            filteredDevice.sort((a, b) => {
              if (a.status < b.status) return -1;
              else if (b.status < a.status) return 1;
              else return 0;
            })
          );
        } else {
          setFilteredDevice(
            filteredDevice.sort((a, b) => {
              if (a.status > b.status) return -1;
              else if (b.status > a.status) return 1;
              else return 0;
            })
          );
        }
      }
    }
  };

  const _setDevice = (node, length) => {
    let groupLength = 0;
    let children = JSON.parse(JSON.stringify(node.children));
    for (let i = 0; i < children.length; i++) {
      if (Array.isArray(children[i].children)) {
        groupLength++;
      } else {
        break;
      }
    }
    setDevice(children.splice(groupLength));
  };

  const _setStreamId = id => {
    setStreamId(id);
  };

  const _setStream = ip => {
    setStream(ip);
  };

  const getDevcie = async () => {
    let result = await axios.get(
      base_url + '/camera?authority=' + props.authority
    );
    if (result.data.length > 0) {
      setStream(result.data[0].ip);
      setDevice(result.data);
    }
    setLoading(false);
    setSearch('');
  };

  const deleteDevice = async selectedDevice => {
    if (window.confirm('정말 삭제 하시겠습니까?')) {
      if (selectedDevice.length === 1) {
        await axios.delete(base_url + '/camera/' + selectedDevice[0]._id, {
          data: {
            account: props.user_id
          }
        });
        let temp = device.filter(i => i._id !== selectedDevice[0]._id);
        setDevice(temp);
      } else {
        await axios.delete(base_url + '/camera/' + selectedDevice[0]._id, {
          data: {
            account: props.user_id,
            devices: selectedDevice,
            list: selectedDevice.map(i => i._id)
          }
        });
        let temp = [];
        temp = device.filter(val => !selectedDevice.includes(val));
        setDevice(temp);
      }
    }
  };

  const videoJsOptions = {
    autoplay: true,
    controls: true,
    sources: [
      {
        src:
          streamId === ''
            ? './sample.m3u8'
            : 'http://172.16.135.89:4000/stream/' +
              streamId +
              '/' +
              streamId +
              '.m3u8'
      }
    ]
  };

  return (
    <div className={classes.root}>
      <Grid container spacing={4}>
        {/* <Grid
          item
          lg={12}
          md={12}
          xl={12}
          xs={12}
        >
          <Stream setStreamId={_setStreamId} stream={stream} {...videoJsOptions}/>
        </Grid> */}
        <Grid item lg={12} md={12} xl={12} xs={12}>
          {/* <AccountDetails users={users}/> */}
          <DeviceTable
            activeType={activeType}
            sortAccesses={sortAccesses}
            stream={stream}
            history={props.history}
            setStream={_setStream}
            setClickedNode={_setClickedNode}
            clickedNode={clickedNode}
            setDevice={_setDevice}
            deleteDevice={deleteDevice}
            device={search === '' ? device : filteredDevice}
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
