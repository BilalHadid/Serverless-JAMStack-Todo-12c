import React from "react";
import { useQuery } from "@apollo/client";
import gql from "graphql-tag";

const APOLLO_QUERY = gql`
  {
    message
  }
`;

function IndexPage() {
  const { loading, error, data } = useQuery(APOLLO_QUERY);

  return (
    <div>
      <h2>
        Data Received from Apollo Client at runtime from Serverless Function:
      </h2>
      {loading && <p>Loading Client Side Querry...</p>}
      {error && <p>Error: ${error.message}</p>}
      {data && data.message && <div>{data.message}</div>}
    </div>
  );
}
export default IndexPage;
