import {
  Box,
  Button,
  Card,
  Divider,
  FormControl,
  FormLabel,
  Input,
  Select,
  Switch,
} from "@chakra-ui/react";
import { useConfigStore } from "../../store/config.store";
import { format } from "date-fns";

const SettingPage = () => {
  const [config] = useConfigStore((store) => [store.config]);

  const expires = format(new Date(config.expires * 1000), "yyyy-MM-dd");

  return (
    <Box>
      <div>Setting</div>
      <Card marginTop={2} padding={8}>
        <FormControl>
          <FormLabel color={"grey"}>Token</FormLabel>
          <Input disabled value={config.token} />
        </FormControl>
        <FormControl mt={4}>
          <FormLabel color={"grey"}>Expires</FormLabel>
          <Input disabled value={expires} />
        </FormControl>
        <Divider mt={6} color={"grey"} />
        <Box mt={4} fontWeight={500} fontSize={18} color={"grey"}>
          Clockin
        </Box>
        <FormControl mt={4}>
          <FormLabel color={"grey"}>Location Type</FormLabel>
          <Select value={config.in.type}>
            <option value={1}>Office</option>
            <option value={2}>Home</option>
            <option value={3}>On Duty</option>
          </Select>
        </FormControl>
        <FormControl mt={4}>
          <FormLabel color={"grey"}>Location</FormLabel>
          <Input value={config.in.location} />
        </FormControl>
        <FormControl mt={4}>
          <FormLabel color={"grey"}>Latlong</FormLabel>
          <Input value={config.in.latlng} />
        </FormControl>
        <FormControl mt={4}>
          <FormLabel color={"grey"}>Message</FormLabel>
          <Input value={config.in.message} />
        </FormControl>

        <Divider mt={6} color={"grey"} />
        <Box mt={4} fontWeight={500} fontSize={18} color={"grey"}>
          Clockout
        </Box>
        <FormControl mt={4}>
          <FormLabel color={"grey"}>Location Type</FormLabel>
          <Select value={config.out.type}>
            <option value={1}>Office</option>
            <option value={2}>Home</option>
            <option value={3}>On Duty</option>
          </Select>
        </FormControl>
        <FormControl mt={4}>
          <FormLabel color={"grey"}>Location</FormLabel>
          <Input value={config.out.location} />
        </FormControl>
        <FormControl mt={4}>
          <FormLabel color={"grey"}>Latlong</FormLabel>
          <Input value={config.out.latlng} />
        </FormControl>
        <FormControl mt={4}>
          <FormLabel color={"grey"}>Message</FormLabel>
          <Input value={config.out.message} />
        </FormControl>
        <Divider mt={6} color={"grey"} />
        <FormControl mt={4}>
          <FormLabel color={"grey"}>Scheduler</FormLabel>
          <Switch size="md" />
        </FormControl>
        <Box mt={6}>
          <Button colorScheme="teal">Save</Button>
        </Box>
      </Card>
    </Box>
  );
};

export default SettingPage;
