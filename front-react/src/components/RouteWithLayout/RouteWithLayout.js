import React from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';

const RouteWithLayout = props => {
  const { layout: Layout, component: Component, ...rest } = props;

  return (
    <Route
      {...rest}
      render={matchProps =>
        Layout !== null ? (
          <Layout path={props.path}>
            <Component
              client={props.client}
              authority={props.authority}
              getAuth={props.getAuth}
              user_id={props.user_id}
              tempLimit={props.tempLimit}
              tempType={props.tempType}
              {...matchProps}
            />
          </Layout>
        ) : (
          <Component
            authority={props.authority}
            getAuth={props.getAuth}
            user_id={props.user_id}
            tempLimit={props.tempLimit}
            tempType={props.tempType}
            {...matchProps}
          />
        )
      }
    />
  );
};

RouteWithLayout.propTypes = {
  component: PropTypes.any,
  layout: PropTypes.any,
  path: PropTypes.string
};

export default RouteWithLayout;
