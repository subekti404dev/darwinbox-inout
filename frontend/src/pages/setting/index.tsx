/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Button,
  Card,
  Divider,
  FormControl,
  FormLabel,
  Input,
  Select,
  Spinner,
  Switch,
  useToast,
} from "@chakra-ui/react";
import { useConfigStore } from "../../store/config.store";
import { format } from "date-fns";
import { useEffect, useState } from "react";

const SettingPage = () => {
  const [config, doUpdate, isUpdating] = useConfigStore((store) => [
    store.config,
    store.doUpdate,
    store.isUpdating,
  ]);
  const [payload, setPayload] = useState<any>({});
  const toast = useToast();

  useEffect(() => {
    const payload = mapConfigToPayload(config);
    setPayload(payload);
  }, [config]);

  useEffect(() => {
    console.log(payload);
  }, [payload]);

  const expires = format(new Date(config.expires * 1000), "yyyy-MM-dd");
  const parseCron = (cron = "") => {
    const cronInArr = cron.split(" ");
    if (cronInArr.length === 0) {
      return undefined;
    }
    const min =
      cronInArr?.[0]?.length === 1 ? `0${cronInArr?.[0]}` : cronInArr?.[0];
    const hour =
      cronInArr?.[1]?.length === 1 ? `0${cronInArr?.[1]}` : cronInArr?.[1];
    return `${hour}:${min}`;
  };
  const formatCron = (time = "") => {
    const timeArr = time.split(":");
    if (timeArr.length < 2) return null;
    return `${timeArr[1]} ${timeArr[0]} * * *`;
  };

  const mapConfigToPayload = (cfg: any) => {
    return {
      in: {
        type: cfg?.in?.type,
        location: cfg?.in?.location,
        latlng: cfg?.in?.latlng,
        message: cfg?.in?.message,
      },
      out: {
        type: cfg?.out?.type,
        location: cfg?.out?.location,
        latlng: cfg?.out?.latlng,
        message: cfg?.out?.message,
      },
      cronIn: cfg?.cronIn,
      cronOut: cfg?.cronOut,
      scheduler: cfg?.scheduler || false,
    };
  };

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
          <Select
            disabled={isUpdating}
            value={payload?.in?.type}
            onChange={(e) => {
              setPayload((p: any) => ({
                ...p,
                in: { ...(p.in || {}), type: parseInt(e.target.value) },
              }));
            }}
          >
            <option value={1}>Office</option>
            <option value={2}>Home</option>
            <option value={3}>Field Duty</option>
          </Select>
        </FormControl>
        <FormControl mt={4}>
          <FormLabel color={"grey"}>Location</FormLabel>
          <Input
            disabled={isUpdating}
            value={payload?.in?.location}
            onChange={(e) => {
              setPayload((p: any) => ({
                ...p,
                in: { ...(p.in || {}), location: e.target.value },
              }));
            }}
          />
        </FormControl>
        <FormControl mt={4}>
          <FormLabel color={"grey"}>Latlong</FormLabel>
          <Input
            disabled={isUpdating}
            value={payload?.in?.latlng}
            onChange={(e) => {
              setPayload((p: any) => ({
                ...p,
                in: { ...(p.in || {}), latlng: e.target.value },
              }));
            }}
          />
        </FormControl>
        <FormControl mt={4}>
          <FormLabel color={"grey"}>Message</FormLabel>
          <Input
            disabled={isUpdating}
            value={payload?.in?.message}
            onChange={(e) => {
              setPayload((p: any) => ({
                ...p,
                in: { ...(p.in || {}), message: e.target.value },
              }));
            }}
          />
        </FormControl>
        <FormControl mt={4}>
          <FormLabel color={"grey"}>Time</FormLabel>
          <Input
            disabled={isUpdating}
            type="time"
            colorScheme="teal"
            value={parseCron(payload?.cronIn)}
            onChange={(e) => {
              setPayload((p: any) => ({
                ...p,
                cronIn: formatCron(e.target.value),
              }));
            }}
          />
        </FormControl>

        <Divider mt={6} color={"grey"} />
        <Box mt={4} fontWeight={500} fontSize={18} color={"grey"}>
          Clockout
        </Box>
        <FormControl mt={4}>
          <FormLabel color={"grey"}>Location Type</FormLabel>
          <Select
            disabled={isUpdating}
            value={payload?.out?.type}
            onChange={(e) => {
              setPayload((p: any) => ({
                ...p,
                out: { ...(p.out || {}), type: parseInt(e.target.value) },
              }));
            }}
          >
            <option value={1}>Office</option>
            <option value={2}>Home</option>
            <option value={3}>Field Duty</option>
          </Select>
        </FormControl>
        <FormControl mt={4}>
          <FormLabel color={"grey"}>Location</FormLabel>
          <Input
            disabled={isUpdating}
            value={payload?.out?.location}
            onChange={(e) => {
              setPayload((p: any) => ({
                ...p,
                out: { ...(p.out || {}), location: e.target.value },
              }));
            }}
          />
        </FormControl>
        <FormControl mt={4}>
          <FormLabel color={"grey"}>Latlong</FormLabel>
          <Input
            disabled={isUpdating}
            value={payload?.out?.latlng}
            onChange={(e) => {
              setPayload((p: any) => ({
                ...p,
                out: { ...(p.out || {}), latlng: e.target.value },
              }));
            }}
          />
        </FormControl>
        <FormControl mt={4}>
          <FormLabel color={"grey"}>Message</FormLabel>
          <Input
            disabled={isUpdating}
            value={payload?.out?.message}
            onChange={(e) => {
              setPayload((p: any) => ({
                ...p,
                out: { ...(p.out || {}), message: e.target.value },
              }));
            }}
          />
        </FormControl>
        <FormControl mt={4}>
          <FormLabel color={"grey"}>Time</FormLabel>
          <Input
            disabled={isUpdating}
            type="time"
            colorScheme="teal"
            value={parseCron(payload.cronOut)}
            onChange={(e) => {
              setPayload((p: any) => ({
                ...p,
                cronOut: formatCron(e.target.value),
              }));
            }}
          />
        </FormControl>
        <Divider mt={6} color={"grey"} />
        <FormControl mt={4}>
          <FormLabel color={"grey"}>Scheduler</FormLabel>
          <Switch
            disabled={isUpdating || !payload.cronIn || !payload.cronOut}
            size="md"
            colorScheme="teal"
            isChecked={payload.scheduler}
            onChange={(e) => {
              setPayload((p: any) => ({
                ...p,
                scheduler: e.target.checked,
              }));
            }}
          />
        </FormControl>
        <Box mt={6}>
          <Button
            colorScheme="teal"
            disabled={isUpdating}
            onClick={async () => {
              try {
                await doUpdate(payload);
                toast({ title: "Update Successfully", status: "success" });
              } catch (error) {
                toast({ title: "Update Failed", status: "error" });
              }
            }}
          >
            {isUpdating ? <Spinner /> : "Save"}
          </Button>
        </Box>
      </Card>
    </Box>
  );
};

export default SettingPage;
