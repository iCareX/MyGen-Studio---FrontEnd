import { ActionIcon, Alert, Box, Button, Divider, Drawer, FileInput, Flex, Group, LoadingOverlay, Paper, rem, SimpleGrid, Text } from "@mantine/core";
import {
  IconCircleCheck,
  IconEye,
  IconFileTypeJpg,
  IconFileTypePdf,
  IconFileTypePng,
  IconPlus,
  IconReport,
  IconTrash,
  IconUpload,
  IconX,
} from "@tabler/icons-react";
import { Dropzone, IMAGE_MIME_TYPE, PDF_MIME_TYPE } from "@mantine/dropzone";
import { useRef, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { toast } from "react-toastify";
// import { handleUpload } from "@/app/utils/apis";
import { formatFileSize } from "../../apis/simpleAPI";
import PdfViewer from "./pdfViewer";
import axios from "axios";

export default function PDFUpload() {
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);

  const [originFiles, setOriginFiles] = useState();
  const [add, setAdd] = useState();

  const [addMoreFiles, setAddMoreFiles] = useState();
  const [files, setFiles] = useState(null);

  const [result, setResult] = useState("");

  const handleFileUpload = async () => {
    setLoading(true);
    const formData = new FormData();
    let newArray;
    if (addMoreFiles) newArray = originFiles.concat(addMoreFiles);
    else newArray = originFiles;
    for (let i = 0; i < newArray.length; i++) {
      formData.append("files", newArray[i]);
    }
    console.log(formData);
    try {
      const response = await axios.post("https://d918-34-46-17-178.ngrok-free.app/process", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setResult(JSON.stringify(response.data, null, 2));
      setLoading(false);
    } catch (error) {
      console.error("Error uploading files:", error);
      setLoading(false);
    }

    // await handleUpload(formData)
    //   .then((res) => {
    //     const response = res.data;
    //     toast.success(response.message);
    //     setData(response.allS3Keys);
    //     setLoading(false);
    //     if (response.allS3Keys && response.allS3Keys.length > 0) nextStep();
    //   })
    //   .catch((err) => {
    //     console.log("---err", err);
    //     setLoading(false);
    //   });
  };

  const handleMultiFilesDrop = (acceptedFiles) => {
    setOriginFiles(acceptedFiles);
  };

  const handleAddMoreFilesUpload = (acceptedFiles) => {
    setAdd(true);
    setAddMoreFiles(acceptedFiles);
  };

  const handlePreviewPDF = (id) => {
    const pdfFile = URL.createObjectURL(originFiles[id]);
    setFiles(pdfFile);
    open();
  };

  return (
    <Box pos="relative" w={"100%"}>
      <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} loaderProps={{ color: "pink", type: "dots" }} />
      <Paper w={"100%"} p={"xl"}>
        {originFiles && originFiles.length > 0 && (
          <Flex justify={"space-between"} align={{ base: "start", sm: "center" }} gap={"sm"} direction={{ base: "column-reverse", sm: "row" }}>
            <Alert
              variant="light"
              color="green"
              title={`You uploaded ${(originFiles && originFiles.length) + (addMoreFiles && addMoreFiles.length)} files successfully`}
              icon={<IconCircleCheck />}
              w={{ base: "100%", sm: "fit-content" }}
            />
            <Flex gap={"md"}>
              <Button color="gray" variant="outline" onClick={() => fileInputRef.current.click()} disabled={add && addMoreFiles && addMoreFiles.length > 0}>
                Add More
              </Button>
              <div className="hidden">
                <FileInput
                  accept="image/*, application/pdf, application/docx"
                  label="Upload files"
                  placeholder="Upload files"
                  multiple
                  clearable
                  ref={fileInputRef}
                  onChange={handleAddMoreFilesUpload}
                />
              </div>
              <Button color="green" variant="outline" onClick={handleFileUpload}>
                Upload All
              </Button>
              <Button
                color="red"
                variant="outline"
                //   disabled={originFiles.length < 2}
                onClick={() => {
                  setOriginFiles();
                  setAddMoreFiles();
                }}
              >
                Remove all
              </Button>
            </Flex>
          </Flex>
        )}

        <Flex w={"100%"} gap={"xl"}>
          <Drawer opened={opened} onClose={close} title="PDF Details View" position="right" size="700">
            <Flex justify={"center"}>
              <PdfViewer key={`pdf-viewer-${Date.now()}`} pdf={files} visible={true} setFiles={setFiles} type={"multi"} />
            </Flex>
          </Drawer>
          {originFiles && originFiles.length > 0 ? (
            <Box w={"100%"}>
              <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} w={"100%"} mt={"lg"}>
                {originFiles
                  .sort((a, b) => {
                    const nameA = a.type.split("/")[1].toUpperCase();
                    const nameB = b.type.split("/")[1].toUpperCase();
                    if (nameA < nameB) {
                      return -1;
                    }
                    if (nameA > nameB) {
                      return 1;
                    }

                    return 0;
                  })
                  .map((item, index) => {
                    return (
                      <Paper withBorder p={"sm"} radius={"sm"} shadow="sm" key={index}>
                        <Flex align={"center"} h={"100%"}>
                          <Box>
                            {item.type === "application/pdf" ? (
                              <IconFileTypePdf color="#40c057" size={"7rem"} stroke={"1.3"} />
                            ) : item.type?.split("/")[1] === "png" ? (
                              <IconFileTypePng color="#228be6" size={"7rem"} stroke={"1.3"} />
                            ) : item.type?.split("/")[1] === "jpeg" ? (
                              <IconFileTypeJpg color="orange" size={"7rem"} stroke={"1.3"} />
                            ) : (
                              <></>
                            )}
                          </Box>
                          <Flex h={"100%"} direction={"column"} justify={"space-evenly"} w={"100%"}>
                            <Text fw={600} size="md" lineClamp={1}>
                              {item.name.split(".")[0]}
                            </Text>
                            <Text size="sm">
                              Type: <span className=" uppercase">{item.type.split("/")[1]}</span>
                            </Text>
                            <Flex align={"center"} justify={"space-between"}>
                              <Text size="sm">size: {formatFileSize(item.size)}</Text>
                              <Flex>
                                <ActionIcon
                                  onClick={() => {
                                    if (item.type === "application/pdf") handlePreviewPDF(index);
                                  }}
                                  variant="transparent"
                                >
                                  <IconEye size={"1.2rem"} color="#228be6" />
                                </ActionIcon>
                                <ActionIcon
                                  color="red"
                                  variant="transparent"
                                  onClick={() => {
                                    if (originFiles.length === 2) {
                                      toast.warn("Uploaded Files must over 2 files at least!");
                                    } else setOriginFiles(originFiles.filter((_, i) => i !== index));
                                  }}
                                >
                                  <IconTrash size={"1.2rem"} color="red" />
                                </ActionIcon>
                              </Flex>
                            </Flex>
                          </Flex>
                        </Flex>
                      </Paper>
                    );
                  })}
              </SimpleGrid>
              {addMoreFiles && addMoreFiles.length > 0 && (
                <>
                  <Divider label="Added Files" mt={"xl"} labelPosition="left" color="#228be6" variant="dashed" left={<IconPlus size={"0.9rem"} />} />
                  <SimpleGrid cols={3} w={"100%"} mt={"lg"}>
                    {addMoreFiles
                      .sort((a, b) => {
                        const nameA = a.type.split("/")[1].toUpperCase();
                        const nameB = b.type.split("/")[1].toUpperCase();
                        if (nameA < nameB) {
                          return -1;
                        }
                        if (nameA > nameB) {
                          return 1;
                        }

                        return 0;
                      })
                      .map((item, index) => {
                        return (
                          <Paper withBorder p={"sm"} radius={"sm"} shadow="sm" key={index}>
                            <Flex align={"center"} h={"100%"}>
                              <Box>
                                {item.type === "application/pdf" ? (
                                  <IconFileTypePdf color="#40c057" size={"7rem"} stroke={"1.3"} />
                                ) : item.type?.split("/")[1] === "png" ? (
                                  <IconFileTypePng color="#228be6" size={"7rem"} stroke={"1.3"} />
                                ) : item.type?.split("/")[1] === "jpeg" ? (
                                  <IconFileTypeJpg color="orange" size={"7rem"} stroke={"1.3"} />
                                ) : (
                                  <></>
                                )}
                              </Box>
                              <Flex h={"100%"} direction={"column"} justify={"space-evenly"} w={"100%"}>
                                <Text fw={600} size="md" lineClamp={1}>
                                  {item.name.split(".")[0]}
                                </Text>
                                <Text size="sm">
                                  Type: <span className=" uppercase">{item.type.split("/")[1]}</span>
                                </Text>
                                <Flex align={"center"} justify={"space-between"}>
                                  <Text size="sm">size: {formatFileSize(item.size)}</Text>
                                  <Flex>
                                    <ActionIcon
                                      onClick={() => {
                                        if (item.type === "application/pdf") handlePreviewPDF(index);
                                      }}
                                      variant="transparent"
                                    >
                                      <IconEye size={"1.2rem"} color="#228be6" />
                                    </ActionIcon>
                                    <ActionIcon
                                      color="red"
                                      variant="transparent"
                                      onClick={() => {
                                        setAddMoreFiles(addMoreFiles.filter((_, i) => i !== index));
                                      }}
                                    >
                                      <IconTrash size={"1.2rem"} color="red" />
                                    </ActionIcon>
                                  </Flex>
                                </Flex>
                              </Flex>
                            </Flex>
                          </Paper>
                        );
                      })}
                  </SimpleGrid>
                </>
              )}
            </Box>
          ) : (
            <Dropzone
              mx={"auto"}
              mt={"lg"}
              multiple={true}
              onDrop={handleMultiFilesDrop}
              onReject={(files) => toast.error(`${files.length} files rejected due to wrong size/type`)}
              maxSize={5 * 1024 ** 2}
              accept={{ PDF_MIME_TYPE }}
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
                  <Text size="xl">
                    In this step, you can Upload <span className=" font-bold text-[24px] mr-1">Multiple</span>PDFs what you want scanning
                  </Text>
                  <Text size="sm" c="dimmed" mt={7}>
                    Attach as many files as you like, each file should not exceed 5mb
                  </Text>
                </div>
              </Group>
            </Dropzone>
          )}
        </Flex>
        <pre>{result}</pre>
      </Paper>
    </Box>
  );
}
