import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import TextField from '@material-ui/core/TextField';
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
  Button
} from '@material-ui/core';
import {base_url as in_base_url,out_base_url} from 'server.json';

let currentUrl = window.location.href
let base_url = in_base_url
// console.log(currentUrl.indexOf("172.16.41.114"))
if(currentUrl.indexOf("172.16.41.114") <= -1) {
  base_url = out_base_url
}

const useStyles = makeStyles(theme => ({
  root: {
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

const Groups = props => {
  const {
    clickedNode,
    setSelectedNode,
    setClickedNode,
    deleteGroupNode,
    setUsers,
    search,
    searchNode,
    groups,
    className,
    ...rest
  } = props;
  // const [clickedNode,setClickedNode] = useState([]);
  const [open, setOpen] = useState(false);
  const [groupName, setGroupName] = useState('');
  const classes = useStyles();

  const handleClickOpen = () => {
    if (clickedNode.rootParent !== undefined) {
      window.alert('3??? ??????????????? ?????? ???????????????.');
    } else {
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const clickAddGroup = async () => {
    let parent =
      Object.keys(clickedNode).length === 0 ? undefined : clickedNode;
    let result = await axios.post(base_url + '/group', {
      name: groupName,
      type: 2,
      authority : props.authority,
      parent,
      account: props.user_id
    });
    if (Object.keys(clickedNode).length !== 0) {
      let childrenSize = clickedNode.children.length;
      let userSize = clickedNode.user_obids.length;
      clickedNode.children.splice(childrenSize - userSize, 0, result.data);
    } else {
      groups.splice(groups.length - 1, 0, result.data);
    }
    setGroupName('');
    setOpen(false);
  };

  const renderTree = (node, depth) => (
    <TreeItem
      nodeId={node._id + '/' + depth}
      onIconClick={() => {
        if (Array.isArray(node.children)) setUsers(node);
        setClickedNode(node);
      }}
      onLabelClick={() => {
        if (Array.isArray(node.children)) setUsers(node);
        setClickedNode(node);
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
          <Typography
            color="inherit"
            variant="body2"
            className={classes.labelText}>
            {node.name === 'undefined' ? '?????????' : node.name}
          </Typography>
        </div>
      }
      style={{
        '--tree-view-color': '#1a73e8',
        '--tree-view-bg-color': '#e8f0fe'
      }}
      classes={{
        root: classes.root,
        content: classes.content,
        expanded: classes.expanded,
        selected: classes.selected,
        group: classes.group,
        label: classes.label
      }}>
      {Array.isArray(node.children)
        ? node.children.map(child => renderTree(child, depth + 1))
        : null}
    </TreeItem>
  );

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <CardActions className={classes.action}>
        <Typography style={{ width: '100%' }} variant="h5" component="h2">
          ?????? ??????
        </Typography>
        {clickedNode.name !== undefined && clickedNode.name !== 'undefined' ? (
          <Button
            variant="contained"
            className={classes.uploadButton}
            color="secondary"
            onClick={() => {
              if (Array.isArray(clickedNode.children)) {
                deleteGroupNode(clickedNode);
              } else {
                window.alert('????????? ????????? ?????????');
              }
            }}>
            ??????
          </Button>
        ) : (
          <Button
            variant="contained"
            className={classes.uploadButton}
            color="secondary"
            disabled>
            ??????
          </Button>
        )}
        <Button variant="contained" color="primary" onClick={handleClickOpen}>
          ??????
        </Button>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>????????????</DialogTitle>
          <Divider></Divider>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="?????? ??????"
              value={groupName}
              onChange={e => {
                setGroupName(e.target.value);
              }}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              ??????
            </Button>
            <Button onClick={clickAddGroup} color="primary">
              ??????
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
            onNodeSelect={(e, v) => {
              setSelectedNode(v);
            }}>
            {groups.length ? (
              groups.map(group => renderTree(group, 0))
            ) : (
              <div></div>
            )}
          </TreeView>
        </div>
      </CardContent>
      <Divider />
    </Card>
  );
};

Groups.propTypes = {
  className: PropTypes.string,
  groups: PropTypes.array,
  clickedNode: PropTypes.object,
  setClickedNode: PropTypes.func,
  search: PropTypes.string,
  searchNode: PropTypes.func,
  setUsers: PropTypes.func,
  deleteGroupNode: PropTypes.func,
  setSelectedNode: PropTypes.func
};

export default Groups;
