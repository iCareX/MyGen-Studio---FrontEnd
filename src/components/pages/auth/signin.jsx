import { Paper, TextInput, PasswordInput, Checkbox, Button, Title, useMantineColorScheme } from "@mantine/core";
import { useForm, isNotEmpty, hasLength, isEmail } from "@mantine/form";
import classes from "./AuthenticationImage.module.css";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { userDataState, userTokenState } from "../../atoms/userAtoms";
import { supabase } from "../../@utils/supabaseClient";
import { useState } from "react";

export default function SignIn() {
  const { colorScheme } = useMantineColorScheme();
  const [user, setUser] = useRecoilState(userDataState);
  const [token, setToken] = useRecoilState(userTokenState);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      email: "",
      // name: "",
      password: "",
    },

    validate: {
      email: isEmail("Invalid email"),
      // name: isNotEmpty("Enter your name"),
      password: hasLength({ min: 6 }, "Password must be 6 characters at least"),
    },
  });

  const handleSignIn = async () => {
    const { email, password } = form.getValues();
    setLoading(true);

    let { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      toast.error("Invild email and password");
      setLoading(false);
    } else {
      let { data: userData, error } = await supabase.from("user").select().eq("user_id", data.user.id);
      toast.success("Sign In Successfully!");
      localStorage.setItem(
        "mygen_auth",
        JSON.stringify({
          email: userData[0].email,
          first_name: userData[0].first_name,
          last_name: userData[0].last_name,
          id: userData[0].user_id,
          avatar: userData[0].avatar,
        })
      );
      localStorage.setItem(
        "mygen_token",
        JSON.stringify({
          token: data.session.access_token,
          expire_time: new Date().getTime(),
        })
      );
      setUser(JSON.parse(localStorage.getItem("mygen_auth")));
      setToken(JSON.parse(localStorage.getItem("mygen_token")));
      setLoading(false);
      navigate("/fast_assessment");
    }

    // if (name === "user1" && password === "user1password") {
    //   toast.success("Sign In Successfully!");
    //   localStorage.setItem(
    //     "mygen_auth",
    //     JSON.stringify({
    //       name: name,
    //       password: password,
    //     })
    //   );
    //   setUser(JSON.parse(localStorage.getItem("mygen_auth")));
    //   setTimeout(() => {
    //     navigate("/fast_assessment");
    //   }, 3000);
    // } else {
    //   toast.error("Username and Password is not correct");
    // }
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
              key={form.key("email")}
              // key={form.key("name")}
              {...form.getInputProps("email")}
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
            <Button fullWidth mt="xl" size="md" type="submit" loading={loading}>
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
