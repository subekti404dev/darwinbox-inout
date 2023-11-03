/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
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
import ModalQR from "./components/modal-qr";
import { useFlagsStore } from "./store/flags.store";
import ModalPassword from "./components/modal-password";
import { authToken } from "./utils/token";

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
  const {
    isOpen: isOpenQRModal,
    onClose: onCloseQRModal,
    onOpen: onOpenModalQR,
  } = useDisclosure();
  const [activeMenuIndex, setActiveMenuIndex] = useState(0);
  const toast = useToast();

  const Page = menus[activeMenuIndex].component;
  const [config, fetchConfig, isTokenAlive, lastCheckToken, checkToken] =
    useConfigStore((store) => [
      store.config,
      store.fetchData,
      store.isTokenAlive,
      store.lastCheckToken,
      store.checkToken,
    ]);

  const [flags, isFetchingFlag, isVerified, fetchFlags, showPassModal] =
    useFlagsStore((store) => [
      store.flags,
      store.isFetching,
      store.isVerified,
      store.fetch,
      store.showPassModal,
    ]);

  const doFetchConfig = async () => {
    const cfg: any = await fetchConfig();
    if (cfg.token) {
      checkToken({});
    } else {
      onOpenModalQR();
    }
  };

  useEffect(() => {
    if (isVerified || authToken.getToken()) {
      doFetchConfig();
    }
  }, [isVerified, authToken.getToken()]);

  useEffect(() => {
    if (config.token && lastCheckToken) {
      const secondsTimer = setInterval(() => {
        checkToken({});
      }, 12 * 1000);
      return () => clearInterval(secondsTimer);
    }
  }, [lastCheckToken]);

  useEffect(() => {
    fetchFlags().then((flag: any) => {
      if (!flag.use_password) doFetchConfig();
    });
  }, []);

  useEffect(() => {
    if (!isTokenAlive && config.token) {
      toast({
        status: "error",
        title: "Token Invalid, Please Relogin!",
        isClosable: false,
      });
      onOpenModalQR();
    }
  }, [isTokenAlive]);

  const renderPage = () => {
    if (isFetchingFlag) return;
    if (!flags.use_password) {
      console.log("masuk");

      return <Page />;
    }
    if (flags.use_password && authToken.getToken()) {
      return <Page />;
    }
  };

  return (
    <Box
      minH="100vh"
      w="calc(100vw - 16px)"
      bg={useColorModeValue("gray.100", "gray.900")}
    >
      <ModalQR isOpen={isOpenQRModal} onClose={onCloseQRModal} />
      <ModalPassword isOpen={showPassModal} />
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
      <MobileNav onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        {renderPage()}
      </Box>
    </Box>
  );
};

export default App;
