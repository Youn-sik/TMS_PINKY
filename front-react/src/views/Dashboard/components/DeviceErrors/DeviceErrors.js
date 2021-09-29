import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {},
  content: {
    padding: 0
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
    height: '430px'
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
      className={(clsx(classes.root, className), classes.cardStyle)}>
      <CardHeader title="단말 에러" />
      <Divider />
      <CardContent className={classes.content}>
        <TableContainer>
          <Table className={classes.inner}>
            <TableHead>
              <TableRow
                onClick={() => {
                  props.history.push('device/error');
                }}>
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
                  onClick={() => {
                    props.history.push('device/error');
                  }}
                  key={error._id}>
                  <TableCell>{error.stb_sn}</TableCell>
                  <TableCell>
                    {error.log_no === 3
                      ? '연결 끊김'
                      : error.log_no === 32
                      ? 'CPU과다 사용'
                      : '메모리 과다 사용'}
                  </TableCell>
                  <TableCell>{error.create_dt}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

DeviceErrors.propTypes = {
  className: PropTypes.string
};

export default DeviceErrors;
