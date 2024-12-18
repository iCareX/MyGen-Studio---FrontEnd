import {
  ActionIcon,
  Box,
  Button,
  Center,
  Collapse,
  CopyButton,
  Divider,
  Flex,
  Loader,
  NumberInput,
  Paper,
  ScrollArea,
  SegmentedControl,
  Select,
  Text,
  Title,
  Tooltip,
  rem,
  useMantineColorScheme,
} from "@mantine/core";
import {
  IconCheck,
  IconChevronDown,
  IconChevronUp,
  IconCopy,
  IconList,
  IconPlus,
  IconSend,
  IconTrash,
} from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import {
  FastAssessmentAPI,
  FastAssessmentResultFastAPI,
} from "../apis/FastAssessmentAPI";
import moment from "moment/moment";
import ExcelUpload from "./ExcelUpload/excelUpload";
import BottomToTop from "../@utils/bottomTotop";

export default function FastAgentComponent() {
  const viewport = useRef(null);
  const { colorScheme } = useMantineColorScheme();

  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState([
    {
      skills: "",
      punteggio: "",
      punteggio_a: "",
      punteggio_b: "",
      punteggio_c: "",
    },
  ]);
  const [jobId, setJobId] = useState(null);
  const [results, setResults] = useState([]);

  const [intervalId, setInvetervalId] = useState();

  const [options, setOptions] = useState([
    "Problem solving",
    "Analisi",
    "Sintesi",
    "Pensiero sistemico",
    "Raccolta ed elaborazione delle informazioni",
    "Sviluppare le competenze",
    "Pensiero strategico",
    "Intelligenza sociale",
    "Comunicazione",
    "Integrazione / Collaborazione",
    "Team Working",
    "Comprensione e gestione dei bisogni",
    "Convincimento",
    "Negoziazione relazionale",
    "Gestione dei team",
    "People management",
    "Leadership",
    "Integrazione interfunzionale",
    "Programmazione",
    "Organizzazione",
    "Controllo",
    "Decisione",
    "Assunzione dei rischi",
    "Orientamento ai risultati",
    "Iniziativa",
    "Tenacia realizzativa",
    "Emotional control",
    "Gestione dei conflitti relazionali",
    "Gestione dell'incertezza e delle difficoltà",
    "Gestione del cambiamento",
    "Pensiero innovativo",
    "Pensiero anticipatorio",
  ]);

  const Color = [
    "blue",
    "green",
    "orange",
    "grape",
    "pink",
    "indigo",
    "cyan",
    "teal",
    "yellow",
  ];
  const [openedStates, setOpenedStates] = useState({});

  const handleAddField = () => {
    setFields([
      ...fields,
      {
        skills: "",
        punteggio: "",
        punteggio_a: "",
        punteggio_b: "",
        punteggio_c: "",
      },
    ]);
  };

  const handleFieldChange = (index, field, value) => {
    const newFields = fields.map((item, i) => {
      if (i === index) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setFields(newFields);
  };

  const handleRemoveSkills = (index) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const handleConfirm = async () => {
    viewport.current?.scrollTo({ top: viewport.current.scrollHeight });
    const skillDict = {};
    fields.forEach((field) => {
      skillDict[field.skills] = {
        punteggio: Number(field.punteggio),
        punteggio_a: Number(field.punteggio_a),
        punteggio_b: Number(field.punteggio_b),
        punteggio_c: Number(field.punteggio_c),
      };
    });

    const inputData = { skill_dict: skillDict };
    setLoading(true);
    try {
      const response = await FastAssessmentAPI(inputData);
      const jobId = response.data.job_id;
      setJobId(jobId);
      pollForResults(jobId);
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
      toast.error("Network Error");
    }
  };

  const pollForResults = (jobId) => {
    const interval = setInterval(async () => {
      try {
        const resultResponse = await FastAssessmentResultFastAPI(jobId);
        const resultData = resultResponse.data;
        if (resultData.status && resultData.status !== "pending") {
          clearInterval(interval);
          setResults((results) => [
            ...results,
            {
              assessment: resultData.assessment,
              total_cost: resultData.total_cost,
              date: moment().format("MM/DD/YYYY, h:mm:ss a"),
            },
          ]);
          setLoading(false);
        } else if (!resultData.status) {
          clearInterval(interval);
          setResults((results) => [
            ...results,
            {
              assessment: resultData.assessment,
              total_cost: resultData.total_cost,
              date: moment().format("MM/DD/YYYY, h:mm:ss a"),
            },
          ]);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error:", error);
        clearInterval(interval);
        setLoading(false);
        toast.error("Network Error");
      }
    }, 5000);
    setInvetervalId(interval);
  };

  const handleToggle = (index, key) => {
    const uniqueId = `${index}-${key}`;

    setOpenedStates((prevOpenedStates) => ({
      ...prevOpenedStates,
      [uniqueId]: !prevOpenedStates[uniqueId],
    }));
  };

  useEffect(() => {
    const initialStates = {};
    results.forEach((item, index) => {
      Object.keys(item.assessment).forEach((key) => {
        const uniqueId = `${index}-${key}`;
        initialStates[uniqueId] = true;
      });
    });
    setOpenedStates(initialStates);
  }, [results]);

  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

  useEffect(() => {
    viewport.current?.scrollTo({ top: viewport.current.scrollHeight });
  }, [results]);

  const [type, setType] = useState("manual");

  const [originFiles, setOriginFiles] = useState();
  const [convertedFiles, setConvertedFiles] = useState();

  const [scrollPosition, onScrollPositionChange] = useState({ x: 0, y: 0 });

  return (
    <Box w={"100%"} h={"100%"}>
      <ScrollArea
        viewportRef={viewport}
        scrollHideDelay={4000}
        className="h-[calc(100vh-64px)] relative"
        onScrollPositionChange={onScrollPositionChange}
      >
        <Paper p={"lg"} className="relative">
          <SegmentedControl
            size="sm"
            value={type}
            onChange={(value) => setType(value)}
            data={[
              {
                value: "manual",
                label: (
                  <Center>
                    <Box ml={10}>Manuale</Box>
                  </Center>
                ),
              },
              {
                value: "excel",
                label: (
                  <Center>
                    <Box ml={10}>Upload</Box>
                  </Center>
                ),
              },
            ]}
            mb={"sm"}
          />
          {type === "manual" ? (
            <Box>
              <Flex gap={"sm"} direction={"column"}>
                {fields.map((field, index) => {
                  const selectedSkills = fields.map((field) => field.skills);
                  const filteredOptions = options.filter(
                    (option) =>
                      !selectedSkills.includes(option) ||
                      option === field.skills
                  );
                  return (
                    <Flex
                      gap={"md"}
                      align={{ base: "start", md: "end" }}
                      key={index}
                      direction={{ base: "column", md: "row" }}
                    >
                      <Select
                        label="Your Skills"
                        data={filteredOptions}
                        placeholder="Pick value"
                        w={{ base: "100%", md: 600 }}
                        value={field.skills}
                        onChange={(value) =>
                          handleFieldChange(index, "skills", value)
                        }
                        styles={{
                          label: {
                            display: "flex",
                            justifyContent: "start",
                          },
                        }}
                      />
                      <Flex gap={"md"} w={"100%"}>
                        <NumberInput
                          placeholder="Tot."
                          value={field.punteggio}
                          onChange={(valueString) =>
                            handleFieldChange(index, "punteggio", valueString)
                          }
                          w={"100%"}
                        />
                        <NumberInput
                          placeholder="A"
                          value={field.punteggio_a}
                          onChange={(valueString) =>
                            handleFieldChange(index, "punteggio_a", valueString)
                          }
                          w={"100%"}
                        />
                        <NumberInput
                          placeholder="B"
                          value={field.punteggio_b}
                          onChange={(valueString) =>
                            handleFieldChange(index, "punteggio_b", valueString)
                          }
                          w={"100%"}
                        />
                        <NumberInput
                          placeholder="C"
                          value={field.punteggio_c}
                          onChange={(valueString) =>
                            handleFieldChange(index, "punteggio_c", valueString)
                          }
                          w={"100%"}
                        />
                      </Flex>
                      {fields.length > 1 && (
                        <ActionIcon
                          variant="outline"
                          color="red"
                          radius={"xl"}
                          mb={3}
                          withBorder
                          onClick={() => handleRemoveSkills(index)}
                        >
                          <IconTrash color="red" size={"1.2rem"} />
                        </ActionIcon>
                      )}
                    </Flex>
                  );
                })}
              </Flex>
              <Flex mt={"xl"} justify={"space-between"}>
                <Flex gap={"md"}>
                  <Button
                    onClick={handleAddField}
                    variant="outline"
                    leftSection={<IconPlus size={"0.9rem"} />}
                  >
                    Add Field
                  </Button>
                  <Button
                    onClick={handleConfirm}
                    leftSection={<IconSend size={"0.9rem"} />}
                    loading={loading}
                  >
                    Confirm
                  </Button>
                </Flex>
                <Button
                  onClick={() =>
                    setFields([
                      {
                        skills: "",
                        punteggio: "",
                        punteggio_a: "",
                        punteggio_b: "",
                        punteggio_c: "",
                      },
                    ])
                  }
                >
                  Clear All
                </Button>
              </Flex>
            </Box>
          ) : (
            <ExcelUpload
              options={options}
              originFiles={originFiles}
              setOriginFiles={setOriginFiles}
              convertedFiles={convertedFiles}
              setConvertedFiles={setConvertedFiles}
              fields={fields}
              setFields={setFields}
              handleConfirm={handleConfirm}
              handleFieldChange={handleFieldChange}
            />
          )}

          {results.length !== 0 && (
            <Box mt="xl">
              <Divider
                w={"100%"}
                my="xs"
                label={<Title order={3}>Assessment Results</Title>}
                labelPosition="center"
                variant="dashed"
              />

              <Box pos="relative">
                {results.map((item, index) => (
                  <Paper
                    key={index}
                    shadow="lg"
                    p={"sm"}
                    mb={"md"}
                    withBorder={colorScheme === "light" ? false : true}
                  >
                    <Flex>
                      <Text
                        color={colorScheme === "light" ? "gray" : ""}
                        fw={500}
                        mb={"sm"}
                        w={"100%"}
                      >
                        {item.date}
                      </Text>
                      <Flex align={"center"} gap={"sm"}>
                        <Tooltip
                          label={
                            <Box>
                              <Flex align={"center"} gap={"sm"}>
                                <Text fw={500}>Costo Totale:</Text>
                                <Text color="green">{item.total_cost}</Text>
                              </Flex>
                            </Box>
                          }
                        >
                          <IconList />
                        </Tooltip>
                        <CopyButton
                          value={
                            Object.keys(item.assessment).length > 2
                              ? Object.entries(item.assessment)
                                  .map(([key, value]) => `${key}: ${value}`)
                                  .join("\n")
                              : JSON.stringify(item.assessment)
                                  .replace(/\\n/g, "")
                                  .replace(/[{}]/g, "")
                                  .replace(/\\/g, "")
                          }
                          timeout={2000}
                        >
                          {({ copied, copy }) => (
                            <Tooltip
                              label={copied ? "Copied" : "Copy"}
                              withArrow
                              position="right"
                            >
                              <ActionIcon
                                color={copied ? "teal" : "gray"}
                                variant="subtle"
                                onClick={copy}
                              >
                                {copied ? (
                                  <IconCheck style={{ width: rem(16) }} />
                                ) : (
                                  <IconCopy style={{ width: rem(16) }} />
                                )}
                              </ActionIcon>
                            </Tooltip>
                          )}
                        </CopyButton>
                      </Flex>
                    </Flex>
                    {Object.keys(item.assessment).map((key, subIndex) => (
                      <Box
                        key={subIndex}
                        ml={subIndex % 2 !== 0 ? "auto" : ""}
                        w={{ base: "85%", xl: "70%" }}
                      >
                        <Paper
                          key={key}
                          radius={"sm"}
                          shadow="sm"
                          mb="md"
                          withBorder={colorScheme === "light" ? false : true}
                        >
                          <Flex
                            className=" rounded-sm w-full"
                            bg={Color[index % 9]}
                            p={"sm"}
                            align={"center"}
                            justify={"space-between"}
                          >
                            <Tooltip label={key}>
                              <Text
                                color={"white"}
                                fw={600}
                                size="lg"
                                align={index % 2 !== 0 ? "right" : "left"}
                                lineClamp={1}
                              >
                                {key}
                              </Text>
                            </Tooltip>
                            <Flex>
                              <CopyButton
                                value={item.assessment[key]}
                                timeout={2000}
                              >
                                {({ copied, copy }) => (
                                  <Tooltip
                                    label={copied ? "Copied" : "Copy"}
                                    withArrow
                                    position="right"
                                  >
                                    <ActionIcon
                                      color={copied ? "teal" : "white"}
                                      variant="subtle"
                                      onClick={copy}
                                    >
                                      {copied ? (
                                        <IconCheck style={{ width: rem(16) }} />
                                      ) : (
                                        <IconCopy style={{ width: rem(16) }} />
                                      )}
                                    </ActionIcon>
                                  </Tooltip>
                                )}
                              </CopyButton>
                              <ActionIcon
                                variant="transparent"
                                onClick={() => handleToggle(index, key)}
                              >
                                {openedStates[`${index}-${key}`] ? (
                                  <IconChevronUp
                                    size={"1.6rem"}
                                    color="white"
                                  />
                                ) : (
                                  <IconChevronDown
                                    size={"1.6rem"}
                                    color="white"
                                  />
                                )}
                              </ActionIcon>
                            </Flex>
                          </Flex>
                          <Collapse
                            in={openedStates[`${index}-${key}`] !== false}
                            p={"md"}
                          >
                            <Text>{item.assessment[key]}</Text>
                          </Collapse>
                        </Paper>
                      </Box>
                    ))}
                  </Paper>
                ))}
              </Box>
            </Box>
          )}
          {loading && <Loader color="blue" type="dots" mt={"md"} />}
        </Paper>
        <BottomToTop scrollPosition={scrollPosition} viewport={viewport} />
      </ScrollArea>
    </Box>
  );
}
