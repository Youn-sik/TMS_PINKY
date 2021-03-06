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
import PropTypes from 'prop-types';
import ImageUploader from 'react-images-upload';
import emailMask from 'text-mask-addons/dist/emailMask';
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
import {mqtt_url,out_mqtt_url} from 'server.json';
import mqtt from 'mqtt';
import moment from 'moment';
import 'moment/locale/ko';
import {DatePicker} from 'rsuite';

let client
let id = '';

let currentUrl = window.location.href
let base_mqtt_url = mqtt_url
let port = "8083"
let isOut = false
// console.log(currentUrl.indexOf("172.16.41.114"))
if(currentUrl.indexOf("172.16.41.114") <= -1) {
  base_mqtt_url = out_mqtt_url
  port = "10892"
  isOut = true
}

Date.prototype.yyyymmdd = function() {
  var yyyy = this.getFullYear().toString();
  var mm = (this.getMonth() + 1).toString();
  var dd = this.getDate().toString();
  var hh = (this.getHours() + 12).toString();
  return (
    yyyy + '-' + (mm[1] ? mm : '0' + mm[0]) + '-' + (dd[1] ? dd : '0' + dd[0])
  );
};

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

const emailMaskCustom = props => {
  const { inputRef, ...other } = props;
  return (
    <MaskedInput
      {...other}
      ref={ref => {
        inputRef(ref ? ref.inputElement : null);
      }}
      mask={emailMask}
      placeholderChar={'\u2000'}
      showMask
    />
  );
};

