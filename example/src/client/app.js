import React from 'react';
import {createFragmentContainer, graphql} from 'react-relay';

const App = (props) => {
  return (
    <div>
      {
        props.viewer ?
          <div>{props.viewer.customer.email}</div>
          :
          <div>loading...</div>
      }
    </div>);
};

// export default app;
export default createFragmentContainer(App,
  graphql`
      fragment app_viewer on Viewer {
          Customer(id: "cj3xrfkrapzo90174udonmzsh") {
              email
          }
      }
  `
);
