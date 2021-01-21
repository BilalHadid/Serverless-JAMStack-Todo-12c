import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import gql from "graphql-tag";
import * as Yup from "yup";
import {
  Formik,
  FormikHelpers,
  FormikProps,
  Form,
  Field,
  FieldProps,
  ErrorMessage,
} from "formik";
import TextField from "@material-ui/core/TextField";
import { Button } from "@material-ui/core";
type MyFormValues = {
  message: string;
};

const APOLLO_QUERY = gql`
  {
    message
  }
`;
const create_todo = gql`
  mutation create($task: String!) {
    create(task: $task) {
      task
    }
  }
`;

const IndexPage: React.FC<any> = () => {
  const initialValues: MyFormValues = { message: "" };
  const { loading, error, data } = useQuery(APOLLO_QUERY);
  const [state, setstate] = useState("");
  const [create] = useMutation(create_todo);
  console.log(state);
  return (
    <div>
      <h2>
        Data Received from Apollo Client at runtime from Serverless Function:
      </h2>
      {loading && <p>Loading Client Side Querry...</p>}
      {error && <p>Error: ${error.message}</p>}
      {data && data.message && <div>{data.message}</div>}
      <div>
        <Formik
          initialValues={initialValues}
          onSubmit={(values) => {
            create({
              variables: {
                task: values,
              },
              refetchQueries: [{ query: APOLLO_QUERY }],
            });
            setstate("");
          }}
          validationSchema={Yup.object({
            message: Yup.string().required("Required"),
          })}
        >
          {(formik) => (
            <Form onSubmit={formik.handleSubmit}>
              <Field
                as={TextField}
                variant="outlined"
                name="message"
                label="Add Task"
              />
              <ErrorMessage name="message" />
              <div style={{ marginTop: "50px" }}>
                <Button type="submit" color="secondary" variant="outlined">
                  Update
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};
export default IndexPage;
