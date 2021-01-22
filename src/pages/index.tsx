import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import gql from "graphql-tag";
import { Button } from "@material-ui/core";
import AddData from "../component/AddData";
import Loader from "../component/Loader";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import "./index.css";

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
    <div className="Main">
      <AddData />
      {loading && <Loader />}
      {error && <p>Error: ${error.message}</p>}
      {data && data.message && (
        <div className="task">
          {data.message.map((d, i) => {
            return (
              <div key={i} className="listTask">
                <h3>{d.task}</h3>

                <Button
                  type="submit"
                  variant="contained"
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
  );
};
export default IndexPage;
