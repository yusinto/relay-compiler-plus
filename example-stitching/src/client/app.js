import React from 'react';
import {createFragmentContainer, graphql} from 'react-relay';

const App = ({user: {name, email}}) =>
    <div>
      The owner is {name}. Visit us at {email}.
    </div>;

export default createFragmentContainer(App,
  graphql`
      fragment app_user on User {
          name
          email
      }
  `
);
