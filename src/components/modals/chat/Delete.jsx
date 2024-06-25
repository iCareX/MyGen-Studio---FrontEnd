import { Button, Flex, Text } from "@mantine/core";

export default function ChatDeleteModal({ context, id, innerProps }) {
  const { chatId } = innerProps;

  const handleDeleteChat = () => {
    console.log("=========>", chatId);
    context.closeModal(id);
  };
  return (
    <>
      <Text size="sm" color="gray">
        Are you sure you want to delete this chat?
      </Text>
      <Flex mt={"md"} w={"100%"} gap={"md"} justify={"end"}>
        <Button variant="light" color="gray" onClick={() => context.closeModal(id)}>
          Cancel
        </Button>
        <Button color="red" onClick={handleDeleteChat}>
          Delete
        </Button>
      </Flex>
    </>
  );
}