const EditEmployee = props => {
  const { userObject, selectedNode } = props.location;
  const classes = useStyles();
  const history = props.history;
  const [pictures, setPictures] = useState([]);
  const [open, setOpen] = useState(false);
  const [node, setNode] = useState({});
  id = Math.random().toString(36).substr(2,11)
  const onDrop = picture => {
    setPictures([picture, ...pictures]);
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    client = mqtt.connect('ws://'+base_mqtt_url+':'+port+'/mqtt');

    client.on('connect', () => {
      console.log('isConnected')
      client.subscribe('/user/edit/result/+');
    });

    client.on('message', function(topic, message) {
      if (topic.indexOf('/user/edit/result/'+id) > -1) {
        let result = JSON.parse(message.toString())
        if(result.result) {
          alert('?????? ???????????????.');
          history.push('/users/employee');
        } else {
          alert(result.msg)
        }
      }
    })

    return () => {
      client.end(true)
    };
  },[])

  const [userInfo, setUserInfo] = useState({
    name: '',
    location: '',
    department_id: '',
    position: '',
    mobile: '',
    mail: '',
    gender: 1,
    // device_token: ''
  });

  useEffect(() => {
    if (!userObject) {
      alert('????????? ?????? ?????? ?????????.')
      history.go(-1);
    } else {
      let user = JSON.parse(JSON.stringify(userObject[0]));

      let editedUser = {
        name: user.name,
        location: user.location,
        position: user.position,
        mobile: user.mobile,
        mail: user.mail,
        gender: user.gender,
        entered: user.entered,
        user_id : user.user_id,
        // device_token : user.device_token,
      };

      setUserInfo(editedUser);
    }
  }, [userObject, history]);

  const handleChange = event => {
    setUserInfo({
      ...userInfo,
      [event.target.name]: event.target.value
    });
  };

  const renderTree = node => (
    <TreeItem
      nodeId={node._id}
      onIconClick={() => {
        if (Array.isArray(node.children)) setNode(node);
      }}
      onLabelClick={() => {
        if (Array.isArray(node.children)) setNode(node);
      }}
      className={classes.treeItem}
      key={node._id}
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
    // console.log(node);
    let base64;
    if (pictures.length !== 0) {
      base64 = await toBase64(pictures[0][0]);
      base64 = base64.replace('data:image/jpeg;base64,', '');
      base64 = base64.replace('data:image/png;base64,', '');
    }

    client.publish(
      '/user/edit/' + id,
      JSON.stringify({
        ...userObject[0],
        ...userInfo,
        id,
        type: 1,
        account: props.user_id,
        clicked_groups:
          node._id !== undefined ? [node._id] : userObject[0].groups_obids,
        avatar_file: base64 ? base64 : userObject[0].avatar_file,
        operation_auth: props.authority
      })
    )
  };

  const locale = {
    sunday: '???',
    monday: '???',
    tuesday: '???',
    wednesday: '???',
    thursday: '???',
    friday: '???',
    saturday: '???',
    ok: '??????',
    today: '??????',
    yesterday: '??????',
    hours: '??????',
    minutes: '???',
    seconds: '???',
    last7Days: '????????????'
  }

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
            {pictures.length < 1 ? (
              <div
                style={{
                  width: '25%',
                  margin: '3% auto',
                  padding: '15px',
                  background: '#edf2f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 'inherit',
                  boxShadow: '0 0 8px 2px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #d0dbe4',
                  position: 'relative'
                }}>
                <img
                  style={{ width: '100%', verticalAlign: 'middle' }}
                  src={ userObject ? isOut ? userObject[0].avatar_file_url.replace('172.16.41.114:3000','211.204.122.90:10891') : userObject[0].avatar_file_url : null }></img>
              </div>
            ) : null}
            <CardContent style={{ width: '50%', margin: '0 auto' }}>
              <Select
                name="gender"
                value={userInfo.gender}
                style={{ width: '100%' }}
                onChange={handleChange}>
                <MenuItem value={1}>??????</MenuItem>
                <MenuItem value={0}>??????</MenuItem>
              </Select>
              <br/><br/>
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
              <br/>
              <div style={{ width: '100%' }}>
                <TextField
                  name="user_id"
                  value={userInfo.user_id}
                  style={{ width: '100%' }}
                  required
                  id="standard-required"
                  label="????????????"
                  onChange={handleChange}
                />
              </div>
              <br/>
              <div style={{ width: '100%' }}>
                <TextField
                  name="location"
                  value={userInfo.location}
                  style={{ width: '100%' }}
                  required
                  id="standard-required"
                  label="?????? ??????/???"
                  onChange={handleChange}
                />
              </div>
              <br/>
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
              <br/>
              <div style={{ width: '100%' }}>
                <TextField
                  name="mobile"
                  value={userInfo.mobile}
                  style={{ width: '100%' }}
                  label="????????? ?????????"
                  onChange={handleChange}
                  InputProps={{
                    inputComponent: TextMaskCustom
                  }}
                />
              </div>
              {/* <br/>
              <div style={{ width: '100%' }}>
                <TextField
                  name="device_token"
                  value={userInfo.device_token}
                  style={{ width: '100%' }}
                  label="?????? ?????? ???"
                  onChange={handleChange}
                />
              </div> */}
              {/* <div style={{ width: '100%' }}>
                <TextField
                  name="mail"
                  value={userInfo.mail}
                  style={{ width: '100%' }}
                  label="?????????"
                  onChange={handleChange}
                  InputProps={{
                    inputComponent: emailMaskCustom
                  }}
                />
              </div> */}<br/>
              <div style={{ width: '100%' }}>
                <p style={{ marginTop:'15px' }}>?????????</p>
                <DatePicker
                  style={{ width: '100%', marginTop:'4px' }}
                  onChange={val => {
                    setUserInfo({
                      ...userInfo,
                      'entered' : val.yyyymmdd()
                    });
                  }}
                  cleanable={false}
                  locale={locale}
                  value={new Date(userInfo.entered)}
                  defaultValue={new Date(`${moment().format('YYYY-MM-DD')}`)}
                ></DatePicker>
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
                <Button variant="contained" color="primary" onClick={addUser}>
                  ??????
                </Button>
              </div>
              <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">?????? ??????</DialogTitle>
                <DialogContent>
                  {userObject ? (
                    <TreeView
                      defaultExpanded={selectedNode}
                      defaultSelected={userObject ? userObject[0].groups_obids : null}
                      className={classes.tree}
                      defaultCollapseIcon={<ArrowDropDownIcon />}
                      defaultExpandIcon={<ArrowRightIcon />}
                      defaultEndIcon={<div style={{ width: 24 }} />}>
                      {props.location.groups.length ? (
                        props.location.groups.map(group => renderTree(group))
                      ) : (
                        <div></div>
                      )}
                    </TreeView>
                  ) : null}
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

EditEmployee.propTypes = {
  className: PropTypes.string,
  groups: PropTypes.array,
  clickedNode: PropTypes.object,
  setClickedNode: PropTypes.func,
  search: PropTypes.string,
  searchNode: PropTypes.func,
  setUsers: PropTypes.func,
  deleteGroupNode: PropTypes.func,
  userObject: PropTypes.object,
  selectedNode: PropTypes.array
};

export default EditEmployee;
