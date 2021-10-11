import React, { useContext, useEffect } from "react";
import { Button, IconButton } from "@chakra-ui/button";
import { Box, Flex, Text } from "@chakra-ui/layout";
import { Form, Formik } from "formik";
import { useBoard } from "../actions/BoardActions";
import { createBoard } from "../adapters/api";
import { InputField } from "../components/InputField";
import { AppContext } from "../contexts/AppContext";
import { ChevronRightIcon, DeleteIcon } from "@chakra-ui/icons";
import { Tooltip } from "@chakra-ui/tooltip";
import { useHistory } from "react-router";

interface BoardsOverviewPageProps {}

export const BoardsOverviewPage: React.FC<BoardsOverviewPageProps> = ({}) => {
  const {
    state: { board },
  } = useContext(AppContext);

  const history = useHistory();

  const { getBoardsAction, deleteBoard } = useBoard();

  const onSubmit = async (values: { name: string }, { setErrors }: any) => {
    try {
      const res = await createBoard(values);
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  };

  const goTo = (id: number) => history.push(`/b/${id}`);

  useEffect(() => {
    getBoardsAction();
  }, []);

  return (
    <Flex
      width="100%"
      justifyContent="center"
      flexDir="column"
      alignItems="center"
    >
      <Flex flexWrap="wrap">
        {board.boardsOveriew?.map((board) => (
          <Flex
            p="4"
            background="gray.900"
            m="2"
            borderRadius="5"
            width="100%"
            maxWidth="200px"
            justifyContent="space-between"
            key={board.id}
          >
            <Text>{board.name}</Text>
            <Tooltip label="Delete board">
              <IconButton
                onClick={() => deleteBoard(board.id)}
                aria-label="Delete board"
                icon={<DeleteIcon />}
                size="s"
              />
            </Tooltip>
            <Tooltip label="Go to board">
              <IconButton
                onClick={() => goTo(board.id)}
                aria-label="Go to board"
                icon={<ChevronRightIcon />}
                size="s"
              />
            </Tooltip>
          </Flex>
        ))}
      </Flex>
      <Box maxWidth="400px" mt="4">
        <Formik initialValues={{ name: "" }} onSubmit={onSubmit}>
          {({ isSubmitting }) => (
            <Form>
              <InputField label="Board name" name="name" />
              <Button
                type="submit"
                isLoading={isSubmitting}
                colorScheme="blue"
                my="2"
                float="right"
              >
                Create board
              </Button>
            </Form>
          )}
        </Formik>
      </Box>
    </Flex>
  );
};
