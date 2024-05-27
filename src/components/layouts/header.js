import { ActionIcon, Avatar, Box, Drawer, Flex, Menu, NavLink, Text, rem, Switch, useMantineColorScheme } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconAnalyze, IconFileSearch, IconLighter, IconLogout, IconMenu2, IconMoon, IconSettings } from "@tabler/icons-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DarkSwitch from "../switch/DarkSwitch";

export default function MainHeader() {
  const { colorScheme } = useMantineColorScheme();
  const [opened, { open, close }] = useDisclosure(false);
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const [navList, setNavList] = useState([
    {
      type: "Agents",
      menu: [
        {
          label: "IdeaAI fast assessment",
          link: "ideaAI_fast_assessment",
        },
        {
          label: "IdeaAI executive assessment",
          link: "ideaAI_executive_assessment",
        },
        {
          label: "IdeaAI development feedback",
          link: "_development_feedback",
        },
      ],
    },
    {
      type: "History",
      menu: [],
    },
  ]);

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
          <Text fw={600} size="lg">
            MyGen Studio
          </Text>
        </Flex>
        <Flex align={"center"} gap={"xl"}>
          <Menu shadow="md" width={240}>
            <Menu.Target>
              <Flex align={"center"} gap={"sm"} className="hover:cursor-pointer">
                <Text>Choace</Text>
                <Avatar src={""} size={"md"} radius={"xl"} />
              </Flex>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item leftSection={<Avatar radius={"md"} src={""} />}>
                <Box>
                  <Text fw={600}>Choace</Text>
                  <Text color="gray" fw={500} size="xs">
                    acedev0427@gmail.com
                  </Text>
                </Box>
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item leftSection={<IconSettings style={{ width: rem(14), height: rem(14) }} />}>Settings</Menu.Item>
              <Menu.Item leftSection={<IconAnalyze style={{ width: rem(14), height: rem(14) }} />}>Analytics</Menu.Item>
              <Menu.Item leftSection={<IconLighter style={{ width: rem(14), height: rem(14) }} />}>Upgrade Plan</Menu.Item>
              <Menu.Divider />
              <Menu.Item leftSection={<IconFileSearch style={{ width: rem(14), height: rem(14) }} />}>Docs</Menu.Item>
              <Menu.Item leftSection={<IconMoon style={{ width: rem(14), height: rem(14) }} />} rightSection={<DarkSwitch />}>
                Dark Mode
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item color="red" leftSection={<IconLogout style={{ width: rem(14), height: rem(14) }} />}>
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
            {navList.map((item, index) => {
              return (
                <>
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
                </>
              );
            })}
          </Flex>
        </Box>
      </Drawer>
    </header>
  );
}
