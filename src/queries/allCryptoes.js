import gql from 'graphql-tag';

export default gql`
  query {
    allCryptoes {
      amount
      cryptoId
      id
    }
  } 
`;
