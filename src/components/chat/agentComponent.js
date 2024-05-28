import { Box, Button, Flex, NumberInput, Paper, ScrollArea, Select } from "@mantine/core";
import { IconPlus, IconSend } from "@tabler/icons-react";
import { useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function AgentComponent() {
  const viewport = useRef(null);

  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState([{ skills: "", punteggio_a: "", punteggio_b: "", punteggio_c: "", punteggio_d: "" }]);

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

  const handleAddField = () => {
    setFields([...fields, { skills: "", punteggio_a: "", punteggio_b: "", punteggio_c: "", punteggio_d: "" }]);
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
        punteggio_a: Number(field.punteggio_a),
        punteggio_b: Number(field.punteggio_b),
        punteggio_c: Number(field.punteggio_c),
        punteggio_d: Number(field.punteggio_d),
      };
    });

    const inputData = { skill_dict: skillDict };
    setLoading(true);
    try {
      const response = await axios.post(`${process.env.REACT_APP_PUBLIC_URL}/ideaAI_development_feedback`, inputData);
      console.log("Response:", response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
      toast.error("Network Error");
    }
  };

  return (
    <Box w={"100%"} h={"100%"} className="relative">
      <ScrollArea pb={150} style={{ position: "relative" }} viewportRef={viewport} scrollHideDelay={4000} className="h-[calc(100vh-64px)]">
        <Paper p={"lg"}>
          <Flex gap={"sm"} direction={"column"}>
            {fields.map((field, index) => (
              <Flex gap={"md"} align={{ base: "start", md: "end" }} key={index} direction={{ base: "column", md: "row" }}>
                <Select
                  label="Your Skills"
                  data={options}
                  placeholder="Pick value"
                  w={{ base: "100%", md: 400 }}
                  value={field.skills}
                  onChange={(value) => handleFieldChange(index, "skills", value)}
                  styles={{
                    label: {
                      display: "flex",
                      justifyContent: "start",
                    },
                  }}
                />
                <Flex gap={"md"}>
                  <NumberInput
                    placeholder="Score for moment A"
                    value={field.punteggio_a}
                    onChange={(valueString) => handleFieldChange(index, "punteggio_a", valueString)}
                  />
                  <NumberInput
                    placeholder="Score for moment B"
                    value={field.punteggio_b}
                    onChange={(valueString) => handleFieldChange(index, "punteggio_b", valueString)}
                  />
                  <NumberInput
                    placeholder="Score for moment C"
                    value={field.punteggio_c}
                    onChange={(valueString) => handleFieldChange(index, "punteggio_c", valueString)}
                  />
                  <NumberInput
                    placeholder="Score for moment D"
                    value={field.punteggio_d}
                    onChange={(valueString) => handleFieldChange(index, "punteggio_d", valueString)}
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
        </Paper>
      </ScrollArea>
    </Box>
  );
}
