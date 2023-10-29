import {
  Box,
  Card,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

interface IData {
  date: string;
  locationType: number;
  location: string;
  latlng: string;
  message: string;
  type: string;
  status: number;
  errMsg?: string | null;
}
const data: IData[] = [
  {
    date: "2019-10-12T07:20:50.52Z",
    locationType: 1,
    location: "Starbuck",
    latlng: "168,7",
    message: "",
    type: "checkin",
    status: 200,
    errMsg: null,
  },
];

const HistoryPage = () => {
  return (
    <Box>
      <Card>
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
              {data.map((d, i) => {
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
        </TableContainer>
      </Card>
    </Box>
  );
};

export default HistoryPage;
