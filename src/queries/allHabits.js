import gql from 'graphql-tag';

export default gql`
  query {
    allHabits {
      name
      id
      completedDays
    }
  }
`;
