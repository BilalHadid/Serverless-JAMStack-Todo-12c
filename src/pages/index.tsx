import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import gql from "graphql-tag";
import { Button } from "@material-ui/core";
import Layout from "../component/Layout";

const APOLLO_QUERY = gql`
  {
    message {
      id
      task
    }
  }
`;
const REMOVE_OPERATION = gql`
  mutation removeTodo($id: ID!) {
    removeTodo(id: $id) {
      id
    }
  }
`;

const IndexPage: React.FC<any> = () => {
  const { loading, error, data } = useQuery(APOLLO_QUERY);
  const [removeTodo] = useMutation(REMOVE_OPERATION);
  let removTod = async (e) => {
    removeTodo({
      variables: {
        id: e,
      },
      refetchQueries: [{ query: APOLLO_QUERY }],
    });
  };
  return (
    <Layout>
      <div>
        <h2>
          Data Received from Apollo Client at runtime from Serverless Function:
        </h2>
        {loading && <p>Loading Client Side Querry...</p>}
        {error && <p>Error: ${error.message}</p>}
        {data && data.message && (
          <div>
            {data.message.map((d, i) => {
              return (
                <div key={i}>
                  <h1>{d.task}</h1>
                  <Button
                    type="submit"
                    variant="outlined"
                    color="secondary"
                    onClick={() => removTod(d.id)}
                  >
                    Delete
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};
export default IndexPage;
