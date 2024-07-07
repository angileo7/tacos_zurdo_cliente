import React, { useState } from "react";
import { Grid, Typography, TextField, Button } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { updateAppSettings } from "../util";
const url = process.env.REACT_APP_API_URL;

export const Login = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const history = useHistory();

  const onChangeUsername = (username) => setUserName(username);
  const onChangePassword = (password) => setPassword(password);

  const onClickLogin = () => {
debugger
    fetch(url+'/session/login', { 
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        email: userName,
        password: password
      })
    })
      .then((res) => res.json())
      .then((json) => {
        debugger
        if (json.message) setLoginError(json.message);
        else {
          debugger
          updateAppSettings(json.token);
          history.push("/orders");
        }
      })
      .catch((err) => console.log("Error logging into app ", err.message));
  };

  return (
    <Grid
      container
      direction={"column"}
      alignItems={"center"}
      style={{ marginTop: "10vh" }}
    >
      <Grid item style={{ marginBottom: "10vh" }}>
        <Typography variant={"h3"}>
          Welcome to Tacos Zurdo!
          <span role={"img"} aria-label={"books"}>
          🌮
          </span>
        </Typography>
      </Grid>
      <Grid item style={{ marginBottom: "5vh" }}>
        <TextField
          id={"username-input"}
          label={"username"}
          value={userName}
          onChange={(e) => onChangeUsername(e.target.value)}
        />
      </Grid>
      <Grid item style={{ marginBottom: "7vh" }}>
        <TextField
          id={"password-input"}
          label={"password"}
          type={"password"}
          value={password}
          onChange={(e) => onChangePassword(e.target.value)}
        />
      </Grid>
      <Grid item style={{ marginBottom: "7vh" }}>
        <Button
          aria-label={"login"}
          variant={"contained"}
          size={"large"}
          color={"primary"}
          onClick={onClickLogin}
        >
          LOGIN
        </Button>
      </Grid>
      <Grid item>
        <Typography variant={"body2"} color={"error"}>
          {loginError}
        </Typography>
      </Grid>
    </Grid>
  );
};
