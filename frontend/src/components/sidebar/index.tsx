/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  CloseButton,
  Flex,
  useColorModeValue,
  Text,
  BoxProps,
  FlexProps,
  Icon,
} from "@chakra-ui/react";
import { IconType } from "react-icons";

interface SidebarProps extends BoxProps {
  onClose: () => void;
  menus?: Array<unknown>;
  active?: number;
  setActive?: (val: number) => void;
}

const SidebarContent = ({
  onClose,
  menus,
  active,
  setActive,
  ...rest
}: SidebarProps) => {
  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
          DarwinBox
        </Text>
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>
      {(menus || []).map((link: any, index: number) => (
        <NavItem
          key={link.name}
          onClick={() => {
            setActive?.(index);
            onClose?.();
          }}
          icon={link.icon}
          isActive={active === index}
        >
          {link.name}
        </NavItem>
      ))}
    </Box>
  );
};

interface NavItemProps extends FlexProps {
  icon: IconType;
  isActive: boolean;
  children: React.ReactNode;
}

const NavItem = ({ icon, isActive, children, ...rest }: NavItemProps) => {
  // console.log({ isActive });

  return (
    <Box
      as="a"
      href="#"
      style={{ textDecoration: "none" }}
      _focus={{ boxShadow: "none" }}
    >
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: "cyan.400",
          color: "white",
        }}
        fontWeight={isActive ? "600" : "500"}
        fontSize={isActive ? "18" : "16"}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: "white",
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Box>
  );
};

export default SidebarContent;
