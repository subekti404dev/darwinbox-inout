import {
  Box,
  useColorModeValue,
  Drawer,
  DrawerContent,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import SidebarContent from "./components/sidebar";
import MobileNav from "./components/mobile-nav";
import { FiFileText, FiSettings } from "react-icons/fi";
import { IconType } from "react-icons";
import HistoryPage from "./pages/history";
import SettingPage from "./pages/setting";
import { useEffect, useState } from "react";
import { useConfigStore } from "./store/config.store";
interface MenuItemsProps {
  name: string;
  icon: IconType;
  component: () => JSX.Element;
}
const menus: Array<MenuItemsProps> = [
  { name: "History", icon: FiFileText, component: HistoryPage },
  { name: "Settings", icon: FiSettings, component: SettingPage },
];

const App = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [activeMenuIndex, setActiveMenuIndex] = useState(0);
  const toast = useToast();

  const Page = menus[activeMenuIndex].component;
  const [
    config,
    fetchConfig,
    isCheckingToken,
    isTokenAlive,
    lastCheckToken,
    checkToken,
  ] = useConfigStore((store) => [
    store.config,
    store.fetchData,
    store.isCheckingToken,
    store.isTokenAlive,
    store.lastCheckToken,
    store.checkToken,
  ]);

  console.log({ isCheckingToken, isTokenAlive });

  useEffect(() => {
    if (config.token) {
      const secondsTimer = setInterval(() => {
        checkToken();
      }, 10 * 1000);
      return () => clearInterval(secondsTimer);
    }
  }, [lastCheckToken]);

  useEffect(() => {
    fetchConfig();
  }, []);

  useEffect(() => {
    if (config.token) {
      checkToken();
    }
  }, [config.token]);

  useEffect(() => {
    if (isTokenAlive) {
      toast({
        status: "error",
        title: "Token Invalid, Please Relogin!",
        isClosable: false,
      });
    }
  }, [isTokenAlive]);

  return (
    <Box minH="100vh" w="100vw" bg={useColorModeValue("gray.100", "gray.900")}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: "none", md: "block" }}
        menus={menus}
        active={activeMenuIndex}
        setActive={setActiveMenuIndex}
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
          <SidebarContent
            onClose={onClose}
            menus={menus}
            active={activeMenuIndex}
            setActive={setActiveMenuIndex}
          />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        {/* Content */}
        <Page />
      </Box>
    </Box>
  );
};

export default App;
