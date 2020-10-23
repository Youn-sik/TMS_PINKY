import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid, Select, MenuItem } from '@material-ui/core';
import axios from 'axios';
import { DateRangePicker, IntlProvider } from 'rsuite';
import kor from 'rsuite/lib/IntlProvider/locales/ko_KR';
import moment from 'moment';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import 'moment/locale/ko';
import { TimeAccess } from './components';
import {base_url} from 'server.json';
import { saveAs } from 'file-saver'
import ExcelJS from 'exceljs/dist/es5/exceljs.browser.js'
// eslint-disable-next-line no-extend-native
Date.prototype.yyyymmdd = function() {
  var yyyy = this.getFullYear().toString();
  var mm = (this.getMonth() + 1).toString();
  var dd = this.getDate().toString();
  return (
    yyyy + '-' + (mm[1] ? mm : '0' + mm[0]) + '-' + (dd[1] ? dd : '0' + dd[0])
  );
};

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  },
  accessCard: {
    height: '125px;'
  }
}));

const AccessStat = props => {
  const classes = useStyles();
  const { allowedDays } = DateRangePicker;
  const [date, setDate] = useState([
    moment().format('YYYY-MM-DD'),
    moment().format('YYYY-MM-DD')
  ]);
  const [peopleData, setPeopleData] = useState([]);
  const [devices, setDevices] = useState([]);
  const [device, setDevice] = useState('all');
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [accesses, setAccesses] = useState([]);
  const [chartData, setChartData] = useState({});

  async function getAccesses() {
    setLoading(true);
    let result = await axios.get(base_url + `/access?type=deviceGroupAccesses&device=${device}&date=${date[0]}/${date[1]}`);
    setPeopleData(result.data);
    setLoading(false);
  }

  const filterAccesses = () => {
    let access = peopleData.access
    let temp = peopleData.temp
    let labels = [];
    let data = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    let maxTemp = [];
    // accessData.push({avatar_file_url:i.maxUrl,avatar_type:i.maxType});
    let accessData = [];

    if(access.length > 0) {
      if(device === 'all') {
        ['0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23']
        .forEach(function(time,index) {
          labels.push(time.length === 1 ? '0'+time : time)
          access.map((i) => {
            data[index] += i[time]
          })
          
          for(let i = 0; i<temp.length -1 ; i++){
            if(temp[i][time].split('|')[1] > temp[i+1][time].split('|')[1]) {
              // console.log(temp[i][time].split('|')[1],temp[i+1][time].split('|')[1])
              let maxData = temp[i][time].split('|')
              maxTemp[index] = maxData[1]
              accessData[index] = {
                avatar_file_url : maxData[3],
                avatar_type : maxData[2],
                name : maxData[0]
              }
            } else {
              maxTemp[index] = temp[i+1][time].split('|')[1]
            }
          }
          
        })
      } else {
        ['0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23']
        .forEach(function(time,index) {
          let maxData = temp[0][time].split('|')
          labels.push(time.length === 1 ? '0'+time : time)
          data[index] = access[0][time]
          maxTemp[index] = maxData[1]
          accessData[index] = {
            avatar_file_url : maxData[3],
            avatar_type : maxData[2],
            name : maxData[0]
          }
        })
      }
    } else {
      ['0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23']
        .forEach(function(time,index) {
          labels.push(time.length === 1 ? '0'+time : time)
        })
    }

    if(access.length > 0) {
      setChartData({
        labels,
        data,
        maxTemp,
        accessData
      });
    } else {
      setChartData({})
    }
    

    // let labels = [];
    // let data = [];
    // let maxTemp = [];
    // let accessData = [];
    // ['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23']
    // .forEach(function(time,index) {
    //   if(!temp[index]) {
    //     temp.push({
    //       _id:time,
    //       count:0,
    //       maxTemp:'0',
    //       maxUrl:'',
    //     })
    //   } else if(temp[index]._id !== time) {
    //     temp.splice(index,0,{
    //       _id:time,
    //       count:0,
    //       maxTemp:'0',
    //       maxUrl:'',
    //     })
    //   }

    // })
    // temp.map(i => {
    //   labels.push(i._id);
    //   data.push(i.count);
    //   maxTemp.push(i.maxTemp);
    //   accessData.push({avatar_file_url:i.maxUrl,avatar_type:i.maxType});
    // });
    // setChartData({
    //   labels,
    //   data,
    //   maxTemp,
    //   accessData
    // });
    // setAccesses(temp);
  };

  async function getDevices() {
    let result = await axios.get(
      base_url + '/camera?authority=' + props.authority
    );
    if (result.data.length > 0) {
      setDevices(result.data);
    }
  }

  const dateChange = (date, value) => {
    return moment(date)
      .add(value, 'days')
      .format('YYYY-MM-DD');
  };

  const clickExport = async () => {

    const wb = new ExcelJS.Workbook()

    const ws = wb.addWorksheet()

    let data = JSON.parse(JSON.stringify(accesses));
    let time = ['시간'] ;
    let count = ['출입자수'];
    let maxTemp = ['최고 발열자 온도'];
    let maxImg = ['최고 발열자 사진',' '];
    data.map((i, index) => {
      time.push(i._id)
      count.push(i.count)
      maxTemp.push(i.maxTemp)

      if(i.maxBase64) {
        let image = wb.addImage({
          base64: i.maxBase64,
          extension: 'png'
        })
        ws.addImage(image,{
          tl: { col: 1.5+index, row: 3 },
          br: { col: 2+index, row: 5.5 }
        })
      }
    });
    
    ws.addRow(time)
    ws.addRow(count)
    ws.addRow(maxTemp)
    ws.addRow(maxImg)

    const buf = await wb.xlsx.writeBuffer()

    saveAs(new Blob([buf]), 'statistics.xlsx')
  }

  const handleDeviceChange = e => {
    setDevice(e.target.value);
  };

  const handleDate = val => {
    setDate(val);
  };

  useEffect(() => {
    getAccesses();
  }, [date,device]);

  useEffect(() => {
    getDevices();
  }, []);

  useEffect(() => {
    if(devices.length > 0 && !Array.isArray(peopleData)) {
      filterAccesses();
    }
  }, [peopleData,devices]);

  return (
    <div className={classes.root}>
      {loading ? (
        <Grid
          container
          style={{ height: '75vh' }}
          direction="row"
          justify="center"
          alignItems="center">
          <CircularProgress />
        </Grid>
      ) : (
        <Grid container spacing={3}>
          <Grid item lg={12} md={12} xl={12} xs={12}>
            <IntlProvider locale={kor}>
              <DateRangePicker
                cleanable={false}
                oneTap
                showOneCalendar
                defaultValue={[new Date(date[0]), new Date(date[0])]}
                onChange={val => {
                  handleDate([val[0].yyyymmdd()]);
                }}
                ranges={[]}
              />
            </IntlProvider>
            <Select
              name="device"
              value={device}
              style={{ width: '10%', marginLeft: '10px' }}
              onChange={handleDeviceChange}>
                <MenuItem value='all'>전체</MenuItem>
              {devices.map(device => (
                <MenuItem value={device.serial_number}>{device.name}</MenuItem>
              ))}
            </Select>
            <Button
            size="small"
            style={{float: 'right',marginRight:'10px' }} 
            variant="contained" color="primary" onClick={clickExport}>
              엑셀로 다운로드
            </Button>
          </Grid>
          <Grid item lg={12} md={12} xl={12} xs={12}>
            <TimeAccess date={date} chartData={chartData}></TimeAccess>
          </Grid>
        </Grid>
      )}
    </div>
  );
};

export default AccessStat;
