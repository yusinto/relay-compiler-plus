import React from 'react';
import {render} from 'react-dom';
import {QueryRenderer, graphql} from 'react-relay';
import relayEnvironment from './relayEnvironment';
import App from './app';

render(
  <QueryRenderer
    environment={relayEnvironment}
    query={graphql`
        query client_index_Query {
          user {
            email
            name
            ...app_user
          }
        }
    `}
    render={({error, props}) => {
      if (error) {
        return <div>{error.message}</div>;
      } else if (props) {
        return (
          <div>
            Welcome to {props.user.name}!
            <App {...props} />
          </div>
        );
      }

      return <div>Loading...</div>;
    }}
  />, document.getElementById('reactDiv'));
