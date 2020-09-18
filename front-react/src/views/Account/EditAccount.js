import React,{ useState,useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid,Card,CardContent,TextField,Button } from '@material-ui/core';
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

const EditAccount = (props) => {
    const base_url = "http://"+window.location.href.split('/')[2]+":3000"
    const {selectedAccounts} = props.location;
    const classes = useStyles();
    const history = props.history;

    const [accountInfo, setAccountInfo] = useState({
        user_id:"",
        user_lang:"",
        user_name:"",
        authority:"",
        authority : props.authority === 'admin' ? 
        'admin' : 
        props.authority === 'user' ? 
        'user' : 
        'manager'
    })

    const handleChange = (event) => {
        setAccountInfo({
          ...accountInfo,
          [event.target.name]: event.target.value,
        });
    };

    useEffect(() => {
        if(selectedAccounts && selectedAccounts.length > 0){
        setAccountInfo({
            ...selectedAccounts[0]
        })} else {
          history.go(-1);
        }
    },[selectedAccounts,history])

    const addUser = async () => {
      await axios.put(base_url+'/account/'+selectedAccounts[0]._id,{
          ...selectedAccounts[0],
          ...accountInfo,
      })
      alert('수정 되었습니다.')
      history.push('/system/account')
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
                            value={accountInfo.user_name}
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
                            value={accountInfo.user_id}
                            style={{width:'100%'}} 
                            required 
                            id="standard-required" 
                            label="아이디"
                            onChange={handleChange}
                            />
                        </div>
                        {
                          accountInfo.pw_chk === accountInfo.user_pw ?
                          <div>                 
                            <div style={{width: '100%'}}>
                              <TextField 
                              name="user_pw"
                              value={accountInfo.user_pw} 
                              style={{width:'100%'}} 
                              required 
                              onChange={handleChange}
                              type="password"
                              id="standard-required" 
                              label="비밀번호"
                              />
                            </div>
                            <div style={{width: '100%'}}>
                              <TextField 
                              name="pw_chk"
                              value={accountInfo.pw_chk} 
                              style={{width:'100%'}} 
                              required 
                              id="standard-required" 
                              onChange={handleChange}
                              type="password"
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
                              value={accountInfo.user_pw} 
                              style={{width:'100%'}} 
                              type="password"
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
                              value={accountInfo.pw_chk} 
                              style={{width:'100%'}} 
                              required 
                              type="password"
                              id="standard-required" 
                              onChange={handleChange}
                              label="비밀번호 확인"
                              />
                            </div> 
                          </div>
                        }
                        <Select
                        name="authority"
                        value={accountInfo.authority}
                        style={{width:'100%',marginTop:15}} 
                        onChange={handleChange}
                        >
                          {props.authority === 'admin' ? <MenuItem value={"admin"}>관리자</MenuItem> : null}
                          {props.authority.split('-')[0] === 'manager' || 
                          props.authority === 'admin' ? <MenuItem value={"manager-"+accountInfo.user_id}>매니저</MenuItem> : null}
                          <MenuItem value={props.authority+"-user-"+accountInfo.user_id}>사용자</MenuItem>
                        </Select>
                        <Select
                        name="user_lang"
                        value={accountInfo.user_lang} 
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
                        <Button style={{marginTop: 10}} variant="contained" color="primary" onClick={addUser}>수정</Button>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
        </div>
    );
};

EditAccount.propTypes = {
    className: PropTypes.string,
    groups : PropTypes.array,
    clickedNode : PropTypes.object,
    setClickedNode : PropTypes.func,
    search : PropTypes.string,
    searchNode : PropTypes.func,
    setUsers : PropTypes.func,
    deleteGroupNode : PropTypes.func,
};

export default EditAccount;
