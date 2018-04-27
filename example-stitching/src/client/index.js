import React from 'react';
import {render} from 'react-dom';
import {QueryRenderer, graphql} from 'react-relay';
import relayEnvironment from './relayEnvironment';
import App from './app';

render(
  <QueryRenderer
    environment={relayEnvironment}
    query={ graphql`
        query client_index_Query {
          root {
            animal
            ...app_root
          }

          business(id: "yelp-san-francisco") {
            name
            phone
            ...app_business
          }
        }
    `}
    render={({error, props}) => {
      if (error) {
        return <div>{error.message}</div>;
      } else if (props) {
        const {name, phone} = props.business;
        return (
          <div>
            {props.root.animal} is at {name} with phone: {phone}
            <div>
              <App {...props} />
            </div>
          </div>
        );
      }

      return <div>Loading</div>;
    }}
  />, document.getElementById('reactDiv'));
