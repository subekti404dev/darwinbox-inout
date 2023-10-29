import {
  Box,
  Card,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useHistoryStore } from "../../store/history.store";
import { useEffect } from "react";

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
                    return (
                      <Tr key={i}>
                        <Td>{d.date}</Td>
                        <Td>{d.type}</Td>
                        <Td>
                          <div>
                            <div>{d.locationType}</div>
                            <div>{d.location}</div>
                            <div>{d.latlng}</div>
                          </div>
                        </Td>
                        <Td>{d.message}</Td>
                        <Td>{d.status}</Td>
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
