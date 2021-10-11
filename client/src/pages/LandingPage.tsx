import { Button } from "@chakra-ui/button";
import React from "react";
import { useHistory } from "react-router";
import { LoginModal } from "../components/LoginModal";

interface LandingPageProps {}

export const LandingPage: React.FC<LandingPageProps> = ({}) => {
  const history = useHistory();

  const goToBoards = () => {
    history.push("/boards");
  };
  return (
    <>
      <LoginModal />
      <Button onClick={goToBoards}>Go to boards</Button>
    </>
  );
};
