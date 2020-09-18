import React, { useState,useEffect,useCallback } from 'react';
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

  const base_url = "http://"+window.location.href.split('/')[2]+":3000"
  const [errors,setErrors] = useState([]);
  const [search,setSearch] = useState('');
  const [originAcc,setOriginAcc] = useState([]);
  const [filteredErrors,setFilteredErrors] = useState([]);
  const [date,setDate] = useState([moment().locale('ko').format('YYYY-MM-DD'), moment().locale('ko').format('YYYY-MM-DD')]);
  const [loading,setLoading] = useState(true);
  const [activeType,setActiveType] = useState('create_dt');

  const getErrors = useCallback( async () => {
    let result = await axios.get(base_url+'/glogs?type=error')
    result.data.reverse()
    setOriginAcc(result.data)
    setErrors(result.data.filter(i => i.create_dt.split(' ')[0] === date[0]))
    setLoading(false)
    setDate([moment().locale('ko').format('YYYY-MM-DD'), moment().locale('ko').format('YYYY-MM-DD')]);
    setSearch('');
  },[])

  const _setSearch = (value) => {
    setSearch(value);
    setFilteredErrors(
      errors.filter(err => err.stb_id.indexOf(value) > -1 || 
      err.stb_sn.indexOf(value) > -1 ||
      err.log_message.indexOf(value) > -1)
    )
  }

  useEffect(() => {
    getErrors();
  },[getErrors])

  const classes = useStyles();

  const sortAccesses = (type,headerType) => {
    setActiveType(headerType)
    if(search === ''){
      if(headerType === 'stb_id') {
        if(type === 'asc'){
          setErrors(errors.sort((a,b) => {
            if (a.stb_id < b.stb_id) return -1;
            else if (b.stb_id < a.stb_id) return 1;
            else return 0;
          }))
        } else {
          setErrors(errors.sort((a,b) => {
            if (a.stb_id > b.stb_id) return -1;
            else if (b.stb_id > a.stb_id) return 1;
            else return 0;
          }))
        }
      } else if(headerType === 'stb_sn') {
        if(type === 'asc'){
          setErrors(errors.sort((a,b) => {
            if (a.stb_sn < b.stb_sn) return -1;
            else if (b.stb_sn < a.stb_sn) return 1;
            else return 0;
          }))
        } else {
          setErrors(errors.sort((a,b) => {
            if (a.stb_sn > b.stb_sn) return -1;
            else if (b.stb_sn > a.stb_sn) return 1;
            else return 0;
          }))
        }
      } else if(headerType === 'log_message') {
        if(type === 'asc'){
          setErrors(errors.sort((a,b) => {
            if (a.log_message < b.log_message) return -1;
            else if (b.log_message < a.log_message) return 1;
            else return 0;
          }))
        } else {
          setErrors(errors.sort((a,b) => {
            if (a.log_message > b.log_message) return -1;
            else if (b.log_message > a.log_message) return 1;
            else return 0;
          }))
        }
      } else if(headerType === 'create_dt') {
        if(type === 'asc'){
          setErrors(errors.sort((a,b) => {
            if (a.create_dt < b.create_dt) return -1;
            else if (b.create_dt < a.create_dt) return 1;
            else return 0;
          }))
        } else {
          setErrors(errors.sort((a,b) => {
            if (a.create_dt > b.create_dt) return -1;
            else if (b.create_dt > a.create_dt) return 1;
            else return 0;
          }))
        }
      }
    } else {
      if(headerType === 'stb_id') {
        if(type === 'asc'){
          setFilteredErrors(filteredErrors.sort((a,b) => {
            if (a.stb_id < b.stb_id) return -1;
            else if (b.stb_id < a.stb_id) return 1;
            else return 0;
          }))
        } else {
          setFilteredErrors(filteredErrors.sort((a,b) => {
            if (a.stb_id > b.stb_id) return -1;
            else if (b.stb_id > a.stb_id) return 1;
            else return 0;
          }))
        }
      } else if(headerType === 'stb_sn') {
        if(type === 'asc'){
          setFilteredErrors(filteredErrors.sort((a,b) => {
            if (a.stb_sn < b.stb_sn) return -1;
            else if (b.stb_sn < a.stb_sn) return 1;
            else return 0;
          }))
        } else {
          setFilteredErrors(filteredErrors.sort((a,b) => {
            if (a.stb_sn > b.stb_sn) return -1;
            else if (b.stb_sn > a.stb_sn) return 1;
            else return 0;
          }))
        } 
      } else if(headerType === 'log_message') {
        if(type === 'asc'){
          setFilteredErrors(filteredErrors.sort((a,b) => {
            if (a.log_message < b.log_message) return -1;
            else if (b.log_message < a.log_message) return 1;
            else return 0;
          }))
        } else {
          setFilteredErrors(filteredErrors.sort((a,b) => {
            if (a.log_message > b.log_message) return -1;
            else if (b.log_message > a.log_message) return 1;
            else return 0;
          }))
        }
      } else if(headerType === 'create_dt') {
        if(type === 'asc'){
          setFilteredErrors(filteredErrors.sort((a,b) => {
            if (a.create_dt < b.create_dt) return -1;
            else if (b.create_dt < a.create_dt) return 1;
            else return 0;
          }))
        } else {
          setFilteredErrors(filteredErrors.sort((a,b) => {
            if (a.create_dt > b.create_dt) return -1;
            else if (b.create_dt > a.create_dt) return 1;
            else return 0;
          }))
        }
      }
    }
  }

  const handleDate = (val) => {
    setDate(val);
    if(val[0] === val[1]) {
      setErrors(originAcc.filter(i => i.create_dt.split(' ')[0] === val[0]))
    } else {
      setErrors(originAcc.filter(i => i.create_dt.split(' ')[0] >= val[0] && i.create_dt.split(' ')[0] <= val[1]))
    }
  }


  return (
    <div className={classes.root}>
      <Card className={classes.root,classes.cardcontent}>
        <ErrorsToolbar loading={loading} search={search} setSearch={_setSearch} className={classes.toolbar} dateChange={handleDate}/>
        <div className={classes.content}>
          <ErrorsTable activeType={activeType} sortAccesses={sortAccesses} loading={loading} errors={search === '' ? errors : filteredErrors} />
        </div>
      </Card>
    </div>
  );
};

export default DeviceError;
