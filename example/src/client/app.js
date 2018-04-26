import React from 'react';
import {createFragmentContainer, graphql} from 'react-relay';

const App = (props) => {
  return (
    <div>
      <div>
        App got animal = {props.root.animal}
      </div>
      <div>
        App got human = {props.root.human}
      </div>
    </div>);
};

// export default app;
export default createFragmentContainer(App,
  graphql`
      fragment app_root on Root {
          animal
          human
      }
  `
);
