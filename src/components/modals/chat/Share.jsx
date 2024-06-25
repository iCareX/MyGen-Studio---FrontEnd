import { Box, Button, Flex, Paper, Text } from "@mantine/core";

export default function ChatShareModal({ context, id, innerProps }) {
  return (
    <>
      <Text color="gray" size="sm">
        Anyone with the URL in this workspace will be able to view the shared chat.{" "}
        <span className=" font-medium">(You are sharing this entire threads with others)</span>
      </Text>
      <Paper p={"lg"} withBorder mt={"md"}>
        This is chat Content Section
      </Paper>
      <Flex align={"center"} mt={"md"} justify={"space-between"}>
        <Box>
          <Text size="sm" fw={500}>
            {"Choace (acedev0427@gmail.com)"}
          </Text>
          <Text size="sm" fw={500} color="gray">
            {"Thu May 23 2024"}
          </Text>
        </Box>
        <Button>Copy Link</Button>
      </Flex>
    </>
  );
}
