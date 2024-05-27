import { Button, TextInput } from "@mantine/core";
import { useState } from "react";

export default function ChatTitleEditModal({ context, id, innerProps }) {
  const { chatTitle, chatId, setTitleEdit } = innerProps;
  const [title, setTitle] = useState();

  const handleTitleEdit = () => {
    console.log("=========>", chatId);
    context.closeModal(id);
  };
  return (
    <>
      <TextInput label="Title" defaultValue={chatTitle} onChange={(e) => setTitle(e.target.value)} />
      <Button fullWidth mt={"md"} onClick={handleTitleEdit}>
        Update
      </Button>
    </>
  );
}
