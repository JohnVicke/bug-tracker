import { CloseIcon, PlusSquareIcon } from "@chakra-ui/icons";
import {
  Text,
  Box,
  Button,
  Flex,
  IconButton,
  Tooltip,
  Collapse,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import { useBoard } from "../../actions/BoardActions";
import { InputField } from "../InputField";

interface NewColumnSkeletonProps {
  boardId: number;
}

export const NewColumnSkeleton: React.FC<NewColumnSkeletonProps> = ({
  boardId,
}) => {
  const [open, setOpen] = useState(false);
  const toggleMenu = () => setOpen(!open);
  const { addColumn } = useBoard();

  const onSubmit = async (values: { name: string }, { setErrors }: any) => {
    if (!values.name) return setErrors({ name: "Name is required" });
    await addColumn(values.name, boardId);
    toggleMenu();
  };

  return (
    <Box margin="1" width="260px">
      <Collapse in={open}>
        <Box borderRadius="5" padding="3" background="gray.700">
          <Flex mb="4" alignItems="center" justifyContent="space-between">
            <Text fontWeight="bold">Add new column</Text>
            <Tooltip label="close">
              <IconButton
                onClick={toggleMenu}
                variant="ghost"
                size="sm"
                aria-label="add column"
                ml="2"
                type="submit"
                icon={<CloseIcon />}
              />
            </Tooltip>
          </Flex>
          <Formik initialValues={{ name: "" }} onSubmit={onSubmit}>
            {({ isSubmitting }) => (
              <Form style={{ display: "flex", alignItems: "center" }}>
                <InputField name="name" />
                <Tooltip label="add column">
                  <IconButton
                    aria-label="add column"
                    ml="2"
                    type="submit"
                    isLoading={isSubmitting}
                    icon={<PlusSquareIcon />}
                  />
                </Tooltip>
              </Form>
            )}
          </Formik>
        </Box>
      </Collapse>
      {!open && (
        <Button width="100%" leftIcon={<PlusSquareIcon />} onClick={toggleMenu}>
          Add new column
        </Button>
      )}
    </Box>
  );
};
