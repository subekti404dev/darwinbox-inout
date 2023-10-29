import {
  Box,
  useColorModeValue,
  Drawer,
  DrawerContent,
  useDisclosure,
} from "@chakra-ui/react";
import SidebarContent from "./components/sidebar";
import MobileNav from "./components/mobile-nav";
import { FiFileText, FiSettings } from "react-icons/fi";
import { IconType } from "react-icons";

interface MenuItemsProps {
  name: string;
  icon: IconType;
}
const menus: Array<MenuItemsProps> = [
  { name: "History", icon: FiFileText },
  { name: "Settings", icon: FiSettings },
];

const App = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box minH="100vh" w="100vw" bg={useColorModeValue("gray.100", "gray.900")}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: "none", md: "block" }}
        menus={menus}
      />
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent menus={menus} onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        {/* Content */}
      </Box>
    </Box>
  );
};

export default App;
