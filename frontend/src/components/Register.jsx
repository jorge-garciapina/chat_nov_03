import * as React from "react";
import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";

// Apollo Client Import and GraphQL Mutation
import { REGISTER_MUTATION } from "../graphql/authQueries";

// Custom Frontend Validation Logic

// Internationalization imports
import LanguageSelector from "./LanguageSelector";
import { useTranslation } from "react-i18next";

import { submitRegister } from "./submitLogic";

const defaultTheme = createTheme();

export default function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { t } = useTranslation(); // This hook allows us to get translations based on the user's language choice

  const navigate = useNavigate();
  const [registerUser, { data, loading, error }] =
    useMutation(REGISTER_MUTATION);
  const [validationError, setValidationError] = useState(""); // Add this line with other useState hooks

  useEffect(() => {
    if (data && data.registerUser && data.registerUser.token) {
      localStorage.setItem("authToken", data.registerUser.token);
      navigate("/dashboard");
    }

    // Error Handling from the server
    if (error) {
      if (error.graphQLErrors.length > 0) {
        setValidationError(error.graphQLErrors[0].message);
      } else if (error.networkError) {
        setValidationError("Network error. Please try again later.");
      } else {
        setValidationError("An unexpected error occurred.");
      }
    }
  }, [data, error, navigate]);

  // Form Submission Handler
  const handleSubmit = (event) => {
    submitRegister(
      event,
      email,
      username,
      password,
      confirmPassword,
      registerUser,
      setValidationError
    );
  };
  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <LanguageSelector /> {/* Use the LanguageSelector component here */}
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            {t("signUp")}
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit} // Modified this line to use submitRegister
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  fullWidth
                  id="username"
                  label={t("username")}
                  name="username"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  fullWidth
                  id="email"
                  label={t("emailAddress")}
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  fullWidth
                  name="password"
                  label={t("password")}
                  type="password"
                  id="password"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  fullWidth
                  name="confirmPassword"
                  label={t("confirmPassword")}
                  type="password"
                  id="confirmPassword"
                />
              </Grid>
            </Grid>
            {validationError && (
              <p style={{ color: "red" }}>{t(validationError)}</p>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {t("signUpButton")}
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/" variant="body2">
                  {t("alreadyAccount")}
                </Link>
              </Grid>
            </Grid>
          </Box>
          {loading && <p>{t("loading")}</p>}
          {error && (
            <p>
              {t("error")}: {error.message}
            </p>
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
}
