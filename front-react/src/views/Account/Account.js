import React, { useState, useEffect, useCallback } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import axios from 'axios';
import { AccountsTable } from './components';
import {base_url as in_base_url,out_base_url} from 'server.json';

let currentUrl = window.location.href
let base_url = in_base_url
// console.log(currentUrl.indexOf("172.16.41.114"))
if(currentUrl.indexOf("172.16.41.114") <= -1) {
  base_url = out_base_url
}

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  }
}));

const Account = props => {
  const [accountsSearch, setAccountsSearch] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState('');
  const classes = useStyles();

  const filterAccount = useCallback(() => {
    let temp = [];
    accounts.map(account => {
      if (
        account.user_name.indexOf(accountsSearch) > -1 ||
        account.user_id.indexOf(accountsSearch) > -1
      ) {
        temp.push(account);
      }
      return false;
    });
    return temp;
  }, [accountsSearch]);

  const sortAccesses = (type, headerType) => {
    setActiveType(headerType);
    if (accountsSearch === '') {
      if (headerType === 'user_id') {
        if (type === 'asc') {
          setAccounts(
            accounts.sort((a, b) => {
              if (a.user_id < b.user_id) return -1;
              else if (b.user_id < a.user_id) return 1;
              else return 0;
            })
          );
        } else {
          setAccounts(
            accounts.sort((a, b) => {
              if (a.user_id > b.user_id) return -1;
              else if (b.user_id > a.user_id) return 1;
              else return 0;
            })
          );
        }
      } else if (headerType === 'authority') {
        if (type === 'asc') {
          setAccounts(
            accounts.sort((a, b) => {
              let a_auth = '?????????';
              let b_auth = '?????????';
              if (a.authority !== 'admin') {
                a_auth = a.authority.split('-');
                a_auth = a_auth[a_auth.length - 2];
              }

              if (b.authority !== 'admin') {
                b_auth = b.authority.split('-');
                b_auth = b_auth[b_auth.length - 2];
              }

              if (a_auth === 'manager') a_auth = '?????????';
              else if (a_auth === 'user') a_auth = '?????????';

              if (b_auth === 'manager') b_auth = '?????????';
              else if (b_auth === 'user') b_auth = '?????????';
              if (a_auth < b_auth) return -1;
              else if (b_auth < a_auth) return 1;
              else return 0;
            })
          );
        } else {
          setAccounts(
            accounts.sort((a, b) => {
              let a_auth = '?????????';
              let b_auth = '?????????';
              if (a.authority !== 'admin') {
                a_auth = a.authority.split('-');
                a_auth = a_auth[a_auth.length - 2];
              }

              if (b.authority !== 'admin') {
                b_auth = b.authority.split('-');
                b_auth = b_auth[b_auth.length - 2];
              }

              if (a_auth === 'manager') a_auth = '?????????';
              else if (a_auth === 'user') a_auth = '?????????';

              if (b_auth === 'manager') b_auth = '?????????';
              else if (b_auth === 'user') b_auth = '?????????';

              if (a_auth > b_auth) return -1;
              else if (b_auth > a_auth) return 1;
              else return 0;
            })
          );
        }
      } else if (headerType === 'user_name') {
        if (type === 'asc') {
          setAccounts(
            accounts.sort((a, b) => {
              if (a.user_name < b.user_name) return -1;
              else if (b.user_name < a.user_name) return 1;
              else return 0;
            })
          );
        } else {
          setAccounts(
            accounts.sort((a, b) => {
              if (a.user_name > b.user_name) return -1;
              else if (b.user_name > a.user_name) return 1;
              else return 0;
            })
          );
        }
      } else if (headerType === 'user_lang') {
        if (type === 'asc') {
          setAccounts(
            accounts.sort((a, b) => {
              if (a.user_lang < b.user_lang) return -1;
              else if (b.user_lang < a.user_lang) return 1;
              else return 0;
            })
          );
        } else {
          setAccounts(
            accounts.sort((a, b) => {
              if (a.user_lang > b.user_lang) return -1;
              else if (b.user_lang > a.user_lang) return 1;
              else return 0;
            })
          );
        }
      }
    } else {
      if (headerType === 'user_id') {
        if (type === 'asc') {
          setFilteredAccounts(
            filteredAccounts.sort((a, b) => {
              if (a.user_id < b.user_id) return -1;
              else if (b.user_id < a.user_id) return 1;
              else return 0;
            })
          );
        } else {
          setFilteredAccounts(
            filteredAccounts.sort((a, b) => {
              if (a.user_id > b.user_id) return -1;
              else if (b.user_id > a.user_id) return 1;
              else return 0;
            })
          );
        }
      } else if (headerType === 'authority') {
        if (type === 'asc') {
          setFilteredAccounts(
            filteredAccounts.sort((a, b) => {
              let a_auth = '?????????';
              let b_auth = '?????????';
              if (a.authority !== 'admin') {
                a_auth = a.authority.split('-');
                a_auth = a_auth[a_auth.length - 2];
              }

              if (b.authority !== 'admin') {
                b_auth = b.authority.split('-');
                b_auth = b_auth[b_auth.length - 2];
              }

              if (a_auth === 'manager') a_auth = '?????????';
              else if (a_auth === 'user') a_auth = '?????????';

              if (b_auth === 'manager') b_auth = '?????????';
              else if (b_auth === 'user') b_auth = '?????????';

              if (a_auth < b_auth) return -1;
              else if (b_auth < a_auth) return 1;
              else return 0;
            })
          );
        } else {
          setFilteredAccounts(
            filteredAccounts.sort((a, b) => {
              let a_auth = '?????????';
              let b_auth = '?????????';
              if (a.authority !== 'admin') {
                a_auth = a.authority.split('-');
                a_auth = a_auth[a_auth.length - 2];
              }

              if (b.authority !== 'admin') {
                b_auth = b.authority.split('-');
                b_auth = b_auth[b_auth.length - 2];
              }

              if (a_auth === 'manager') a_auth = '?????????';
              else if (a_auth === 'user') a_auth = '?????????';

              if (b_auth === 'manager') b_auth = '?????????';
              else if (b_auth === 'user') b_auth = '?????????';
              if (a_auth > b_auth) return -1;
              else if (b_auth > a_auth) return 1;
              else return 0;
            })
          );
        }
      } else if (headerType === 'user_name') {
        if (type === 'asc') {
          setFilteredAccounts(
            filteredAccounts.sort((a, b) => {
              if (a.user_name < b.user_name) return -1;
              else if (b.user_name < a.user_name) return 1;
              else return 0;
            })
          );
        } else {
          setFilteredAccounts(
            filteredAccounts.sort((a, b) => {
              if (a.user_name > b.user_name) return -1;
              else if (b.user_name > a.user_name) return 1;
              else return 0;
            })
          );
        }
      } else if (headerType === 'user_lang') {
        if (type === 'asc') {
          setFilteredAccounts(
            filteredAccounts.sort((a, b) => {
              if (a.user_lang < b.user_lang) return -1;
              else if (b.user_lang < a.user_lang) return 1;
              else return 0;
            })
          );
        } else {
          setFilteredAccounts(
            filteredAccounts.sort((a, b) => {
              if (a.user_lang > b.user_lang) return -1;
              else if (b.user_lang > a.user_lang) return 1;
              else return 0;
            })
          );
        }
      }
    }
  };

  useEffect(() => {
    if (accountsSearch !== '') {
      let copyAccounts = accounts;
      let tempFilteredAccounts = filterAccount(copyAccounts);
      setFilteredAccounts(tempFilteredAccounts);
    }
  }, [accountsSearch, accounts, filterAccount]);

  async function getAccounts() {
    let result = await axios.get(
      base_url + '/account?authority=' + props.authority
    );
    if(result && result.data.length > 0) {
      setAccounts(result.data);
      setAccountsSearch('');
    }
    setLoading(false);
  }

  const deleteAccounts = async selectedAccounts => {
    if (window.confirm('?????? ?????? ???????????????????')) {
      await axios.delete(base_url + '/account/' + selectedAccounts[0]._id, {
        data: {
          account: props.user_id,
          operation_auth: props.authority
        }
      });

      selectedAccounts.sort((a, b) => {
        if (a.index > b.index) {
          return 1;
        } else {
          return -1;
        }
      });

      let temp = accounts.filter((account) =>{ return selectedAccounts[0]._id !== account._id })

      // let temp = JSON.parse(JSON.stringify(accounts)); //??????????????? ??????
      // if (temp.length === selectedAccounts) {
      //   temp = [];
      // } else {
      //   selectedAccounts.map((account, index) => {
      //     temp.splice(account.index - index, 1);
      //     return false;
      //   });
      // }
      await setAccounts(temp);
    }
  };

  useEffect(() => {
    getAccounts();
  }, []);

  return (
    <div className={classes.root}>
      <Grid container spacing={4}>
        <Grid item lg={12} md={12} xl={12} xs={12}>
          <AccountsTable
            activeType={activeType}
            sortAccesses={sortAccesses}
            deleteAccounts={deleteAccounts}
            accounts={accountsSearch === '' ? accounts : filteredAccounts}
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
