import React,{useState} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import TextField from '@material-ui/core/TextField';
import Search from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';
import TreeView from '@material-ui/lab/TreeView';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import TreeItem from '@material-ui/lab/TreeItem';
import GroupIcon from '@material-ui/icons/FolderShared';
import PersonIcon from '@material-ui/icons/Person';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import axios from 'axios';
import {
  Card,
  CardActions,
  CardContent,
  Typography,
  Divider,
  Button,
  Checkbox
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {},
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

const AccountProfile = props => {
  const {clickedNode,setSelectedNode,setClickedNode,deleteGroupNode,setUsers, search,searchNode,groups,className, ...rest } = props;
  // const [clickedNode,setClickedNode] = useState([]);
  const [open, setOpen] = useState(false);
  const [groupName, setGroupName] = useState('');
  const classes = useStyles();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const clickAddGroup = async () => {
    let parent = clickedNode
    let result = await axios.post('http://219.255.217.140:3000/group',{
      name : groupName,
      type : 1,
      parent,
    })
    let childrenSize = clickedNode.children.length;
    let userSize = clickedNode.user_obids.length;
    clickedNode.children.splice(childrenSize-userSize,0,result.data)
    setOpen(false);
  }

  const renderTree = (node,depth) => (
      <TreeItem
      nodeId={node._id + "/"+depth}
      onIconClick={() =>{
        if(Array.isArray(node.children)) setUsers(node)
        setClickedNode(node)
      }} 
      onLabelClick={() =>{
        if(Array.isArray(node.children))setUsers(node)
        setClickedNode(node)
      }} 
      className={classes.treeItem} key={node._id} 
      label={
        <div className={classes.labelRoot}>
          {Array.isArray(node.children) ? <GroupIcon color="inherit" className={classes.labelIcon}/> : <PersonIcon color="inherit" className={classes.labelIcon}/>}
          <Typography variant="body2" className={classes.labelText}>
            {node.name}
          </Typography>
        </div>
      }>
        {Array.isArray(node.children) ? node.children.map((child) => renderTree(child,depth+1)) : null}
      </TreeItem>
  ) 

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardActions
        className={classes.action}
      >
        <Typography style={{width: '100%'}} variant="h5" component="h2">
          그룹 목록
        </Typography>
        {
          clickedNode.length !== 0 ?
          <Button
            variant="contained"
            className={classes.uploadButton}
            color="secondary"
            onClick={() => {
              if(Array.isArray(clickedNode.children)) {
                deleteGroupNode(clickedNode)
              } else {
                window.alert("그룹을 선택해 주세요")
              }
            }}
          >
            삭제
          </Button> :
          <Button
            variant="contained"
            className={classes.uploadButton}
            color="secondary"
            disabled
          >
            삭제
          </Button>
          }
        <Button 
        variant="contained" 
        color="primary"
        onClick={handleClickOpen}
        >
          추가
        </Button>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>그룹추가</DialogTitle>
          <Divider></Divider>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="그룹 이름"
              value={groupName}
              onChange={(e) => {setGroupName(e.target.value)}}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              취소
            </Button>
            <Button onClick={clickAddGroup} color="primary" >
              추가
            </Button>
          </DialogActions>
        </Dialog>
      </CardActions>
      <Divider />
      <CardContent>
        <div className={classes.details}>
        <TreeView
          className={classes.tree}
          defaultCollapseIcon={<ArrowDropDownIcon />}
          defaultExpandIcon={<ArrowRightIcon />}
          defaultEndIcon={<div style={{ width: 24 }} />}
          onNodeSelect={(e,v) => {setSelectedNode(v)}}
        >
          {groups.length ? groups.map(group => renderTree(group,0)) : <div></div>}
        </TreeView>
        </div>
      </CardContent>
      <Divider />

    </Card>
  );
};

AccountProfile.propTypes = {
  className: PropTypes.string,
  groups : PropTypes.array,
  clickedNode : PropTypes.object,
  setClickedNode : PropTypes.func,
  search : PropTypes.string,
  searchNode : PropTypes.func,
  setUsers : PropTypes.func,
  deleteGroupNode : PropTypes.func,
  setSelectedNode : PropTypes.func,
};

export default AccountProfile;
