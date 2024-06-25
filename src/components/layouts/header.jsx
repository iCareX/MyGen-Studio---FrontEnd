import { ActionIcon, Avatar, Box, Drawer, Flex, Menu, NavLink, Text, rem, useMantineColorScheme } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconLogout, IconMenu2, IconMoon, IconUser } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DarkSwitch from "../switch/DarkSwitch";
import { useRecoilValue } from "recoil";
import { userDataState, userTokenState } from "../atoms/userAtoms";
import { supabase } from "../@utils/supabaseClient";

export default function MainHeader() {
  const { colorScheme } = useMantineColorScheme();
  const userToken = useRecoilValue(userTokenState);
  const userData = useRecoilValue(userDataState);

  const [opened, { open, close }] = useDisclosure(false);
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const [user, setUser] = useState();

  const [navList, setNavList] = useState([
    {
      type: "Agents",
      menu: [
        {
          label: "Fast assessment",
          link: "fast_assessment",
        },
        {
          label: "Priorities assessment",
          link: "priority_assessment",
        },
        {
          label: "Development feedback",
          link: "development_feedback",
        },
        {
          label: "Control tower",
          link: "control_tower",
        },
      ],
    },
    {
      type: "History",
      menu: [],
    },
  ]);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log("Error signing out:", error.message);
    } else {
      localStorage.removeItem("mygen_auth");
      localStorage.removeItem("mygen_token");
      navigate("/login");
    }
  };

  const handleGetData = async () => {
    const session = supabase.auth.getSession();

    if (session) {
      let currentDate = new Date().getTime();
      if (currentDate > session.expires_at) handleSignOut();
    }
  };

  useEffect(() => {
    handleGetData();
  }, []);

  return (
    <header className=" border-b-[1px]">
      <Flex w={"100%"} align={"center"} justify={"space-between"} py={"sm"} px={"md"}>
        <Flex gap={"sm"} align={"center"}>
          <Box className="sm:hidden block">
            <ActionIcon
              variant="transparent"
              color="gray"
              onClick={() => {
                open();
                setShow(true);
              }}
              pt={8}
            >
              <IconMenu2 />
            </ActionIcon>
          </Box>
          <Flex align={"end"} gap={"xs"}>
            <Text fw={700} size="lg">
              MyGen Studio
            </Text>
            <Text fw={400} size="sm" mb={"3"}>
              by icarex
            </Text>
          </Flex>
        </Flex>
        <Flex align={"center"} gap={"xl"}>
          <Menu shadow="md" width={240}>
            <Menu.Target>
              <Flex align={"center"} gap={"sm"} className="hover:cursor-pointer">
                <Text fw={500}>{userData.first_name && userData.last_name ? userData.first_name + " " + userData.last_name : userData.email}</Text>
                <Avatar src={userData.avatar} size={"md"} radius={"xl"} />
              </Flex>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item leftSection={<Avatar radius={"md"} src={userData.avatar} />}>
                <Box>
                  <Text fw={600}>{userData?.first_name + userData?.last_name}</Text>
                  <Text color="gray" fw={500} size="xs">
                    {userData.email}
                  </Text>
                </Box>
              </Menu.Item>
              <Menu.Item leftSection={<IconUser style={{ width: rem(14), height: rem(14) }} />} onClick={() => navigate("/profile")}>
                Profile
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item leftSection={<IconMoon style={{ width: rem(14), height: rem(14) }} />} rightSection={<DarkSwitch />}>
                Dark Mode
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item color="red" leftSection={<IconLogout style={{ width: rem(14), height: rem(14) }} />} onClick={handleSignOut}>
                Log Out
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Flex>
      </Flex>
      <Drawer
        opened={opened}
        onClose={close}
        title={
          <Text fw={600} size="lg">
            MyGen Studio
          </Text>
        }
        size="350"
      >
        <Box h={"100%"} w={320} p={"xs"}>
          <Flex direction={"column"} align={"start"} gap={"md"} mt={"sm"}>
            {navList.map((item, mainIndex) => {
              return (
                <div key={mainIndex}>
                  <Text size="sm" fw={700} mb={-10}>
                    {item.type}
                  </Text>
                  {item?.menu.map((subItem, subIndex) => {
                    return (
                      <NavLink
                        label={subItem.label}
                        key={subIndex}
                        styles={{
                          label: {
                            fontSize: "16px",
                          },
                          root: {
                            backgroundColor: window.location.href.includes(subItem.link) ? (colorScheme === "light" ? "#F4F4F5" : "#333337") : "",
                            border: window.location.href.includes(subItem.link) ? (colorScheme === "light" ? "1px solid #E4E4E7" : "") : "",
                            borderRadius: "8px",
                          },
                        }}
                        onClick={() => {
                          navigate(subItem.link);
                          close();
                        }}
                      />
                    );
                  })}
                </div>
              );
            })}
          </Flex>
        </Box>
      </Drawer>
    </header>
  );
}
