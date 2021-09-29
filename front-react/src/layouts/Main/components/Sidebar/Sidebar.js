import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { Drawer } from '@material-ui/core';
import DashboardIcon from '@material-ui/icons/Dashboard';
import PeopleIcon from '@material-ui/icons/People';
import SettingsIcon from '@material-ui/icons/Settings';
import SyncAltIcon from '@material-ui/icons/SyncAlt';
import DnsIcon from '@material-ui/icons/Dns';
import InsertChartIcon from '@material-ui/icons/InsertChart';

import { SidebarNav } from './components';

const useStyles = makeStyles(theme => ({
  drawer: {
    width: 240,
    [theme.breakpoints.up('lg')]: {
      marginTop: 64,
      height: 'calc(100% - 64px)'
    }
  },
  root: {
    backgroundColor: theme.palette.white,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: theme.spacing(2)
  },
  divider: {
    margin: theme.spacing(2, 0)
  },
  nav: {
    marginBottom: theme.spacing(2)
  }
}));

const Sidebar = props => {
  const { open, variant, onClose, className, ...rest } = props;

  const classes = useStyles();

  const pages = [
    {
      title: '종합 현황판',
      href: '/dashboard',
      icon: <DashboardIcon />
    },
    {
      title: '현황 관리',
      // href: '/access',
      href: '/access/records',
      icon: <SyncAltIcon />,
      // children: [
      //   {
      //     title: '출입 관리',
      //     href: '/access/records'
      //   },
      // ]
    },
    {
      title: '학생관리',
      href: '/users',
      children: [
        {
          title: '학생관리 세부',
          href: '/users/employee'
        },
        {
          title: '블랙리스트 관리',
          href: '/users/black'
        }
      ],
      icon: <PeopleIcon />
    },
    {
      title: '단말 관리',
      href: '/device/list',
      // children: [
      //   {
      //     title: '단말 목록',
      //     href: '/device/list'
      //   },
        // {
        //   title: '단말 에러 로그',
        //   href: '/device/error'
        // },
        // {
        //   title: '단말기 스크린샷',
        //   href: '/device/screen'
        // }
      // ],
      icon: <DnsIcon />
    },
    {
      title: '통계',
      href: '/stats',
      children: [
        {
          title: '단말 통계',
          href: '/stats/device'
        },
        // {
        //   title: '사용자 통계',
        //   href: '/stats/users'
        // },
        {
          title: '데이터 통계',
          href: '/stats/access'
        }
      ],
      icon: <InsertChartIcon />
    },
    {
      title: '시스템',
      href: '/system',
      children: [
        {
          title: '계정 관리',
          href: '/system/account'
        },
        {
          title: '작업 기록',
          href: '/system/operation'
        },
        {
          title: '설정',
          href: '/system/settings'
        }
      ],
      icon: <SettingsIcon />
    }
    // {
    //   title: 'Products'
    //   href: '/products',
    //   icon: <ShoppingBasketIcon />
    // },
    // {
    //   title: 'Authentication',
    //   href: '/sign-in',
    //   icon: <LockOpenIcon />
    // },
    // {
    //   title: 'Typography',
    //   href: '/typography',
    //   icon: <TextFieldsIcon />
    // },
    // {
    //   title: 'Icons',
    //   href: '/icons',
    //   icon: <ImageIcon />
    // },
    // {
    //   title: 'Account',
    //   href: '/account',
    //   icon: <AccountBoxIcon />
    // },
    // {
    //   title: 'Settings',
    //   href: '/settings',
    //   icon: <SettingsIcon />
    // }
  ];

  return (
    <Drawer
      anchor="left"
      classes={{ paper: classes.drawer }}
      onClose={onClose}
      open={open}
      variant={variant}>
      <div {...rest} className={clsx(classes.root, className)}>
        {/* <Profile />
        <Divider className={classes.divider} /> */}
        <SidebarNav path={props.path} className={classes.nav} pages={pages} />
      </div>
    </Drawer>
  );
};

export default Sidebar;
