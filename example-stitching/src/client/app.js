import React from 'react';
import {createFragmentContainer, graphql} from 'react-relay';

const App = (props) => {
  const {animal, human} = props.root;
  const {name, url, rating} = props.business;

  return (
    <div>
      <div>
        App got animal = {props.root.animal}
      </div>
      <div>
        App got human = {props.root.human}
      </div>
      <div>
        {name} click <a href={url} target="_blank">here</a> has rating {rating}
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
    
    fragment app_business on Business {
        name
        url
        rating
    }
  `
);
