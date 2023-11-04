import {
  IconButton,
  Avatar,
  // Box,
  Flex,
  HStack,
  VStack,
  useColorModeValue,
  Text,
  FlexProps,
  Menu,
  MenuButton,
  Spinner,
  useColorMode,
  Button,
  // MenuDivider,
  // MenuItem,
  // MenuList,
} from "@chakra-ui/react";
import {
  FiMenu,
  FiMoon,
  FiSun,
  // FiBell,
  // FiChevronDown,
} from "react-icons/fi";
import { useConfigStore } from "../../store/config.store";

interface MobileProps extends FlexProps {
  onOpen: () => void;
}

const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  const [loading, user] = useConfigStore((store) => [
    store.loading,
    store.user,
  ]);
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue("white", "gray.900")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent={{ base: "space-between", md: "flex-end" }}
      {...rest}
    >
      <IconButton
        display={{ base: "flex", md: "none" }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text
        display={{ base: "flex", md: "none" }}
        fontSize="2xl"
        fontFamily="monospace"
        fontWeight="bold"
      >
        DarwinBox
      </Text>

      <HStack spacing={{ base: "0", md: "6" }}>
        {/* <IconButton
          size="lg"
          variant="ghost"
          aria-label="open menu"
          icon={<FiBell />}
        /> */}
        <Button onClick={toggleColorMode} variant={"ghost"} mr={2}>
          {colorMode === "light" ? <FiMoon size={20} /> : <FiSun size={20} />}
        </Button>
        <Flex alignItems={"center"}>
          <Menu>
            <MenuButton
              py={2}
              transition="all 0.3s"
              _focus={{ boxShadow: "none" }}
            >
              <HStack>
                {loading && <Spinner />}
                {!loading && user && (
                  <>
                    <Avatar size={"sm"} src={user?.pic320} />
                    <VStack
                      display={{ base: "none", md: "flex" }}
                      alignItems="flex-start"
                      spacing="1px"
                      ml="2"
                    >
                      <Text fontSize="sm">{user?.name}</Text>
                      <Text fontSize="xs" color="gray.600">
                        {(user?.designation || "").split(" (")?.[0]}
                      </Text>
                    </VStack>
                    {/* <Box display={{ base: "none", md: "flex" }}>
                  <FiChevronDown />
                </Box> */}
                  </>
                )}
              </HStack>
            </MenuButton>
            {/* <MenuList
              bg={useColorModeValue("white", "gray.900")}
              borderColor={useColorModeValue("gray.200", "gray.700")}
            >
              <MenuItem>Profile</MenuItem>
              <MenuItem>Settings</MenuItem>
              <MenuItem>Billing</MenuItem>
              <MenuDivider />
              <MenuItem>Sign out</MenuItem>
            </MenuList> */}
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
};

export default MobileNav;
