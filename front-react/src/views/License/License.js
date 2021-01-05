import React from 'react';
import { makeStyles } from '@material-ui/styles';
import  axios from 'axios';
import  {base_url} from 'server.json';
import { 
  Grid,
  Card,
  CardHeader,
  CardContent,
  Divider,
  Radio,
  TextField,
  Button,
} from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  }
}));

const License = props => {
    const [selectedValue, setSelectedValue] = React.useState('on');
    const [mac, setMac] = React.useState('');
    const [net, setNet] = React.useState('');
    const [key, setKey] = React.useState('');

    const handleChange = (event) => {
      setSelectedValue(event.target.value);
    };

    const handleMac = (e) => {
      setMac(e.target.value)
    }

    const handleNet = (e) => {
      setNet(e.target.value)
    }

    const handleKey = (e) => {
      setKey(e.target.value)
    }

    const onClick = async () => {
      if(mac === '' || net === '' || key === ''){
        alert("항목을 모두 입력해주세요.")
      } else {
        await axios.post(base_url+"/camera/license_save",{
          c_type:selectedValue,
          c_mac:mac,
          c_eth:net,
          c_license_key1:key
        })

        alert('등록 되었습니다.')
        props.history.push('/')
      }

    }

    const classes = useStyles();

    return (
        <div className={classes.root}>
        <Grid container spacing={4} justify="center">
            <Grid item lg={6} md={6} xl={6} xs={12}>
              <Card>
                <CardHeader style={{textAlign:"center"}} title={"라이센스 관리"}/>
                <Divider/>
                <CardContent>
                  <Alert style={{marginBottom : "20px"}} severity="error">
                    <AlertTitle>주의 사항</AlertTitle>
                    1.인터넷을 연결한 상태에서 해 주셔야 합니다.
                    <br/><br/>
                    2.인증 방법을 오프라인으로 설정 후 재인증은
                    /var/www/html/license.txt
                    파일을 삭제 후 재 인증해주세요.
                  </Alert>
                  <table style={{width:"100%"}}>
                    <tbody>
                      <tr>
                        <td style={{padding:"8px", width:"150px"}}>인증방법</td>
                        <td>
                        <Radio
                          checked={selectedValue === 'on'}
                          onChange={handleChange}
                          value="on"
                          name="radio-button-demo"
                        />온라인
                        <Radio
                          checked={selectedValue === 'off'}
                          onChange={handleChange}
                          value="off"
                          name="radio-button-demo"
                        />오프라인
                        </td>
                      </tr>
                      <tr style={{margin:"5px 5px"}}>
                        <td style={{padding:"8px", width:"150px"}}>서버 맥주소</td>
                        <td><TextField value={mac} onChange={handleMac} style={{width:"100%" , margin:"5px 0 5px 0"}} size="small" id="outlined-basic" variant="outlined" /></td>
                      </tr>
                      <tr style={{margin:"5px 5px"}}>
                        <td style={{padding:"8px", width:"150px"}}>이더넷 종류</td>
                        <td><TextField value={net} onChange={handleNet} style={{width:"100%" , margin:"5px 0 5px 0"}} size="small" id="outlined-basic" variant="outlined" /></td>
                      </tr>
                      <tr style={{margin:"5px 5px"}}>
                        <td style={{padding:"8px", width:"150px"}}>라이센스키</td>
                        <td><TextField value={key} onChange={handleKey} style={{width:"100%" , margin:"5px 0 20px 0"}} size="small" id="outlined-basic" variant="outlined" /></td>
                      </tr>
                    </tbody>
                  </table>
                  <div style={{textAlign:"center"}}>
                    <Button onClick = {onClick} variant="contained" color="primary">라이센스 등록</Button>
                  </div>
                </CardContent>
              </Card>
            </Grid>
        </Grid>
        </div>
    );
};

export default License;
