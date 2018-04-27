import React from 'react';
import {createFragmentContainer, graphql} from 'react-relay';

const App = (props) => {
  const {animal, human} = props.root;

  return (
    <div>
      <div>
        App got animal = {props.root.animal}
      </div>
      <div>
        App got human = {props.root.human}
      </div>
      {
        props.posts.map(({title, text}, index) =>
          <div key={index}>
            {title}
            <br/>
            {text}
          </div>
        )
      }
    </div>);
};

// export default app;
export default createFragmentContainer(App,
  graphql`
      fragment app_root on Root {
          animal
          human
      }

      fragment app_posts on Post @relay(plural: true) {
          title
          text
      }
  `
);
