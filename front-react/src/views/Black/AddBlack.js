import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import MaskedInput from 'react-text-mask';
import {
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Typography
} from '@material-ui/core';
import axios from 'axios';
import PropTypes from 'prop-types';
import ImageUploader from 'react-images-upload';
import './image.css';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
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
import {base_url as in_base_url,out_base_url,mqtt_url,out_mqtt_url} from 'server.json';
import mqtt from 'mqtt';
import moment from 'moment';
import 'moment/locale/ko';

let currentUrl = window.location.href
let base_url = in_base_url
let base_mqtt_url = mqtt_url
let port = "8083"
// console.log(currentUrl.indexOf("172.16.41.114"))
if(currentUrl.indexOf("172.16.41.114") <= -1) {
  base_url = out_base_url
  base_mqtt_url = out_mqtt_url
  port = "10892"
}

let client
let id = '';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  },
  treeItemStyle: {
    color: theme.palette.text.secondary,
    '&:hover > $content': {
      backgroundColor: theme.palette.action.hover
    },
    '&:focus > $content, &$selected > $content': {
      backgroundColor: `var(--tree-view-bg-color, ${theme.palette.grey[400]})`,
      color: 'var(--tree-view-color)'
    },
    '&:focus > $content $label, &:hover > $content $label, &$selected > $content $label': {
      backgroundColor: 'transparent'
    }
  },
  content: {
    color: theme.palette.text.secondary,
    fontWeight: theme.typography.fontWeightMedium,
    '$expanded > &': {
      fontWeight: theme.typography.fontWeightRegular
    }
  },
  expanded: {},
  selected: {},
  label: {
    fontWeight: 'inherit',
    color: 'inherit'
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
    width: '100%'
  },
  action: {
    padding: '10px 20px'
  },
  tree: {
    // height: 240,
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

const TextMaskCustom = props => {
  const { inputRef, ...other } = props;
  return (
    <MaskedInput
      {...other}
      ref={ref => {
        inputRef(ref ? ref.inputElement : null);
      }}
      guide={false}
      mask={[
        /\d/,
        /\d/,
        /\d/,
        '-',
        /\d/,
        /\d/,
        /\d/,
        /\d/,
        '-',
        /\d/,
        /\d/,
        /\d/,
        /\d/
      ]}
      placeholderChar={'\u2000'}
      showMask
    />
  );
};

const AddBlack = props => {
  // const { groups } = props.location;
  const classes = useStyles();
  const history = props.history;
  const [pictures, setPictures] = useState([]);
  const [open, setOpen] = useState(false);
  const [node, setNode] = useState({});
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState([])
  id = Math.random().toString(36).substr(2,11)
  const onDrop = picture => {
    setPictures([picture, ...pictures]);
  };

  useEffect(() => {
    client = mqtt.connect('ws://'+base_mqtt_url+':'+port+'/mqtt');

    client.on('connect', () => {
      console.log('isConnected')
      client.subscribe('/user/add/result/+');
    });

    client.on('message', function(topic, message) {
      if (topic.indexOf('/user/add/result/'+id) > -1) {
        let result = JSON.parse(message.toString())
        setLoading(false);
        if(result.result) {
          alert('?????? ???????????????.');
          history.push('/users/black');
        } else {
          alert(result.msg)
        }
      }
    })

    return () => {
      client.end(true)
    };
  },[])

  const handleClickOpen = () => {
    setOpen(true);
  };

  const getGroups = async () => {
    let result = await axios.get(base_url+'/group?type=5&auth='+props.authority)
    if(result && result.data.length > 0){
      setGroups(result.data);
    }
  }

  useEffect(() => {
    getGroups();
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  const [userInfo, setUserInfo] = useState({
    name: '',
    location: '',
    department_id: '',
    position: '',
    mobile: '',
    mail: '',
    gender: 1,
    entered : '',
    create_at : moment().format('YYYY-MM-DD HH:MM:SS'),
  });

  const handleChange = event => {
    setUserInfo({
      ...userInfo,
      [event.target.name]: event.target.value
    });
  };

  const renderTree = node => (
    <TreeItem
      onIconClick={() => {
        //   if(Array.isArray(node.children)) setUsers(node.user_obids)
        setNode(node);
      }}
      onLabelClick={() => {
        //   if(Array.isArray(node.children))setUsers(node.user_obids)
        setNode(node);
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
          <Typography variant="body2" className={classes.labelText}>
          {node.name} ({node.authority === 'admin' ? node.authority :
            node.authority.split('-').length === 2 ? node.authority.split('-')[1].substring(0,node.authority.split('-')[1].length - 1) :
            node.authority.split('-').length === 3 ? node.authority.split('-')[2] : node.authority.split('-')[3]})
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

  const toBase64 = file =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });

    const addUser = async () => {
      if (pictures.length === 0) alert('????????? ??????????????????');
      else if (userInfo.name === '') alert('????????? ??????????????????');
      else if (userInfo.location === '') alert('???????????? ??????????????????');
      else if (userInfo.position === '') alert('????????? ??????????????????');
      else if(node._id) {
        setLoading(true);
        let base64 = await toBase64(pictures[0][0]);
        base64 = base64.replace('data:image/jpeg;base64,', '');
        base64 = base64.replace('data:image/png;base64,', '');

        client.publish(
          '/user/add/' + id,
          JSON.stringify({
            ...userInfo,
            groups_obids: [node._id ? node._id : undefined],
            account: props.user_id,
            type: 5,
            authority : props.authority,
            avatar_file: base64,
            operation_auth: props.authority,
            id
          })
        )

        // let result = await axios.post(base_url + '/user', {
        //   ...userInfo,
        //   type: 1,
        //   groups_obids: [node._id ? node._id : undefined],
        //   account: props.user_id,
        //   authority : props.authority,
        //   avatar_file: base64,
        //   operation_auth: props.authority
        // });

        // if(result.data.result && result.data.result === '???????????? ?????? ??????.') {
        //   alert("???????????? ?????? ?????? ?????????.")
        //   setLoading(false);
        //   return 0;
        // }

        // setLoading(false);
        // alert('?????? ???????????????.');
        // history.push('/users/employee');
      } else {
        alert('????????? ??????????????????.')
      }
    };

  return (
    <div className={classes.root}>
      <Grid container justify="center" alignItems="center" spacing={4}>
        <Grid item lg={5} md={5} xl={5} xs={12}>
          <Card>
            <ImageUploader
              {...props}
              withIcon={true}
              onChange={onDrop}
              imgExtension={['.jpg', '.png']}
              label="?????? ?????? : 5mb, ?????? ?????????: jpg|png"
              fileSizeError="????????? ????????? ?????? ?????????."
              fileTypeError="???????????? ?????? ????????? ?????? ?????????."
              buttonText="????????? ?????? ?????????"
              maxFileSize={5242880}
              singleImage={true}
              withPreview={true}
            />
            <CardContent style={{ width: '50%', margin: '0 auto' }}>
              <Select
                name="gender"
                value={userInfo.gender}
                style={{ width: '100%' }}
                onChange={handleChange}>
                <MenuItem value={1}>??????</MenuItem>
                <MenuItem value={0}>??????</MenuItem>
              </Select>
              <div style={{ width: '100%' }}>
                <TextField
                  name="name"
                  value={userInfo.name}
                  style={{ width: '100%' }}
                  required
                  id="standard-required"
                  label="??????"
                  onChange={handleChange}
                />
              </div>
              <div style={{ width: '100%' }}>
                <TextField
                  name="location"
                  value={userInfo.location}
                  style={{ width: '100%' }}
                  required
                  id="standard-required"
                  label="?????? ??????/???"
                  placeholder="ex)??????????????????/?????????"
                  onChange={handleChange}
                />
              </div>
              <div style={{ width: '100%' }}>
                <TextField
                  name="position"
                  value={userInfo.position}
                  style={{ width: '100%' }}
                  required
                  id="standard-required"
                  onChange={handleChange}
                  label="??????/???"
                />
              </div>
              <div style={{ width: '100%' }}>
                <TextField
                  name="mobile"
                  value={userInfo.mobile}
                  style={{ width: '100%' }}
                  label="????????? ??????"
                  onChange={handleChange}
                  InputProps={{
                    inputComponent: TextMaskCustom
                  }}
                />
              </div>
              <div
                style={{
                  width: '100%',
                  textAlign: 'center',
                  marginTop: '15px'
                }}>
                <Button
                  style={{ marginRight: '4px' }}
                  variant="contained"
                  color="secondary"
                  onClick={handleClickOpen}>
                  ?????? ??????
                </Button>
                {
                  !loading ?
                  <Button variant="contained" color="primary" onClick={addUser}>
                    ??????
                  </Button>
                  :
                  <Button variant="contained" color="primary" >
                    ?????????...
                  </Button>
                }
              </div>
              <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">?????? ??????</DialogTitle>
                <DialogContent>
                  <TreeView
                    className={classes.tree}
                    defaultCollapseIcon={<ArrowDropDownIcon />}
                    defaultExpandIcon={<ArrowRightIcon />}
                    defaultEndIcon={<div style={{ width: 24 }} />}>
                    {groups ? (
                      groups.map(group => renderTree(group))
                    ) : (
                      <div></div>
                    )}
                  </TreeView>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose} color="primary">
                    ??????
                  </Button>
                </DialogActions>
              </Dialog>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

AddBlack.propTypes = {
  className: PropTypes.string,
  groups: PropTypes.array,
  clickedNode: PropTypes.object,
  setClickedNode: PropTypes.func,
  search: PropTypes.string,
  searchNode: PropTypes.func,
  setUsers: PropTypes.func,
  deleteGroupNode: PropTypes.func
};

export default AddBlack;
