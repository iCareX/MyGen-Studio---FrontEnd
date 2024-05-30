import { Paper, TextInput, PasswordInput, Checkbox, Button, Title, useMantineColorScheme } from "@mantine/core";
import { useForm, isNotEmpty, hasLength } from "@mantine/form";
import classes from "./AuthenticationImage.module.css";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function SignIn() {
  const { colorScheme } = useMantineColorScheme();
  const navigate = useNavigate();

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      //   email: "",
      name: "",
      password: "",
    },

    validate: {
      //   email: isEmail("Invalid email"),
      name: isNotEmpty("Enter your name"),
      password: hasLength({ min: 6 }, "Password must be 6 characters at least"),
    },
  });

  const handleSignIn = () => {
    const { name, password } = form.getValues();

    if (name === "user1" && password === "user1password") {
      toast.success("Sign In Successfully!");
      localStorage.setItem(
        "mygen_auth",
        JSON.stringify({
          name: name,
          password: password,
        })
      );
      setTimeout(() => {
        navigate("/fast_assessment");
      }, 3000);
    } else {
      toast.error("Username and Password is not correct");
    }
  };

  return (
    <>
      <form onSubmit={form.onSubmit(() => handleSignIn())}>
        <div className={classes.wrapper} style={{ backgroundImage: 'url("/back_2.jpeg")' }}>
          <Paper radius={0} p={30} className={classes.form}>
            <Title order={2} ta="center" mt="md" mb={50} className={classes.title}>
              Welcome to MyGen Studio
            </Title>

            <TextInput
              withAsterisk
              key={form.key("name")}
              {...form.getInputProps("name")}
              label="Email address"
              placeholder="hello"
              size="md"
              // onChange={(e) => setEmail(e.target.value)}
            />
            <PasswordInput
              withAsterisk
              key={form.key("password")}
              {...form.getInputProps("password")}
              label="Password"
              placeholder="Your password"
              mt="md"
              size="md"
              // onChange={(e) => setPassowrd(e.target.value)}
            />
            <Checkbox label="Keep me logged in" mt="xl" size="md" />
            <Button fullWidth mt="xl" size="md" type="submit">
              Sign In
            </Button>

            {/* <Text ta="center" mt="md">
          Don&apos;t have an account?{" "}
          <Anchor component="a" href="/signup" fw={700}>
            Register
          </Anchor>
        </Text> */}
          </Paper>
        </div>
      </form>
      <ToastContainer
        position="top-right"
        limit={5}
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={colorScheme}
      />
    </>
  );
}
