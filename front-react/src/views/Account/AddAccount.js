import React,{ useState,useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import MaskedInput from 'react-text-mask';
import { Grid,Card,CardContent,TextField,Button,Typography } from '@material-ui/core';
import axios from 'axios';
import PropTypes from 'prop-types';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
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

const AddAccount = (props) => {
    const {groups,clickedNode,setUsers,setClickedNode} = props.location;
    const classes = useStyles();
    const history = props.history;

    const [userInfo, setUserInfo] = useState({
        name : '',
        user_id : '',
        user_lang : 'KOR',
        user_pw : '',
        pw_chk : ''
    })

    const handleChange = (event) => {
        setUserInfo({
          ...userInfo,
          [event.target.name]: event.target.value,
        });
    };

    useEffect(() => {
        console.log(props.location)
    },[])

    const addUser = async () => {
      if(userInfo.user_name === '') alert("이름을 입력해주세요")
      else if(userInfo.user_id === '') alert('아이디를 입력해주세요')
      else if(userInfo.user_pw === '') alert('부서를 입력해주세요')
      else if(userInfo.pw_chk === '') alert('직급을 입력해주세요')
      else if(userInfo.user_pw !== userInfo.pw_chk) alert('비밀번호가 다릅니다')
      else {
        await axios.post('http://172.16.135.89:3000/account',{
          ...userInfo,
        })
        alert('등록 되었습니다.')
        history.push('/system/account')
      }
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
                    <CardContent style={{width: '50%', margin:'0 auto'}}>
                        <div style={{width: '100%'}}>
                            <TextField 
                            name="user_name"
                            value={userInfo.user_name}
                            style={{width:'100%'}} 
                            required 
                            id="standard-required" 
                            label="이름"
                            onChange={handleChange}
                            />
                        </div>
                        <div style={{width: '100%'}}>
                            <TextField 
                            name="user_id"
                            value={userInfo.user_id}
                            style={{width:'100%'}} 
                            required 
                            id="standard-required" 
                            label="아이디"
                            onChange={handleChange}
                            />
                        </div>
                        {
                          userInfo.pw_chk === userInfo.user_pw ?
                          <div>                 
                            <div style={{width: '100%'}}>
                              <TextField 
                              name="user_pw"
                              value={userInfo.user_pw} 
                              style={{width:'100%'}} 
                              required 
                              onChange={handleChange}
                              id="standard-required" 
                              label="비밀번호"
                              />
                            </div>
                            <div style={{width: '100%'}}>
                              <TextField 
                              name="pw_chk"
                              value={userInfo.pw_chk} 
                              style={{width:'100%'}} 
                              required 
                              id="standard-required" 
                              onChange={handleChange}
                              label="비밀번호 확인"
                            />
                            </div>
                          </div>
                          :
                          <div>
                            <div style={{width: '100%'}}>
                              <TextField 
                              error
                              helperText="비밀번호가 같지 않습니다!"
                              name="user_pw"
                              value={userInfo.user_pw} 
                              style={{width:'100%'}} 
                              required 
                              onChange={handleChange}
                              id="standard-required" 
                              label="비밀번호"
                              />
                            </div>
                            <div style={{width: '100%'}}>
                              <TextField 
                              error
                              helperText="비밀번호가 같지 않습니다!"
                              name="pw_chk"
                              value={userInfo.pw_chk} 
                              style={{width:'100%'}} 
                              required 
                              id="standard-required" 
                              onChange={handleChange}
                              label="비밀번호 확인"
                              />
                            </div> 
                          </div>
                        }

                        <Select
                        name="user_lang"
                        value={userInfo.user_lang}
                        style={{width:'100%',marginTop:15}} 
                        onChange={handleChange}
                        >
                            <MenuItem value={"KOR"}>한국어</MenuItem>
                            <MenuItem value={"ENG"}>영어</MenuItem>
                        </Select>
                        <Grid 
                        container justify="center"
                        alignItems="center"
                        >
                        <Button style={{marginTop: 10}} variant="contained" color="primary" onClick={addUser}>등록</Button>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
        </div>
    );
};

AddAccount.propTypes = {
    className: PropTypes.string,
    groups : PropTypes.array,
    clickedNode : PropTypes.object,
    setClickedNode : PropTypes.func,
    search : PropTypes.string,
    searchNode : PropTypes.func,
    setUsers : PropTypes.func,
    deleteGroupNode : PropTypes.func,
};

export default AddAccount;
