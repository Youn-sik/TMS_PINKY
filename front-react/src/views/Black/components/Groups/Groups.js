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
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
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
console.log(currentUrl.indexOf("172.16.41.114"))
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
    editGroupNode,
    groups,
    className,
    ...rest
  } = props;
  // const [clickedNode,setClickedNode] = useState([]);
  const [open, setOpen] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [editOpen,setEditOpen] = useState(false)
  const [topGroupCheck,setTopGroupCheck] = useState(false);
  const classes = useStyles();

  const handleCheck = () => {
    setTopGroupCheck(!topGroupCheck)
  }

  const handleClickOpen = (type) => {
    if(type === 'edit') {
      setEditOpen(true);
      setGroupName(clickedNode.name)
    } else {
      if (clickedNode.rootParent !== undefined) {
        window.alert('3차 그룹까지만 생성 가능합니다.');
      } else {
        setOpen(true);
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
    setEditOpen(false);
    setTopGroupCheck(false);
  };

  const clickAddGroup = async () => {
    setGroupName('');
    let parent =
      Object.keys(clickedNode).length === 0 || topGroupCheck ? undefined : clickedNode;

    if(groupName === '') {
      alert('이름을 입력해주세요.')
      return 0;
    } else if(topGroupCheck && groups.findIndex(i => i.name === groupName) > -1){
      alert('중복된 이름 입니다.')
      return 0;
    } else if(!clickedNode.children && groups.findIndex(i => i.name === groupName) > -1) {
      alert('중복된 이름 입니다.')
      return 0;
    } else if(clickedNode.children && clickedNode.children.findIndex(i => i.name === groupName) > -1) {
      alert('중복된 이름 입니다.')
      return 0;
    }

    let result = await axios.post(base_url + '/group', {
      name: groupName,
      type: 5,
      authority : props.authority,
      parent,
      account: props.user_id
    });
    if (!topGroupCheck && Object.keys(clickedNode).length !== 0) {
      let childrenSize = clickedNode.children.length;
      let userSize = clickedNode.user_obids.length;
      clickedNode.children.splice(childrenSize - userSize, 0, result.data);
    } else {
      groups.splice(groups.length, 0, result.data);
    }
    setGroupName('');
    setOpen(false);
    setTopGroupCheck(false);
  };

  const renderTree = (node, depth) => (
    <TreeItem
      nodeId={node._id + '/' + depth}
      onIconClick={() => {
        setClickedNode(node);
      }}
      onLabelClick={() => {
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
          그룹 목록
        </Typography>
        {clickedNode.name !== undefined ? (
          <Button
            variant="contained"
            className={classes.uploadButton}
            color="secondary"
            onClick={() => {
              if (Array.isArray(clickedNode.children)) {
                deleteGroupNode(clickedNode);
              } else {
                window.alert('그룹을 선택해 주세요');
              }
            }}>
            삭제
          </Button>
        ) : (
          <Button
            variant="contained"
            className={classes.uploadButton}
            color="secondary"
            disabled>
            삭제
          </Button>
        )}
        {clickedNode.name !== undefined && clickedNode.name !== 'undefined' ? (
          <Button
            variant="contained"
            className={classes.uploadButton}
            color="primary"
            onClick={() => {
              if (Array.isArray(clickedNode.children)) {
                handleClickOpen('edit')
                // editGroupNode(clickedNode);
                // setClickedNode({});
              } else {
                window.alert('그룹을 선택해 주세요');
              }
            }}>
            수정
          </Button>
        ) : (
          <Button
            variant="contained"
            className={classes.uploadButton}
            color="primary"
            disabled>
            수정
          </Button>
        )}
        <Button variant="contained" color="primary" onClick={handleClickOpen}>
          추가
        </Button>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>그룹 추가</DialogTitle>
          <Divider></Divider>
          <DialogContent>
            <FormControlLabel
              control={
                <Checkbox
                  checked={topGroupCheck}
                  onChange={handleCheck}
                  name="checkedB"
                  color="primary"
                />
              }
              label="최상위 그룹으로 추가"
            />
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="그룹 이름"
              value={groupName}
              onChange={e => {
                setGroupName(e.target.value);
              }}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              취소
            </Button>
            <Button onClick={clickAddGroup} color="primary">
              추가
            </Button>
          </DialogActions>
        </Dialog>


        <Dialog open={editOpen} onClose={handleClose}>
          <DialogTitle>그룹 수정</DialogTitle>
          <Divider></Divider>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="그룹 이름"
              value={groupName}
              onChange={e => {
                setGroupName(e.target.value);
              }}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              취소
            </Button>
            <Button onClick={() => {editGroupNode(clickedNode,groupName); setEditOpen(false);}} color="primary">
              수정
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
