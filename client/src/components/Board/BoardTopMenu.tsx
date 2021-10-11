import { Flex, Text } from "@chakra-ui/layout";
import React from "react";

interface BoardTopMenuProps {
  name: string;
  sideMenuCollapsed: boolean;
}

export const BoardTopMenu: React.FC<BoardTopMenuProps> = ({
  name,
  sideMenuCollapsed,
}) => {
  return (
    <Flex position="fixed" top="2" paddingLeft="2">
      <Text
        fontWeight="bold"
        background="gray.900"
        padding="2"
        borderRadius="5"
      >
        {name}
      </Text>
    </Flex>
  );
};
