import { Box, Button, Divider, Flex, Loader, NumberInput, Paper, ScrollArea, Select, Text, Title, useMantineColorScheme, useMantineTheme } from "@mantine/core";
import { IconPlus, IconSend } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import moment from "moment/moment";
import { PrioritiesAssessmentAPI, PrioritiesAssessmentResultAPI } from "../apis/PriorityAgentAPI";

export default function PriorityAgentComponent() {
  const viewport = useRef(null);
  const { colorScheme } = useMantineColorScheme();

  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState([{ skills: "", punteggio: "", punteggio_a: "", punteggio_b: "", punteggio_c: "" }]);
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

  const Color = ["blue", "green", "orange", "grape", "pink", "indigo", "cyan", "teal", "yellow"];

  const handleAddField = () => {
    setFields([...fields, { skills: "", punteggio: "", punteggio_a: "", punteggio_b: "", punteggio_c: "" }]);
  };

  const handleFieldChange = (index, field, value) => {
    const newFields = [...fields];
    newFields[index][field] = value;
    setFields(newFields);
  };

  const handleConfirm = async () => {
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
      const response = await PrioritiesAssessmentAPI(inputData);
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
        const resultResponse = await PrioritiesAssessmentResultAPI(jobId);
        const resultData = resultResponse.data;
        if (resultData.status && resultData.status !== "pending") {
          clearInterval(interval);
          setResults((results) => [...results, { assessment: resultData.assessment, date: moment().format("MM/DD/YYYY, h:mm:ss a") }]);
          setLoading(false);
        } else if (!resultData.status) {
          clearInterval(interval);
          setResults((results) => [...results, { assessment: resultData.assessment, date: moment().format("MM/DD/YYYY, h:mm:ss a") }]);
          viewport.current?.scrollTo({ top: viewport.current.scrollHeight });
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

  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

  return (
    <Box w={"100%"} h={"100%"}>
      <ScrollArea viewportRef={viewport} scrollHideDelay={4000} className="h-[calc(100vh-64px)]">
        <Paper p={"lg"} className="relative">
          <Flex gap={"sm"} direction={"column"}>
            {fields.map((field, index) => (
              <Flex gap={"md"} align={{ base: "start", md: "end" }} key={index} direction={{ base: "column", md: "row" }}>
                <Select
                  label="Your Skills"
                  data={options}
                  placeholder="Pick value"
                  w={{ base: "100%", md: 600 }}
                  value={field.skills}
                  onChange={(value) => handleFieldChange(index, "skills", value)}
                  styles={{
                    label: {
                      display: "flex",
                      justifyContent: "start",
                    },
                  }}
                />
                <Flex gap={"md"} w={"100%"}>
                  <NumberInput
                    placeholder="Score"
                    value={field.punteggio}
                    onChange={(valueString) => handleFieldChange(index, "punteggio", valueString)}
                    w={"100%"}
                  />
                  <NumberInput
                    placeholder="Score for moment A"
                    value={field.punteggio_a}
                    onChange={(valueString) => handleFieldChange(index, "punteggio_a", valueString)}
                    w={"100%"}
                  />
                  <NumberInput
                    placeholder="Score for moment B"
                    value={field.punteggio_b}
                    onChange={(valueString) => handleFieldChange(index, "punteggio_b", valueString)}
                    w={"100%"}
                  />
                  <NumberInput
                    placeholder="Score for moment C"
                    value={field.punteggio_c}
                    onChange={(valueString) => handleFieldChange(index, "punteggio_c", valueString)}
                    w={"100%"}
                  />
                </Flex>
              </Flex>
            ))}
          </Flex>
          <Flex mt={"xl"} gap={"md"}>
            <Button onClick={handleAddField} variant="outline" leftSection={<IconPlus size={"0.9rem"} />}>
              Add Field
            </Button>
            <Button onClick={handleConfirm} leftSection={<IconSend size={"0.9rem"} />} loading={loading}>
              Confirm
            </Button>
          </Flex>
          {results.length !== 0 && (
            <Box mt="xl">
              <Divider my="xs" label={<Title order={3}>Assessment Results</Title>} labelPosition="center" variant="dashed" />
              <Box pos="relative">
                {results.map((item, index) => (
                  <Paper
                    ml={index % 2 !== 0 ? "auto" : ""}
                    w={{ base: "85%", xl: "70%" }}
                    key={index}
                    radius={"sm"}
                    shadow="sm"
                    mb="md"
                    withBorder={colorScheme === "light" ? false : true}
                  >
                    <Flex className=" rounded-sm w-full" bg={Color[index % 9]} p={"sm"} align={"center"} justify={"space-between"}>
                      <Text color={colorScheme === "light" ? "gray" : "white"} fw={500} td={"underline"}>
                        {moment().format("MM/DD/YYYY, h:mm:ss a")}
                      </Text>
                    </Flex>
                    <Text align={index % 2 !== 0 ? "right" : "left"} m={"md"}>
                      {item.assessment}
                    </Text>
                  </Paper>
                ))}
              </Box>
            </Box>
          )}
          {loading && <Loader color="blue" type="dots" mt={"md"} />}
        </Paper>
      </ScrollArea>
    </Box>
  );
}
