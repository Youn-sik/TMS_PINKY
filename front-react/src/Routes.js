import React from 'react';
import { Switch, Redirect } from 'react-router-dom';

import { RouteWithLayout } from './components';
import { Main as MainLayout, Minimal as MinimalLayout } from './layouts';

import {
  Dashboard as DashboardView,
  License as LicenseView,
  AccessList as AccessListView,
  Account as AccountView,
  SignUp as SignUpView,
  SignIn as SignInView,
  NotFound as NotFoundView,
  Employee as EmployeeView,
  AddEmployee as AddEmployeeView,
  EditEmployee as EditEmployeeView,
  Black as BlackView,
  AddBlack as AddBlackView,
  EditBlack as EditBlackView,
  Visitor as VisitorView,
  AddVisitor as AddVisitorView,
  EditVisitor as EditVisitorView,
  Stranger as StrangerView,
  AddStranger as AddStrangerView,
  Device as DeviceView, 
  AddDevice as AddDeviceView,
  EditDevice as EditDeviceView,
  DeviceError as DeviceErrorView,
  DeviceScreen as DeviceScreenView,
  DeviceStat as DeviceStatView,
  UsersStat as UsersStatView,
  AddAccount as AddAccountView,
  EditAccount as EditAccountView,
  Operation as OperationView,
  FaceDetection as FaceDetectionView,
  AccessStat as AccessStatsView,
  Settings as SettingsView,

} from './views';

