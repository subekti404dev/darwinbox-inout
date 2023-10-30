import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Box,
  FormLabel,
  Input,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { useConfigStore } from "../../store/config.store";

interface IModalQR {
  isOpen: boolean;
  onClose: () => void;
}

const ModalQR = ({ isOpen, onClose }: IModalQR) => {
  const [qrData, setQrData] = useState("");
  const [isLoggingIn, doLogin] = useConfigStore((store) => [
    store.isLoggingIn,
    store.doLogin,
  ]);
  const toast = useToast();

  const onLogin = async () => {
    try {
      await doLogin(qrData);
      onClose();
    } catch (error) {
      console.log(error);
      toast({ title: "Failed to Login", status: "error" });
    } finally {
      setQrData("");
    }
  };
  return (
    <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={() => {}}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Login</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box>
            <FormLabel>QR Data</FormLabel>
            <Input
              defaultValue={qrData}
              onChange={(e) => setQrData(e.target.value)}
              disabled={isLoggingIn}
            />
          </Box>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="teal"
            mr={3}
            onClick={onLogin}
            disabled={isLoggingIn && !qrData}
          >
            {isLoggingIn && <Spinner />}
            {!isLoggingIn && "Login"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ModalQR;
