import { Button } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/modal";
import { Form, Formik } from "formik";
import React from "react";
import { UserActions } from "../actions/UserActions";
import { InputField } from "./InputField";

interface LoginModalProps {}

export const LoginModal: React.FC<LoginModalProps> = ({}) => {
  const { login } = UserActions();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const onSubmit = async (
    values: { username: string; password: string },
    { setErrors }: any
  ) => {
    const loggedIn = await login(values);
    if (loggedIn) {
      onClose();
    }
  };
  return (
    <>
      <Button onClick={onOpen}>Login</Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Login</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Formik
              initialValues={{ username: "", password: "" }}
              onSubmit={onSubmit}
            >
              {({ isSubmitting }) => (
                <Form>
                  <InputField label="Username" name="username" />
                  <InputField
                    label="Password"
                    name="password"
                    type="password"
                  />
                  <Button
                    type="submit"
                    isLoading={isSubmitting}
                    colorScheme="blue"
                    my="2"
                    float="right"
                  >
                    Log in
                  </Button>
                </Form>
              )}
            </Formik>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
