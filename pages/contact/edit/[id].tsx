import * as React from "react";
import axios from "axios";
import type { NextPage } from "next";
import { useState, useEffect } from "react";

import Box from "@mui/material/Box";
import AppForm from "../../../src/components/organismos/AppForm";

import Typography from "../../../src/components/atoms/Typography";
import FormButton from "../../../src/components/atoms/FormButton";

import { useForm, Controller } from "react-hook-form";
import { Grid, Input, Snackbar, TextField } from "@mui/material";
import { useRouter } from "next/router";

import MuiAlert, { AlertColor, AlertProps } from "@mui/material/Alert";

type FormData = {
  name: string;
  lastName: string;
  email: string;
  phone: string;
};

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Edit: NextPage = () => {
  const router = useRouter();
  const {
    register,
    control,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const apiUrl = "https://bkbnchallenge.herokuapp.com/contacts";

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<AlertColor>("success");
  const [contact, setContact] = useState({
    name: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const { id } = router.query;

  const onSubmit = async (evento) => {
    try {
      const post = {
        firstName: evento.name,
        lastName: evento.lastName,
        email: evento.email,
        phone: evento.phone,
      };
      const path = apiUrl + "/" + id;
      const data = await axios.put(path, post);
      setMessage("Se actualizo correctamente");
      setSeverity("success");
      setOpen(true);
    } catch (error) {
      setSeverity("error");
      setMessage("Error al actualizar un contacto");
      setOpen(true);
    }
  };

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    setOpen(false);
  };

  useEffect(() => {
    if (id) {
      const getContact = async () => {
        const pathUrl = "/" + id;
        const data = await axios.get(apiUrl + pathUrl);
        setContact(data.data);
        setValue("name", data.data?.firstName);
        setValue("lastName", data.data?.lastName);
        setValue("email", data.data?.email);
        setValue("phone", data.data?.phone);
      };
      getContact();
    }
  }, [id, setValue]);

  return (
    <AppForm>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>

      <React.Fragment>
        <Typography variant="h5" gutterBottom marked="center" align="center">
          Editar Contacto
        </Typography>
      </React.Fragment>

      <Box
        component="form"
        noValidate
        sx={{ mt: 6 }}
        onSubmit={handleSubmit(onSubmit)}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12}>
            <Controller
              name="name"
              control={control}
              defaultValue=""
              rules={{ required: {
                value: true,
                message: "El campo es requerido",
              } }}
              render={({ field }) => (
                <TextField
                  label="Nombres:"
                  autoComplete="off"
                  name="name"
                  fullWidth
                  error={errors.name && errors.name?.message !== ""}
                  helperText={errors.name?.message}
                  {...field}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={12}>

          <Controller
              name="lastName"
              control={control}
              defaultValue=""
              rules={{ required: {
                value: true,
                message: "El campo es requerido",
              } }}
              render={({ field }) => (
                <TextField
                  label="Apellidos:"
                  autoComplete="off"
                  name="lastName"
                  fullWidth
                  error={errors.lastName && errors.lastName?.message !== ""}
                  helperText={errors.lastName?.message}
                  {...field}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
          <Controller
              name="email"
              control={control}
              defaultValue=""
              rules={{ required: {
                value: true,
                message: "El campo es requerido",
              },
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                message: "El formato no es correcto",
              }
             }}
              render={({ field }) => (
                <TextField
                  label="Email:"
                  autoComplete="off"
                  name="email"
                  fullWidth
                  error={errors.email && errors.email?.message !== ""}
                  helperText={errors.email?.message}
                  {...field}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
          <Controller
              name="phone"
              control={control}
              defaultValue=""
              rules={{ required: {
                value: true,
                message: "El campo es requerido",
              },
              pattern: {
                value: /[0-9]$/i,
                message: "El formato no es correcto",
              },
              maxLength: {
                value: 10,
                message: "El telefono debe tener como máximo 10 caracteres",
              }, }}
              render={({ field }) => (
                <TextField
                  label="Telefono:"
                  autoComplete="off"
                  name="phone"
                  fullWidth
                  error={errors.phone && errors.phone?.message !== ""}
                  helperText={errors.phone?.message}
                  {...field}
                />
              )}
            />
          </Grid>
        </Grid>

        <FormButton
          sx={{ mt: 3, mb: 2 }}
          size="large"
          color="secondary"
          fullWidth
        >
          Actualizar
        </FormButton>
      </Box>
    </AppForm>
  );
};

export default Edit;
