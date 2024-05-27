import { ActionIcon, Avatar, Box, Button, Drawer, Flex, Image, Paper, SimpleGrid, Text, Textarea } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconRefresh, IconSend } from "@tabler/icons-react";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ImageViewer from "react-simple-image-viewer";
import { useCallback } from "react";

export default function NewChat() {
  const navigate = useNavigate();
  const [opened, { open, close }] = useDisclosure(false);

  const [defaultPrompt, setDefaultPrompt] = useState([
    "What are the percentage distributions of the subscription plans?",
    "What was my DAU count for the past week?",
    "Who are my top 5 users?",
    "What has been the MRR for the past 12 months?",
  ]);

  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState({
    images: [],
    text: "",
  });

  const [currentImage, setCurrentImage] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const openImageViewer = useCallback((index) => {
    setCurrentImage(index);
    setIsViewerOpen(true);
  }, []);

  const closeImageViewer = () => {
    setCurrentImage(0);
    setIsViewerOpen(false);
  };

  const getPrediction = async () => {
    const ngrok_url = "https://3202-35-233-186-42.ngrok-free.app";
    let input_data = {
      input: "what is the carrier who manage higher volumes?",
    };
    try {
      const response = await axios.post(`${ngrok_url}/predict`, input_data);
      const data = response.data;
      const imageUrls = data["images"].map((img_base64) => `data:image/png;base64,${img_base64}`);

      setResponse({
        images: imageUrls,
        text: data.text,
      });

      return { text: data["text"], imageUrls };
    } catch (error) {
      console.error("Error fetching prediction:", error);
      toast.error(error.message);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      getPrediction();
    }
  };

  return (
    <Flex w={"100%"} h={"100%"} className="relative">
      <Flex m={"auto"} pb={60} direction={"column"} gap={"xl"} align={"center"} w={"100%"}>
        <Avatar src={""} size={"lg"} radius={"xl"} />
        <Text fw={500} size="lg">
          How may I assit you today? 😊
        </Text>
        <Textarea
          size="md"
          autosize
          w={{ base: "95%", md: "80%" }}
          minRows={2}
          maxRows={7}
          placeholder="Ask anything..."
          value={prompt}
          onKeyDown={handleKeyDown}
          onChange={(e) => setPrompt(e.target.value)}
          rightSection={
            <ActionIcon variant="transparent" color="gray" onClick={getPrediction}>
              <IconSend size={"1.2rem"} />
            </ActionIcon>
          }
        />
        <SimpleGrid cols={{ base: 1, md: 2 }} w={{ base: "95%", md: "80%" }}>
          {defaultPrompt.map((item, index) => {
            return (
              <Button
                key={index}
                variant="default"
                color="gray"
                onClick={() => setPrompt(item)}
                // styles={{
                //   inner: {
                //     display: "flex",
                //     justifyContent: "start",
                //     fontSize: "12px",
                //   },
                // }}
              >
                {item}
              </Button>
            );
          })}
        </SimpleGrid>
        <Flex justify={"center"}>
          <Button px={60} leftSection={<IconRefresh size={"0.9rem"} className="mt-[2px]" />} variant="default">
            Regenerate
          </Button>
        </Flex>
      </Flex>
      <Drawer opened={opened} onClose={close} title="AI Chat App (Demo)" position="right" size={"lg"}>
        <Text color="gray">View Schema and Data</Text>
        <div>This section is Table</div>
      </Drawer>
    </Flex>
  );
}
