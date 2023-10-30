import {
  Box,
  Card,
  Spinner,
  Table,
  TableContainer,
  Tag,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useHistoryStore } from "../../store/history.store";
import { useEffect } from "react";
import { format } from "date-fns";

const HistoryPage = () => {
  const [loading, histories, fetchData] = useHistoryStore((store) => [
    store.loading,
    store.histories,
    store.fetchData,
  ]);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Box>
      <Box>
        <div>History</div>
        <Card marginTop={2} padding={8}>
          {loading && (
            <Box
              width={"100%"}
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <Spinner />
            </Box>
          )}
          {!loading && (
            <TableContainer>
              <Table variant={"striped"}>
                <Thead>
                  <Tr>
                    <Th>Date</Th>
                    <Th>Type</Th>
                    <Th>Location</Th>
                    <Th>Message</Th>
                    <Th>Status</Th>
                    <Th>Err Msg</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {histories.map((d, i) => {
                    let locationType = "Field Duty";
                    if (d.location_type === 1) locationType = "Office";
                    if (d.location_type === 2) locationType = "Home";
                    return (
                      <Tr key={i}>
                        <Td>
                          {format(new Date(d.date), "yyyy-MM-dd HH:mm:ss")}
                        </Td>
                        <Td>
                          {d.type === "checkin" ? (
                            <Tag colorScheme="orange">
                              {d.type?.toUpperCase()}
                            </Tag>
                          ) : (
                            <Tag colorScheme="green">
                              {d.type?.toUpperCase()}
                            </Tag>
                          )}
                        </Td>
                        <Td>
                          <div>
                            <div>
                              <Tag colorScheme="purple">{locationType}</Tag>
                            </div>
                            <div>{d.location}</div>
                            <Box fontSize={14} color={"grey"}>
                              {d.latlng}
                            </Box>
                          </div>
                        </Td>
                        <Td>{d.message}</Td>
                        <Td>
                          {d.status === 200 ? (
                            <Tag colorScheme="teal">Suuccess</Tag>
                          ) : (
                            <Tag colorScheme="red">Failed</Tag>
                          )}
                        </Td>
                        <Td>{d.errMsg}</Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
              {histories.length === 0 && (
                <Box
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  width={"100%"}
                  height={200}
                >
                  No Data
                </Box>
              )}
            </TableContainer>
          )}
        </Card>
      </Box>
    </Box>
  );
};

export default HistoryPage;
