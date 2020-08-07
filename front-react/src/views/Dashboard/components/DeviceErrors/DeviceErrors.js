import React, { useState } from 'react';
import clsx from 'clsx';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardActions,
  CardHeader,
  CardContent,
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  TableSortLabel
} from '@material-ui/core';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';

// import mockData from './data';
import { StatusBullet } from 'components';

const useStyles = makeStyles(theme => ({
  root: {},
  content: {
    padding: 0
  },
  inner: {
    minWidth: 800
  },
  statusContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  status: {
    marginRight: theme.spacing(1)
  },
  actions: {
    justifyContent: 'flex-end'
  },
  cardStyle: {
    height:"430px"
  }
}));

const statusColors = {
  delivered: 'success',
  pending: 'info',
  refunded: 'danger'
};

const DeviceErrors = props => {
  const { className, ...rest } = props;

  const classes = useStyles();

  // const [orders] = useState(mockData);
  // const device_errors = props.device_errors;

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className),classes.cardStyle}
    >
      <CardHeader
        title="단말기 에러"
      />
      <Divider />
      <CardContent className={classes.content}>
        <PerfectScrollbar>
          <div className={classes.inner}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>시리얼 넘버</TableCell>
                  <TableCell>에러</TableCell>
                  <TableCell sortDirection="desc">
                    {/* <Tooltip
                      enterDelay={300}
                      title="Sort"
                    >
                      <TableSortLabel
                        active
                        direction="desc"
                      > */}
                        날짜
                      {/* </TableSortLabel>
                    </Tooltip> */}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {props.errors.map(error => (
                  <TableRow
                    hover
                    key={error._id}
                  >
                    <TableCell>{error.stb_sn}</TableCell>
                    <TableCell>{error.log_no === 3 ? "연결 끊김" : 
                                error.log_no === 32 ? "CPU과다 사용" : "메모리 과다 사용"}</TableCell>
                    <TableCell>{error.create_dt}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </PerfectScrollbar>
      </CardContent>
    </Card>
  );
};

DeviceErrors.propTypes = {
  className: PropTypes.string
};

export default DeviceErrors;
