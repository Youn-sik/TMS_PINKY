import React,{ useState,useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import MaskedInput from 'react-text-mask';
import { Grid,Card,CardContent,TextField,Button,Typography } from '@material-ui/core';
import axios from 'axios';
import PropTypes from 'prop-types';
import ImageUploader from "react-images-upload";
import emailMask from 'text-mask-addons/dist/emailMask'
import './image.css'
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
const useStyles = makeStyles(theme => ({
  root:{
    padding:theme.spacing(4)
  },
  treeItemStyle: {
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

const EditEmployee = (props) => {
    const {userObject,selectedNode} = props.location;
    const classes = useStyles();
    const history = props.history;
    const [pictures, setPictures] = useState([]);
    const [open, setOpen] = useState(false);
    const [node,setNode] = useState({});
    const onDrop = picture => {
        setPictures([picture,...pictures]);
    };
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const [userInfo, setUserInfo] = useState({
        name : '',
        location : '',
        department_id : '',
        position : '',
        mobile: '',
        mail : '',
        gender : 1
    })

    useEffect(() => {
      if(!userObject) {
        history.go(-1);
      } else {
        let user = JSON.parse(JSON.stringify(userObject[0]))
        let editedUser = {
            name : user.name,
            location : user.location,
            department_id : user.department_id,
            position : user.position,
            mobile: user.mobile,
            mail : user.mail,
            gender : user.gender,
        }
        setUserInfo(editedUser);
      }
    },[userObject,history])

    const handleChange = (event) => {
        setUserInfo({
          ...userInfo,
          [event.target.name]: event.target.value,
        });
    };

    const renderTree = (node) => (
        <TreeItem 
        nodeId={node._id}
        onIconClick={() =>{
          if(Array.isArray(node.children)) setNode(node)
        }} 
        onLabelClick={() =>{
          if(Array.isArray(node.children)) setNode(node)
        }} 
        className={classes.treeItem} key={node._id} 
        label={
          <div className={classes.labelRoot}>
            {Array.isArray(node.children) ? <GroupIcon color="inherit" className={classes.labelIcon}/> : <PersonIcon color="inherit" className={classes.labelIcon}/>}
            <Typography variant="body2" className={classes.labelText}>
              {node.name === 'undefined' ? "미분류" : node.name}
            </Typography>
          </div>
        }
        style={{
            '--tree-view-color': '#1a73e8',
            '--tree-view-bg-color': '#e8f0fe',
          }}
          classes={{
            root: classes.treeItemStyle,
            content: classes.content,
            expanded: classes.expanded,
            selected: classes.selected,
            group: classes.group,
            label: classes.label
          }}
        >
          {Array.isArray(node.children) ? node.children.map((child) => renderTree(child)) : null}
        </TreeItem>
    )

    const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

    const addUser = async () => {
        // console.log(node);
        let base64
        if(pictures.length !== 0) {
            base64 = await toBase64(pictures[0][0])
            base64 = base64.replace('data:image/jpeg;base64,','')
            base64 = base64.replace('data:image/png;base64,','')
        }
        await axios.put('http://172.16.135.89:3000/user/'+userObject[0]._id,{
            ...userObject[0],
            ...userInfo,
            type:1,
            account:props.user_id,
            clicked_groups: node._id !== undefined ? [node._id] : userObject[0].groups_obids,
            avatar_file: base64 ? base64 : userObject[0].avatar_file
        })
        alert('등록 되었습니다.')
        history.push('/users/employee')
    }
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
                    <ImageUploader
                    {...props}
                    withIcon={true}
                    onChange={onDrop}
                    imgExtension={[".jpg", ".png"]}
                    label="최대 크기 : 5mb, 허용 확장자: jpg|png"
                    fileSizeError="파일의 크기가 너무 큽니다."
                    fileTypeError="지원하지 않는 타입의 파일 입니다."
                    buttonText="프로필 사진 업로드"
                    maxFileSize={5242880}
                    singleImage={true}
                    withPreview={true}
                    />
                    {
                      pictures.length < 1 ? <div style={{width:"25%",
                      margin:"3% auto",
                      padding:"15px",
                      background:"#edf2f6",
                      display:"flex",
                      alignItems: "center",
                      justifyContent:'center',
                      height:'inherit',
                      boxShadow:'0 0 8px 2px rgba(0, 0, 0, 0.1)',
                      border: '1px solid #d0dbe4',
                      position: 'relative'}}>
                        <img style={{width: "100%",verticalAlign:"middle"}} src={userObject[0].avatar_file_url}></img>
                        </div> : null
                    }
                    <CardContent style={{width: '50%', margin:'0 auto'}}>
                        <Select
                            name="gender"
                            value={userInfo.gender}
                            style={{width:'100%'}} 
                            onChange={handleChange}
                            >
                            <MenuItem value={1}>남자</MenuItem>
                            <MenuItem value={0}>여자</MenuItem>
                        </Select>
                        <div style={{width: '100%'}}>
                            <TextField 
                            name="name"
                            value={userInfo.name}
                            style={{width:'100%'}} 
                            required 
                            id="standard-required" 
                            label="이름"
                            onChange={handleChange}
                            />
                        </div>
                        <div style={{width: '100%'}}>
                            <TextField 
                            name="location"
                            value={userInfo.location}
                            style={{width:'100%'}} 
                            required 
                            id="standard-required" 
                            label="근무지"
                            onChange={handleChange}
                            />
                        </div>
                        <div style={{width: '100%'}}>
                            <TextField 
                            name="department_id"
                            value={userInfo.department_id} 
                            style={{width:'100%'}} 
                            required 
                            onChange={handleChange}
                            id="standard-required" 
                            label="부서"
                            />
                        </div>
                        <div style={{width: '100%'}}>
                            <TextField 
                            name="position"
                            value={userInfo.position} 
                            style={{width:'100%'}} 
                            required 
                            id="standard-required" 
                            onChange={handleChange}
                            label="직급"
                            />
                        </div>
                        <div style={{width: '100%'}}>
                            <TextField
                            name="mobile"
                            value={userInfo.mobile}
                            style={{width:'100%'}}
                            label="핸드폰 번호"
                            onChange={handleChange}
                            InputProps={{
                                inputComponent: TextMaskCustom,
                            }}
                            />
                        </div>
                        <div style={{width: '100%'}}>
                            <TextField
                            name="mail"
                            value={userInfo.mail}
                            style={{width:'100%'}}
                            label="이메일"
                            onChange={handleChange}
                            InputProps={{
                                inputComponent: emailMaskCustom,
                            }}
                            />
                        </div>
                        <div style={{width: '100%',textAlign:'center',marginTop:"15px"}}>
                            <Button style={{marginRight:'4px'}} variant="contained" color="secondary" onClick={handleClickOpen}>그룹 선택</Button>    
                            <Button variant="contained" color="primary" onClick={addUser}>수정</Button>
                        </div>
                        <Dialog
                            open={open}
                            onClose={handleClose}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle id="alert-dialog-title">그룹 선택</DialogTitle>
                            <DialogContent>
                                {
                                  userObject ? 
                                <TreeView
                                defaultExpanded={selectedNode}
                                defaultSelected={userObject[0].groups_obids}
                                className={classes.tree}
                                defaultCollapseIcon={<ArrowDropDownIcon />}
                                defaultExpandIcon={<ArrowRightIcon />}
                                defaultEndIcon={<div style={{ width: 24 }} />}
                                >
                                {props.location.groups.length ? props.location.groups.map(group => renderTree(group)) : <div></div>}
                                </TreeView> : null
                                }
                            </DialogContent>
                            <DialogActions>
                            <Button onClick={handleClose} color="primary">
                                확인
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
    groups : PropTypes.array,
    clickedNode : PropTypes.object,
    setClickedNode : PropTypes.func,
    search : PropTypes.string,
    searchNode : PropTypes.func,
    setUsers : PropTypes.func,
    deleteGroupNode : PropTypes.func,
    userObject : PropTypes.object,
    selectedNode: PropTypes.array
};

export default EditEmployee;
