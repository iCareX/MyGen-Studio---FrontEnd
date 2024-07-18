import {
  ActionIcon,
  Alert,
  Box,
  Button,
  Divider,
  Drawer,
  FileInput,
  Flex,
  Group,
  LoadingOverlay,
  Paper,
  rem,
  Select,
  SimpleGrid,
  Stack,
  Text,
} from "@mantine/core";
import { IconCircleCheck, IconCircleX, IconInfoCircle, IconRefresh, IconReport, IconSend, IconUpload, IconX } from "@tabler/icons-react";
import { Dropzone, MS_EXCEL_MIME_TYPE } from "@mantine/dropzone";
import { useState } from "react";
import { toast } from "react-toastify";
import readXlsxFile from "read-excel-file";
import Spreadsheet from "react-spreadsheet";

export default function ExcelUpload(props) {
  const { originFiles, setOriginFiles, convertedFiles, setConvertedFiles, options, fields, setFields, handleFieldChange, handleConfirm } = props;
  const [loading, setLoading] = useState(false);

  // const handleCheckValue = (value) => {
  //   const labelSet = new Set(originFiles.map((item) => item[0].toLowerCase()));
  //   let requiredLabels = [];
  //   if (typeof value === "string") requiredLabels = [value];
  //   else requiredLabels = value;
  //   const checkStatus = requiredLabels.every((label) => labelSet.has(label));

  //   return checkStatus;
  // };

  const handleFileDrop = (acceptedFiles) => {
    readXlsxFile(acceptedFiles[0]).then((res) => {
      setOriginFiles(res);

      const data = res.map((item) => {
        return [
          { value: item[0], readOnly: true },
          { value: item[1], readOnly: true },
          { value: item[2], readOnly: true },
          { value: item[3], readOnly: true },
          { value: item[4], readOnly: true },
        ];
      });
      setFields(
        data.map((item) => ({
          skills: item[0].value ? item[0].value : 0,
          punteggio: item[1].value ? item[1].value : 0,
          punteggio_a: item[2].value ? item[2].value : 0,
          punteggio_b: item[3].value ? item[3].value : 0,
          punteggio_c: item[4].value ? item[4].value : 0,
        }))
      );
      setConvertedFiles(data);
    });
  };

  const columnLabels = ["Skills", "Total Score", "A", "B", "C"];
  return (
    <Box pos="relative" w={"100%"}>
      <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} loaderProps={{ color: "pink", type: "dots" }} />
      <Paper w={"100%"} mt={"lg"}>
        {convertedFiles && convertedFiles.length > 0 && (
          <Flex align={"center"} justify={"space-between"}>
            <Alert variant="light" color="green" title={`You can see all data correctly!`} icon={<IconCircleCheck />} />
            {/* {handleCheckValue(["capacity", "a", "b", "c", "total score"]) ? (
              <Alert variant="light" color="green" title={`You can see all data correctly!`} icon={<IconCircleCheck />} />
            ) : (
              <Alert variant="light" color="orange" title={`Some data missed in Excel!`} icon={<IconInfoCircle />} />
            )} */}
            <Flex gap={"sm"}>
              <Button leftSection={<IconSend size={"0.9rem"} />} variant="outline" onClick={handleConfirm}>
                Confirm
              </Button>
              <Button
                color="red"
                variant="outline"
                leftSection={<IconRefresh size={"1rem"} />}
                onClick={() => {
                  setOriginFiles();
                  setConvertedFiles();
                }}
              >
                Refresh
              </Button>
            </Flex>
          </Flex>
        )}
        {convertedFiles && convertedFiles.length > 0 ? (
          <Box mt={"sm"}>
            <Flex w={"100%"} gap={"xl"} mt={"sm"}>
              <Flex gap={30}>
                <Spreadsheet data={convertedFiles} columnLabels={columnLabels} />
                {/* <Paper p={"sm"} radius={"sm"} withBorder miw={300} h={"fit-content"}>
                  <Stack gap={"sm"}>
                    <Flex align={"center"} justify={"space-between"}>
                      <Text size="xl" fw={700}>
                        Capactiy
                      </Text>
                      {handleCheckValue("capacity") ? (
                        <IconCircleCheck fill="green" color="white" size={"2rem"} />
                      ) : (
                        <IconCircleX fill="red" color="white" size={"2rem"} />
                      )}
                    </Flex>
                    <Flex align={"center"} justify={"space-between"}>
                      <Text size="xl" fw={700}>
                        A
                      </Text>
                      {handleCheckValue("a") ? (
                        <IconCircleCheck fill="green" color="white" size={"2rem"} />
                      ) : (
                        <IconCircleX fill="red" color="white" size={"2rem"} />
                      )}
                    </Flex>
                    <Flex align={"center"} justify={"space-between"}>
                      <Text size="xl" fw={700}>
                        B
                      </Text>
                      {handleCheckValue("b") ? (
                        <IconCircleCheck fill="green" color="white" size={"2rem"} />
                      ) : (
                        <IconCircleX fill="red" color="white" size={"2rem"} />
                      )}
                    </Flex>
                    <Flex align={"center"} justify={"space-between"}>
                      <Text size="xl" fw={700}>
                        C
                      </Text>
                      {handleCheckValue("c") ? (
                        <IconCircleCheck fill="green" color="white" size={"2rem"} />
                      ) : (
                        <IconCircleX fill="red" color="white" size={"2rem"} />
                      )}
                    </Flex>
                    <Flex align={"center"} justify={"space-between"}>
                      <Text size="xl" fw={700}>
                        Total Score
                      </Text>
                      {handleCheckValue("total score") ? (
                        <IconCircleCheck fill="green" color="white" size={"2rem"} />
                      ) : (
                        <IconCircleX fill="red" color="white" size={"2rem"} />
                      )}
                    </Flex>
                  </Stack>
                </Paper> */}
              </Flex>
            </Flex>
          </Box>
        ) : (
          <Dropzone
            mx={"auto"}
            mt={"lg"}
            onDrop={handleFileDrop}
            onReject={(files) => toast.error(`${files.length} files rejected due to wrong size/type`)}
            maxSize={5 * 1024 ** 2}
            accept={{ MS_EXCEL_MIME_TYPE }}
            styles={{
              inner: {
                padding: "44px",
              },
            }}
          >
            <Group justify="center" gap="xl" style={{ pointerEvents: "none" }}>
              <Dropzone.Accept>
                <IconUpload style={{ width: rem(52), height: rem(52), color: "var(--mantine-color-blue-6)" }} stroke={1.5} />
              </Dropzone.Accept>
              <Dropzone.Reject>
                <IconX style={{ width: rem(52), height: rem(52), color: "var(--mantine-color-red-6)" }} stroke={1.5} />
              </Dropzone.Reject>
              <Dropzone.Idle>
                <IconReport style={{ width: rem(52), height: rem(52), color: "var(--mantine-color-dimmed)" }} stroke={1.5} />
              </Dropzone.Idle>

              <div>
                <Text size="xl">In this step, you can Upload Excel what you want extract the information</Text>
                <Text size="sm" c="dimmed" mt={7}>
                  Attach as many files as you like, each file should not exceed 5mb
                </Text>
              </div>
            </Group>
          </Dropzone>
        )}
      </Paper>
    </Box>
  );
}
