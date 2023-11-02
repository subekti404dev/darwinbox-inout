import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Box,
  Input,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { useFlagsStore } from "../../store/flags.store";

interface IModalPassword {
  isOpen: boolean;
}

const ModalPassword = ({ isOpen }: IModalPassword) => {
  const [pass, setPass] = useState("");
  const [isLoggingIn, doLogin] = useFlagsStore((store) => [
    store.isVerifying,
    store.verifyPass,
  ]);
  const toast = useToast();

  const onLogin = async () => {
    try {
      await doLogin(pass);
    } catch (error) {
      console.log(error);
      toast({ title: "Failed to Login", status: "error" });
    } finally {
      setPass("");
    }
  };
  return (
    <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={() => {}}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Password</ModalHeader>
        <ModalBody>
          <Box>
            <Input
              defaultValue={pass}
              onChange={(e) => setPass(e.target.value)}
              disabled={isLoggingIn}
            />
          </Box>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="teal"
            mr={3}
            onClick={onLogin}
            disabled={isLoggingIn && !pass}
          >
            {isLoggingIn && <Spinner />}
            {!isLoggingIn && "Login"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ModalPassword;
