/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Button,
  Card,
  CloseButton,
  Divider,
  FormControl,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputRightAddon,
  Select,
  SimpleGrid,
  Spinner,
  Switch,
  Tag,
  TagCloseButton,
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
  const [tmpHolidayDate, setTmpHoidayDate] = useState<any>();
  const [tmpDelay, setTmpDelay] = useState<any>(0);
  const [tmpLocation, setTmpLocation] = useState<any>({ type: 2 });
  const [holidays, setHolidays] = useState<any>([]);
  const toast = useToast();

  useEffect(() => {
    const payload = mapConfigToPayload(config);
    setPayload(payload);
  }, [config]);

  // useEffect(() => {
  //   console.log(tmpLocation);
  // }, [tmpLocation]);

  useEffect(() => {
    setPayload((p: any) => ({ ...p, holidays }));
  }, [holidays]);

  useEffect(() => {
    setPayload((p: any) => ({ ...p, delay: tmpDelay * 60 * 1000 }));
  }, [tmpDelay]);

  const expires = format(new Date(config.expires * 1000), "yyyy-MM-dd");
  const parseCron = (cron = "") => {
    const cronInArr = cron?.split(" ");
    if (cronInArr?.length === 0) {
      return undefined;
    }
    const min =
      cronInArr?.[0]?.length === 1 ? `0${cronInArr?.[0]}` : cronInArr?.[0];
    const hour =
      cronInArr?.[1]?.length === 1 ? `0${cronInArr?.[1]}` : cronInArr?.[1];
    return `${hour}:${min}`;
  };
  const formatCron = (time = "") => {
    const timeArr = time?.split(":");
    if (timeArr?.length < 2) return null;
    return `${timeArr[1]} ${timeArr[0]} * * *`;
  };

  const mapConfigToPayload = (cfg: any) => {
    setHolidays(cfg?.holidays || []);
    setTmpDelay((cfg?.delay || 0) / (1000 * 60));
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
      randomizeDelay: cfg?.randomizeDelay || false,
      randomizeLocation: cfg?.randomizeLocation || false,
      locations: cfg?.locations || [],
      telegramBot: cfg?.telegramBot,
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

        {!payload.randomizeLocation && (
          <>
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
              <FormLabel color={"grey"}>Location Name</FormLabel>
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
          </>
        )}
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
        {!payload.randomizeLocation && (
          <>
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
              <FormLabel color={"grey"}>Location Name</FormLabel>
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
          </>
        )}
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
          <Box mb={2}>
            {(holidays || []).map((d: string, i: number) => (
              <Tag mr={1} mb={1} colorScheme="green" key={i}>
                {d}
                <TagCloseButton
                  onClick={() => {
                    setHolidays((h: any) => {
                      return h?.filter((x: any) => x !== d);
                    });
                  }}
                />
              </Tag>
            ))}
          </Box>
          <FormLabel color={"grey"}>Holidays</FormLabel>
          <Input
            disabled={isUpdating}
            type="date"
            colorScheme="teal"
            onChange={(e) => {
              setTmpHoidayDate(e.target.value);
            }}
          />
          <Button
            mt={2}
            colorScheme="teal"
            variant={"outline"}
            isDisabled={!tmpHolidayDate}
            onClick={() => {
              if (tmpHolidayDate) {
                console.log("do", tmpHolidayDate);
                if (!holidays.includes(tmpHolidayDate)) {
                  setHolidays((h: never[]) => [...h, tmpHolidayDate]);
                }
              }
            }}
          >
            Add
          </Button>
        </FormControl>
        <Divider mt={6} color={"grey"} />
        <FormControl mt={4}>
          <FormLabel color={"grey"}>Randomize Delay</FormLabel>
          <Switch
            disabled={isUpdating}
            size="md"
            colorScheme="teal"
            isChecked={payload.randomizeDelay}
            onChange={(e) => {
              setPayload((p: any) => ({
                ...p,
                randomizeDelay: e.target.checked,
              }));
            }}
          />
          {payload.randomizeDelay && (
            <>
              <FormLabel color={"grey"}>Max Delay</FormLabel>

              <InputGroup mt={2}>
                <Input
                  type="number"
                  value={tmpDelay}
                  onChange={(e) => setTmpDelay(e.target.value)}
                />
                <InputRightAddon children={"menit"} />
              </InputGroup>
            </>
          )}
        </FormControl>
        <Divider mt={6} color={"grey"} />

        <FormControl mt={4}>
          <FormLabel color={"grey"}>Randomize Location</FormLabel>
          <Switch
            disabled={isUpdating}
            size="md"
            colorScheme="teal"
            isChecked={payload.randomizeLocation}
            onChange={(e) => {
              setPayload((p: any) => ({
                ...p,
                randomizeLocation: e.target.checked,
              }));
            }}
          />
          {payload.randomizeLocation && (
            <>
              <SimpleGrid columns={[1, 2, 3, 4]} spacing={"4px"} mt={2} mb={2}>
                {(payload.locations || []).map((l: any, i: number) => {
                  let type = "Office";
                  if (l.type === 2) type = "Home";
                  if (l.type === 3) type = "Field Duty";
                  return (
                    <Card key={i} p={4}>
                      <HStack>
                        <Tag size={"sm"} colorScheme="purple">
                          {type}
                        </Tag>
                        <Box flex={1} />
                        <CloseButton
                          onClick={() =>
                            setPayload((p: any) => ({
                              ...p,
                              locations: p.locations.filter(
                                (_: any, j: number) => j !== i
                              ),
                            }))
                          }
                        />
                      </HStack>
                      <div>{l.location}</div>
                      <Box fontSize={11} color={"grey"}>
                        {l.latlng}
                      </Box>
                    </Card>
                  );
                })}
              </SimpleGrid>

              <FormLabel color={"grey"}>New Location</FormLabel>

              <FormControl mt={4}>
                <FormLabel color={"grey"}>Location Type</FormLabel>
                <Select
                  disabled={isUpdating}
                  value={tmpLocation?.type || 2}
                  onChange={(e) => {
                    setTmpLocation((p: any) => ({
                      ...p,
                      type: parseInt(e.target.value),
                    }));
                  }}
                >
                  <option value={1}>Office</option>
                  <option value={2}>Home</option>
                  <option value={3}>Field Duty</option>
                </Select>
              </FormControl>
              <FormControl mt={4}>
                <FormLabel color={"grey"}>Location Name</FormLabel>
                <Input
                  disabled={isUpdating}
                  value={tmpLocation?.location || ""}
                  onChange={(e) => {
                    setTmpLocation((p: any) => ({
                      ...p,
                      location: e.target.value,
                    }));
                  }}
                />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel color={"grey"}>Latlong</FormLabel>
                <Input
                  disabled={isUpdating}
                  value={tmpLocation?.latlng || ""}
                  onChange={(e) => {
                    setTmpLocation((p: any) => ({
                      ...p,
                      latlng: e.target.value,
                    }));
                  }}
                />
              </FormControl>
              <Button
                mt={2}
                colorScheme="teal"
                variant={"outline"}
                isDisabled={
                  !tmpLocation.type ||
                  !tmpLocation.location ||
                  !tmpLocation.latlng
                }
                onClick={() => {
                  setPayload((p: any) => ({
                    ...p,
                    locations: [...p.locations, tmpLocation],
                  }));
                  setTmpLocation({ type: 2 });
                }}
              >
                Add
              </Button>
            </>
          )}
        </FormControl>

        <Divider mt={6} color={"grey"} />

        <FormControl mt={4}>
          <FormLabel color={"grey"}>Telegram Bot</FormLabel>
          <Switch
            disabled={isUpdating}
            size="md"
            colorScheme="teal"
            isChecked={payload.telegramBot?.enabled}
            onChange={(e) => {
              setPayload((p: any) => ({
                ...p,
                telegramBot: {
                  ...p.telegramBot,
                  enabled: e.target.checked,
                },
              }));
            }}
          />
          {payload.telegramBot?.enabled && (
            <>
              <FormControl mt={4}>
                <FormLabel color={"grey"}>Token</FormLabel>
                <Input
                  disabled={isUpdating}
                  value={payload.telegramBot?.token || ""}
                  onChange={(e) => {
                    setPayload((p: any) => ({
                      ...p,
                      telegramBot: {
                        ...p.telegramBot,
                        token: e.target.value,
                      },
                    }));
                  }}
                />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel color={"grey"}>Chat ID</FormLabel>
                <Input
                  disabled={isUpdating}
                  value={payload.telegramBot?.chatId || ""}
                  onChange={(e) => {
                    setPayload((p: any) => ({
                      ...p,
                      telegramBot: {
                        ...p.telegramBot,
                        chatId: e.target.value,
                      },
                    }));
                  }}
                />
              </FormControl>
            </>
          )}
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
            isDisabled={isUpdating}
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
