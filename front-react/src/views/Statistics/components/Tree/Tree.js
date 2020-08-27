import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import TreeView from '@material-ui/lab/TreeView';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import TreeItem from '@material-ui/lab/TreeItem';
import GroupIcon from '@material-ui/icons/FolderShared';
import PersonIcon from '@material-ui/icons/Person';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Divider,
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    color: theme.palette.text.secondary,
    '&:hover > $content': {
      backgroundColor: theme.palette.action.hover,
    },
    '&:focus > $content, &$selected > $content': {
      backgroundColor: `var(--tree-view-bg-color, ${theme.palette.grey[400]})`,
      color: 'var(--tree-view-color)',
    },
    '&:focus > $content $label, &:hover > $content $label, &$selected > $content $label': {
      backgroundColor: 'transparent',
    },
  },
  content: {
    color: theme.palette.text.secondary,
    fontWeight: theme.typography.fontWeightMedium,
    "$expanded > &": {
      fontWeight: theme.typography.fontWeightRegular
    }
  },
  expanded: {},
  selected: {},
  label: {
    fontWeight: "inherit",
    color: "inherit"
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
    height: '436px',
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

const Tree = props => {
  const {clickedNode,setSelectedNode,setClickedNode,deleteGroupNode,setUsers, search,searchNode,groups,className, ...rest } = props;
  const classes = useStyles();

  const renderTree = (node,depth) => (
      <TreeItem
      nodeId={node._id + "/"+depth}
      onIconClick={() =>{
        if(!Array.isArray(node.children)) setClickedNode(node)
      }} 
      onLabelClick={() =>{
        if(!Array.isArray(node.children)) setClickedNode(node)
      }} 
      className={classes.treeItem} key={node._id} 
      label={
        <div className={classes.labelRoot}>
          {Array.isArray(node.children) ? <GroupIcon color="inherit" className={classes.labelIcon}/> : <PersonIcon color="inherit" className={classes.labelIcon}/>}
          <Typography color="inherit" variant="body2" className={classes.labelText}>
            {node.name}
          </Typography>
        </div>
      }
      style={{
        '--tree-view-color': '#1a73e8',
        '--tree-view-bg-color': '#e8f0fe',
      }}
      classes={{
        root: classes.root,
        content: classes.content,
        expanded: classes.expanded,
        selected: classes.selected,
        group: classes.group,
        label: classes.label
      }}>
        {Array.isArray(node.children) ? node.children.map((child) => renderTree(child,depth+1)) : null}
      </TreeItem>
  ) 

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardHeader
        title="그룹 목록"
      />
      <Divider />
      <CardContent>
        <div className={classes.details}>
        <TreeView
          className={classes.tree}
          defaultCollapseIcon={<ArrowDropDownIcon />}
          defaultExpandIcon={<ArrowRightIcon />}
          defaultEndIcon={<div style={{ width: 24 }} />}
          style={{overflow:"auto"}}
        >
          {/* {groups.length ? groups.map(group => renderTree(group,0)) : <div></div>} */}
          <TreeItem
          nodeId='사원' 
          label={
            <div className={classes.labelRoot}>
              <GroupIcon color="inherit" className={classes.labelIcon}/>
              <Typography color="inherit" variant="body2" className={classes.labelText}>
                사원
              </Typography>
            </div>
          }
          style={{
            '--tree-view-color': '#1a73e8',
            '--tree-view-bg-color': '#e8f0fe',
          }}
          classes={{
            root: classes.root,
            content: classes.content,
            expanded: classes.expanded,
            selected: classes.selected,
            group: classes.group,
            label: classes.label
          }}
          >
            {groups.length ? groups.map(
              (group) => {
                if(group.type === 1) {
                  return renderTree(group,0)
                } else {
                  return false;
                }
              }) : <div></div>}
          </TreeItem>
          <TreeItem
          nodeId='방문자' 
          label={
            <div className={classes.labelRoot}>
              <GroupIcon color="inherit" className={classes.labelIcon}/>
              <Typography color="inherit" variant="body2" className={classes.labelText}>
                방문자
              </Typography>
            </div>
          }
          style={{
            '--tree-view-color': '#1a73e8',
            '--tree-view-bg-color': '#e8f0fe',
          }}
          classes={{
            root: classes.root,
            content: classes.content,
            expanded: classes.expanded,
            selected: classes.selected,
            group: classes.group,
            label: classes.label
          }}
          >
            {groups.length ? groups.map(
              (group) => {
                if(group.type === 2) {
                  return renderTree(group,0)
                } else {
                  return false;
                }
              }) : <div></div>}
          </TreeItem>
          <TreeItem
          nodeId='블랙리스트' 
          label={
            <div className={classes.labelRoot}>
              <GroupIcon color="inherit" className={classes.labelIcon}/>
              <Typography color="inherit" variant="body2" className={classes.labelText}>
                블랙리스트
              </Typography>
            </div>
          }
          style={{
            '--tree-view-color': '#1a73e8',
            '--tree-view-bg-color': '#e8f0fe',
          }}
          classes={{
            root: classes.root,
            content: classes.content,
            expanded: classes.expanded,
            selected: classes.selected,
            group: classes.group,
            label: classes.label
          }}
          >
            {groups.length ? groups.map(
              (group) => {
                if(group.type === 5) {
                  return renderTree(group,0)
                } else {
                  return false;
                }
              }) : <div></div>}
          </TreeItem>
        </TreeView>
        </div>
      </CardContent>
      <Divider />

    </Card>
  );
};

Tree.propTypes = {
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

export default Tree;
