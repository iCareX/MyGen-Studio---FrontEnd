import { ActionIcon, Avatar, Box, Flex, Image, Loader, Paper, ScrollArea, SimpleGrid, Text, Textarea, useMantineColorScheme } from "@mantine/core";
import { IconSend } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import ImageViewer from "react-simple-image-viewer";
import axios from "axios";
import { useCallback } from "react";
import { toast } from "react-toastify";
import moment from "moment";

export default function ChatComponent() {
  // const [opened, { open, close }] = useDisclosure(false);
  const { colorScheme } = useMantineColorScheme();

  const [loading, setLoading] = useState(false);

  //prompt variables
  const [prompt, setPrompt] = useState("");
  const [chatContent, setChatContent] = useState([]);

  //Image view variables
  const [currentImage, setCurrentImage] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [currentImageViewerChatId, setCurrentImageViewerChatId] = useState(null);

  const viewport = useRef(null);

  const handleSubmit = () => {
    if (prompt !== "") {
      const newChatPrompt = {
        sender: "user",
        query: prompt,
      };
      setChatContent((chatContent) => [...chatContent, newChatPrompt]);
      setPrompt("");
      getPrediction();
    } else toast.warn("Please input the prompt");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };

  const openImageViewer = useCallback((index, id) => {
    setCurrentImage(index);
    setCurrentImageViewerChatId(id);
    setIsViewerOpen(true);
  }, []);

  const closeImageViewer = () => {
    setCurrentImage(0);
    setIsViewerOpen(false);
    setCurrentImageViewerChatId(null);
  };

  const getPrediction = async () => {
    setLoading(true);
    const ngrok_url = process.env.VITE_APP_PUBLIC_URL;
    let input_data = {
      input: prompt,
    };

    try {
      const response = await axios.post(`${ngrok_url}/predict`, input_data);
      const data = response.data;
      const imageUrls = data["images"].map((img_base64) => `data:image/png;base64,${img_base64}`);

      const chatbotMessage = {
        sender: "chatbot",
        query: data.text,
        images: imageUrls,
        id: Date.now() + 1,
        created_at: moment().format("MM/DD/YYYY, h:mm:ss a"),
      };

      setChatContent((chatContent) => [...chatContent, chatbotMessage]);
      viewport.current?.scrollTo({ top: viewport.current.scrollHeight });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching prediction:", error);
      toast.error(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    viewport.current?.scrollTo({ top: viewport.current.scrollHeight });
  }, [chatContent]);

  return (
    <>
      <Box w={"100%"} h={"100%"} className="relative">
        <ScrollArea pb={150} style={{ position: "relative" }} viewportRef={viewport} scrollHideDelay={4000} className="h-[calc(100vh-64px)]">
          <Flex direction={"column"} gap={"sm"} p={{ base: 10, sm: 40 }} pt={40} h={"100%"} className=" overflow-auto">
            {chatContent.map((item, index) => {
              return (
                <Flex w={"100%"} justify={item.sender === "user" ? "end" : "start"}>
                  <Paper
                    gap={item.sender === "user" ? "sm" : ""}
                    align={item.sender === "user" ? "center" : ""}
                    shadow="sm"
                    key={index}
                    withBorder={item.sender === "user" ? false : colorScheme === "light" ? false : true}
                    bg={item.sender === "user" ? (colorScheme === "light" ? "#CCEAFD" : "#286EB3") : ""}
                    w={"fit-content"}
                    p={"md"}
                    style={{ borderRadius: "8px" }}
                  >
                    <Flex gap={"sm"}>
                      <Text>{item.query}</Text>
                      {item.sender === "user" && <Avatar src={"/"} size={"sm"} radius={"sm"} />}
                    </Flex>
                    {item.sender === "chatbot" && (
                      <>
                        <SimpleGrid gap={"sm"} mt={"sm"} cols={2}>
                          {item?.images.map((subItem, subIndex) => {
                            return (
                              <Image
                                radius={"sm"}
                                src={subItem}
                                key={subIndex}
                                w={"100%"}
                                h={"auto"}
                                className="hover:cursor-pointer"
                                onClick={() => openImageViewer(subIndex, item.id)}
                              />
                            );
                          })}
                        </SimpleGrid>
                        {item.id === currentImageViewerChatId && isViewerOpen && (
                          <ImageViewer
                            src={item?.images}
                            currentIndex={currentImage}
                            disableScroll={false}
                            closeOnClickOutside={true}
                            onClose={closeImageViewer}
                          />
                        )}
                        <Flex justify={"space-between"} align={"center"} mt={"xs"}>
                          <Text size="sm" color="gray">
                            {item?.created_at}
                          </Text>
                        </Flex>
                      </>
                    )}
                  </Paper>
                </Flex>
              );
            })}
            {loading && <Loader color="blue" type="dots" />}
          </Flex>
        </ScrollArea>
        <Flex
          mr={50}
          className={`absolute bg-gradient-to-t ${colorScheme === "light" ? "from-white to-white/80" : "from-dark to-dark/80"}`}
          bottom={0}
          px={{ base: 10, md: 120 }}
          pb={50}
          pt={10}
          direction={"column"}
          gap={"md"}
          w={"100%"}
        >
          <Textarea
            size="md"
            autosize
            minRows={1}
            maxRows={7}
            placeholder="Brew your dataset with any questions..."
            value={prompt}
            onKeyDown={handleKeyDown}
            onChange={(e) => setPrompt(e.target.value)}
            rightSection={
              <ActionIcon variant="transparent" color="gray" onClick={handleSubmit}>
                <IconSend size={"1.2rem"} />
              </ActionIcon>
            }
          />
        </Flex>
      </Box>
    </>
  );
}
