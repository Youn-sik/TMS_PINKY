import React,{useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/styles';
import axios from 'axios';
import {Base64} from 'js-base64';
import {
  Card,
  CardContent,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Input,
  InputAdornment
} from '@material-ui/core/';
import NumberFormat from 'react-number-format';
import {base_url as in_base_url,out_base_url} from 'server.json';

let currentUrl = window.location.href
let base_url = in_base_url
console.log(currentUrl.indexOf("172.16.41.114"))
if(currentUrl.indexOf("172.16.41.114") <= -1) {
  base_url = out_base_url
}

Base64.extendString();
const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  }
}));

function NumberFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={values => {
        onChange({
          target: {
            name: props.name,
            value: values.value
          }
        });
      }}
      thousandSeparator
      isNumericString
      prefix="$"
    />
  );
}

const Settings = props => {
  const [tempType, setTempType] = useState(String(props.tempType));
  const [tempLimit, setTempLimit] = useState(String(props.tempLimit));
  const [term, setTerm] = useState();
  const classes = useStyles();
  const handleChange = event => {
    setTempType(event.target.value);
  };

  const handleTemp = e => {
    setTempLimit(e.target.value);
  };

  const clickEdit = async () => {
    if(isNaN(tempLimit) || isNaN(term)) {
      alert("숫자만 입력해주세요")
    } else {
      await axios.put(base_url + '/account/' + props.user_id, {
        tempLimit,
        tempType,
        account: props.user_id,
      });
      if(props.authority === 'admin') {
        await axios.put(base_url + '/schedule', {
          term
        });
      }

      let info = props.user_id + "|" + props.authority + "|" + tempType + "|" + tempLimit
      info = info.toBase64();
      document.cookie = 'ACTKINFO='+info+";path=/;";
      localStorage.setItem('temperature',String(tempLimit));

      alert('수정 되었습니다.');
    }

  };

  const getTerm = async () => {
    let result = await axios.get(base_url + '/schedule')
    if(result) {
      setTerm(result.data.term)
    }
  }

  const handleTerm = (e) => {
    setTerm(e.target.value)
  }

  useEffect(() => {
    getTerm();
  },[])

  return (
    <div className={classes.root}>
      <Card>
        <CardContent style={{ width: '40%', margin: '0 auto' }}>
          <FormControl component="fieldset">
            온도 표현 방식 설정
            <RadioGroup
              style={{ display: 'inline-block' }}
              aria-label=""
              name=""
              value={tempType}
              onChange={handleChange}>
              <FormControlLabel
                value="1"
                control={<Radio />}
                label="수치로 표현"
              />
              <FormControlLabel
                value="2"
                control={<Radio />}
                label="문자로 표현"
              />
            </RadioGroup>
          </FormControl>
          <br />
          예시 : <br />
          {tempType === '1' ? (
            <img
              style={{ width: '100%' }}
              alt="수치 예시"
              src={require('../../assets/수치로_표시.png')}></img>
          ) : (
            <img
              style={{ width: '100%' }}
              alt="문자 예시"
              src={require('../../assets/문자로_표시.png')}></img>
          )}
          <br />
          <br />
          <br />
          <br />
          온도 경고 기준 설정
          <br />
          <FormControl>
            <Input
              id="standard-adornment-weight"
              value={tempLimit}
              onChange={handleTemp}
              endAdornment={<InputAdornment position="end">℃</InputAdornment>}
              aria-describedby="standard-weight-helper-text"
              InputProps={{
                inputComponent: NumberFormatCustom
              }}
            />
          </FormControl>
          <br />
          <br />
          {
            props.authority === 'admin' ?
            <div>
              출입자 사진 보관 기간
              <br />
              <FormControl>
                <Input
                  id="standard-adornment-weight"
                  value={term}
                  onChange={handleTerm}
                  endAdornment={<InputAdornment position="end">일</InputAdornment>}
                  aria-describedby="standard-weight-helper-text"
                  InputProps={{
                    inputComponent: NumberFormatCustom
                  }}
                />
              </FormControl>
              <br />
              <br />
            </div> : null
          }
          <div style={{ textAlign: 'center' }}>
            <Button variant="contained" onClick={clickEdit} color="primary">
              수정
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
export default Settings;
