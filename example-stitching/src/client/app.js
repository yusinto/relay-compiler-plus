import React from 'react';
import {createFragmentContainer, graphql} from 'react-relay';

const App = ({user: {favouritePlaces}}) =>
  <React.Fragment>
    Here are my favourite places:
    <ul>
      {
        favouritePlaces.map((p, i) => {
          const {name, address, email} = p.business;
          return (
            <li key={i}>
              <div>
                <h3>{name}</h3>
                <ul>
                  <li>{address}</li>
                  <li>{email}</li>
                </ul>
              </div>
            </li>
          );
        })
      }
    </ul>
  </React.Fragment>;

export default createFragmentContainer(App,
  graphql`
      fragment app_user on User {
          favouritePlaces {
              business {
                  name
                  email
                  address
                  publicId
              }
          }
      }
  `
);
