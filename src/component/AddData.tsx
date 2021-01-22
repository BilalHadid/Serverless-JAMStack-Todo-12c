import React from "react";
import { useQuery, useMutation } from "@apollo/client";
import gql from "graphql-tag";
import { Button } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import { useState } from "react";
import "./style.css";
const APOLLO_QUERY = gql`
  {
    message {
      id
      task
    }
  }
`;

const create_todo = gql`
  mutation create($task: String!) {
    create(task: $task) {
      task
    }
  }
`;

const AddData = () => {
  const [data, setData] = useState("");
  const [addNewRecord] = useMutation(create_todo);
  let addRecord = (e) => {
    e.preventDefault();
    try {
      addNewRecord({
        variables: {
          task: data,
        },
        refetchQueries: [{ query: APOLLO_QUERY }],
      });
    } catch (err) {
      return <div>error</div>;
    }
  };
  const handleChange = (e) => {
    setData(e.target.value);
  };
  return (
    <div className="AddTask">
      <div>
        <form onSubmit={(e) => addRecord(e)}>
          <TextField
            onChange={handleChange}
            id="standard-basic"
            label="Add Todo"
            variant="outlined"
            color="secondary"
          />
          <Button
            type="submit"
            variant="outlined"
            color="secondary"
            style={{ padding: "15px" }}
          >
            Add Todo
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AddData;
