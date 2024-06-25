import { Card, Group, TextInput, Button, Flex, Avatar } from "@mantine/core";
import { useRecoilState } from "recoil";
import { userDataState } from "../../atoms/userAtoms";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { IconUser } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { supabase } from "../../@utils/supabaseClient";
import { toast } from "react-toastify";

export default function ProfilePage() {
  const [userData, setUserData] = useRecoilState(userDataState);

  const [base64, setBase64] = useState();
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdateProfileInfo = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("user")
      .update({ first_name: firstname, last_name: lastname, avatar: base64 })
      .eq("user_id", userData.id)
      .select();

    if (data) {
      toast.success("Profile Update Successfully");
      localStorage.setItem(
        "mygen_auth",
        JSON.stringify({
          email: data[0].email,
          first_name: data[0].first_name,
          last_name: data[0].last_name,
          avatar: data[0].avatar,
          id: data[0].user_id,
        })
      );
      setUserData(JSON.parse(localStorage.getItem("mygen_auth")));
      setLoading(false);
      setDate(new Date());
    }
  };

  const [date, setDate] = useState(new Date());

  useEffect(() => {}, [date]);

  return (
    <Card withBorder shadow="md" m={"auto"}>
      <Flex align={"start"} gap={"md"}>
        <Dropzone
          onDrop={(files) => {
            if (files.length > 0) {
              const reader = new FileReader();
              reader.onloadend = () => {
                setBase64(reader.result);
              };
              reader.readAsDataURL(files[0]);
            }
          }}
          onReject={(files) => console.log("rejected files", files)}
          maxSize={5 * 1024 ** 2}
          accept={IMAGE_MIME_TYPE}
        >
          <Group gap="xl" style={{ pointerEvents: "none" }} mt={"xs"}>
            {base64 ? <Avatar src={base64} size={"xl"} /> : userData.avatar ? <Avatar src={userData.avatar} size={"xl"} /> : <IconUser size={"2rem"} />}
          </Group>
        </Dropzone>
        <Flex direction={"column"}>
          <TextInput label="Email" value={userData?.email} disabled w={"100%"} />
          <Flex gap={"md"} mt={"sm"}>
            <TextInput label="First Name" defaultValue={userData?.first_name} onChange={(e) => setFirstName(e.target.value)} />
            <TextInput label="Last Name" defaultValue={userData?.last_name} onChange={(e) => setLastName(e.target.value)} />
          </Flex>
        </Flex>
      </Flex>
      <Flex w={"100%"} gap={"md"} mt={"xl"}>
        <Button fullWidth>Cancel</Button>
        <Button fullWidth onClick={handleUpdateProfileInfo} loading={loading}>
          Submit
        </Button>
      </Flex>
    </Card>
  );
}
