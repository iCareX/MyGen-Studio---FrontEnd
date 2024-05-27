import { Flex, Button, Text, Title } from "@mantine/core";
import "./index.css";
import { useNavigate } from "react-router-dom";

export default function ErorrPage() {
  const navigate = useNavigate();
  return (
    <Flex w={"100%"} h={"100vh"} mx="auto" justify={"center"} align={"center"} direction={"column"} mt={-40}>
      <Title>Page Not Found</Title>
      <Text fz={{ base: 16, sm: 20 }} fw={500} mt={"md"}>
        The page you are looking for not avaible!
      </Text>
      <section class="error-container">
        <span class="four">
          <span class="screen-reader-text">4</span>
        </span>
        <span class="zero">
          <span class="screen-reader-text">0</span>
        </span>
        <span class="four">
          <span class="screen-reader-text">4</span>
        </span>
      </section>
      <div class="link-container">
        <Button color="#de7e85" size="md" w={300} onClick={() => navigate("/")}>
          Go to Home
        </Button>
      </div>
    </Flex>
  );
}
