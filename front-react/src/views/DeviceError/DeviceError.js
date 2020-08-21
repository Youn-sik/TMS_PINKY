import React, { useState,useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import axios from 'axios';
import { ErrorsToolbar, ErrorsTable } from './components';
import Card from '@material-ui/core/Card';
import moment from 'moment';
import 'moment/locale/ko'
const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  content: {
    marginTop: theme.spacing(2)
  },
  cardcontent: {
    padding: 0,
    "&:last-child": {
      paddingBottom: 0
    }
  },
  toolbar: {
    padding:"20px 0px 10px 20px"
  }
}));

const DeviceError = () => {

  const [errors,setErrors] = useState([]);//화면에 보여질 출입 데이터
  const [originAcc,setOriginAcc] = useState([]);//모든 출입 데이터
  const [allAcc,setAllAcc] = useState([]);//해당 날짜의 모든 출입 데이터
  const [date,setDate] = useState([moment().locale('ko').format('YYYY-MM-DD'), moment().locale('ko').format('YYYY-MM-DD')]);
  const [loading,setLoading] = useState(true);
  
  useEffect(() => {
    getErrors();
  },[])

  const classes = useStyles();

  async function getErrors () {
    let result = await axios.get('http://172.16.135.89:3000/glogs?type=error')
    result.data.reverse()
    setOriginAcc(result.data)
    setErrors(result.data.filter(i => i.create_dt.split(' ')[0] === date[0]))
    setLoading(false)
  }

  const handleDate = (val) => {
    setDate(val);
    if(val[0] === val[1]) {
      setErrors(originAcc.filter(i => i.create_dt.split(' ')[0] === val[0]))
      setAllAcc(originAcc.filter(i => i.create_dt.split(' ')[0] === val[0]))
    } else {
      setErrors(originAcc.filter(i => i.create_dt.split(' ')[0] >= val[0] && i.create_dt.split(' ')[0] <= val[1]))
      setAllAcc(originAcc.filter(i => i.create_dt.split(' ')[0] >= val[0] && i.create_dt.split(' ')[0] <= val[1]))
    }
  }


  return (
    <div className={classes.root}>
      <Card className={classes.root,classes.cardcontent}>
        <ErrorsToolbar className={classes.toolbar} dateChange={handleDate}/>
        <div className={classes.content}>
          <ErrorsTable loading={loading} errors={errors} />
        </div>
      </Card>
    </div>
  );
};

export default DeviceError;
