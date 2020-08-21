import React,{ useState,useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import axios from 'axios';
import { AccountsTable } from './components';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  }
}));

const Account = (props) => {
  const [accountsSearch,setAccountsSearch] = useState('');
  const [accounts,setAccounts] = useState([]);
  const [filteredAccounts,setFilteredAccounts] = useState([]);
  const [loading,setLoading] = useState(true);
  const classes = useStyles();

  useEffect(() => {
    if(accountsSearch !== '') {
      let copyAccounts = accounts;
      let tempFilteredAccounts = filterAccount(copyAccounts);
      setFilteredAccounts(tempFilteredAccounts);
    }
  },[accountsSearch])


  const _setAccounts = (node,length) => {
    let groupLength = 0
    let children = JSON.parse(JSON.stringify(node.children))
    for(let i = 0; i<children.length; i++) {
      if(Array.isArray(children[i].children)) {
        groupLength++;
      } else {
        break;
      }
    }
    setAccounts(children.splice(groupLength))
  }

  const filterAccount = (accounts) => {
    let temp = []
    accounts.map((account) => {
      if(account.account_name.indexOf(accountsSearch) > -1 || account.account_id.indexOf(accountsSearch) > -1) {
        temp.push(account)
      }
    })
    return temp
  }

  async function getAccounts() {
    let result = await axios.get('http://172.16.135.89:3000/account')
    setAccounts(result.data);
    setLoading(false)
  }

  const deleteAccounts = async (selectedAccounts) => {
    if(window.confirm('정말 삭제 하시겠습니까?')) {
      await axios.delete('http://172.16.135.89:3000/account/'+accounts[0]._id,{
        data:{
          account : 'admin' // to do :나중에 계정 정보 넣을것
        }
      })

      selectedAccounts.sort((a, b) =>{
        if(a.index > b.index){
          return 1
        } else {
          return -1
        }
      })
  
      let temp = JSON.parse(JSON.stringify(accounts)); //테이블에서 제거
      if(temp.length === selectedAccounts) {
        temp=[]
      } else {
        selectedAccounts.map((account,index) => {
          temp.splice(account.index-index,1);
        })
      }
      await setAccounts(temp);
    }
  }

  useEffect(() => {
    getAccounts();
  },[])


  return (
    <div className={classes.root}>
      <Grid
        container
        spacing={4}
      >
        <Grid
          item
          lg={12}
          md={12}
          xl={12}
          xs={12}
        >
          <AccountsTable
          deleteAccounts={deleteAccounts} 
          accounts={accountsSearch === '' ?  accounts : filteredAccounts } 
          accountsSearch={accountsSearch}
          setAccountsSearch={setAccountsSearch}
          loading={loading}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default Account;