const Routes = props => {
  return (
    <Switch>
      <Redirect exact from="/" to="/dashboard" />
      <RouteWithLayout
        component={LicenseView}
        exact
        client={props.client}
        user_id={props.user_id}
        authority={props.authority}
        tempLimit={props.tempLimit}
        tempType={props.tempType}
        layout={MainLayout}
        path="/license"
      />
      <RouteWithLayout
        component={DashboardView}
        exact
        client={props.client}
        user_id={props.user_id}
        authority={props.authority}
        tempLimit={props.tempLimit}
        tempType={props.tempType}
        layout={MainLayout}
        path="/dashboard"
      />
      <RouteWithLayout
        component={DeviceStatView}
        exact
        user_id={props.user_id}
        authority={props.authority}
        tempLimit={props.tempLimit}
        layout={MainLayout}
        path="/stats/device"
      />
      <RouteWithLayout
        component={AccessStatsView}
        exact
        user_id={props.user_id}
        authority={props.authority}
        layout={MainLayout}
        path="/stats/access"
      />
      <RouteWithLayout
        component={UsersStatView}
        exact
        user_id={props.user_id}
        authority={props.authority}
        layout={MainLayout}
        path="/stats/users"
      />
      <RouteWithLayout
        component={DeviceView}
        exact
        user_id={props.user_id}
        authority={props.authority}
        layout={MainLayout}
        path="/device/list"
      />
      {/* <RouteWithLayout
        component={DeviceScreenView}
        exact
        user_id={props.user_id}
        authority={props.authority}
        layout={MainLayout}
        path="/device/screen"
      /> */}
      {/* <RouteWithLayout
        component={DeviceErrorView}
        exact
        user_id={props.user_id}
        authority={props.authority}
        layout={MainLayout}
        path="/device/error"
      /> */}
      <RouteWithLayout
        component={AddDeviceView}
        exact
        user_id={props.user_id}
        authority={props.authority}
        layout={MainLayout}
        path="/device/add"
      />
      <RouteWithLayout
        component={EditDeviceView}
        exact
        user_id={props.user_id}
        authority={props.authority}
        layout={MainLayout}
        path="/device/edit"
      />
      <RouteWithLayout
        component={AccessListView}
        exact
        user_id={props.user_id}
        authority={props.authority}
        layout={MainLayout}
        tempLimit={props.tempLimit}
        tempType={props.tempType}
        path="/access/records"
      />
      {/* <RouteWithLayout
        component={StrangerView}
        exact
        user_id={props.user_id}
        authority={props.authority}
        layout={MainLayout}
        tempLimit={props.tempLimit}
        tempType={props.tempType}
        path="/users/Stranger"
      /> */}
      <RouteWithLayout
        component={AddStrangerView}
        exact
        user_id={props.user_id}
        authority={props.authority}
        layout={MainLayout}
        path="/users/Stranger/add"
      />
      <RouteWithLayout
        component={EmployeeView}
        exact
        user_id={props.user_id}
        authority={props.authority}
        layout={MainLayout}
        path="/users/employee"
      />
      <RouteWithLayout
        component={AddEmployeeView}
        exact
        user_id={props.user_id}
        authority={props.authority}
        layout={MainLayout}
        path="/users/employee/add"
      />
      <RouteWithLayout
        component={EditEmployeeView}
        exact
        user_id={props.user_id}
        authority={props.authority}
        layout={MainLayout}
        path="/users/employee/edit"
      />
      <RouteWithLayout
        component={BlackView}
        exact
        user_id={props.user_id}
        authority={props.authority}
        layout={MainLayout}
        path="/users/black"
      />
      <RouteWithLayout
        component={AddBlackView}
        exact
        user_id={props.user_id}
        authority={props.authority}
        layout={MainLayout}
        path="/users/black/add"
      />
      <RouteWithLayout
        component={EditBlackView}
        exact
        user_id={props.user_id}
        authority={props.authority}
        layout={MainLayout}
        path="/users/black/edit"
      />
      <RouteWithLayout
        component={VisitorView}
        exact
        user_id={props.user_id}
        authority={props.authority}
        layout={MainLayout}
        path="/users/visitor"
      />
      <RouteWithLayout
        component={AddVisitorView}
        exact
        user_id={props.user_id}
        authority={props.authority}
        layout={MainLayout}
        path="/users/visitor/add"
      />
      <RouteWithLayout
        component={EditVisitorView}
        exact
        user_id={props.user_id}
        authority={props.authority}
        layout={MainLayout}
        path="/users/visitor/edit"
      />
      {/* <RouteWithLayout
        component={FaceDetectionView}
        exact
        user_id={props.user_id}
        authority={props.authority}
        layout={MainLayout}
        path="/users/face-detection"
      /> */}
      <RouteWithLayout
        component={AccountView}
        exact
        user_id={props.user_id}
        authority={props.authority}
        layout={MainLayout}
        path="/system/account"
      />
      <RouteWithLayout
        component={AddAccountView}
        exact
        user_id={props.user_id}
        authority={props.authority}
        layout={MainLayout}
        path="/system/account/add"
      />
      <RouteWithLayout
        component={SettingsView}
        exact
        tempLimit={props.tempLimit}
        tempType={props.tempType}
        user_id={props.user_id}
        authority={props.authority}
        layout={MainLayout}
        path="/system/settings"
      />
      <RouteWithLayout
        component={EditAccountView}
        exact
        user_id={props.user_id}
        authority={props.authority}
        layout={MainLayout}
        path="/system/account/Edit"
      />
      <RouteWithLayout
        component={OperationView}
        exact
        user_id={props.user_id}
        authority={props.authority}
        layout={MainLayout}
        path="/system/operation"
      />
      <RouteWithLayout
        component={SignUpView}
        exact
        user_id={props.user_id}
        authority={props.authority}
        layout={MinimalLayout}
        path="/sign-up"
      />
      <RouteWithLayout
        component={SignInView}
        exact
        user_id={props.user_id}
        authority={props.authority}
        getAuth={props.getAuth}
        layout={null}
        path="/sign-in"
      />
      <RouteWithLayout
        component={NotFoundView}
        exact
        user_id={props.user_id}
        authority={props.authority}
        layout={MinimalLayout}
        path="/not-found"
      />
      <Redirect to="/not-found" />
    </Switch>
  );
};

export default Routes;
