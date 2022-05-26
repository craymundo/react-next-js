import * as React from "react";
import axios from "axios";
import type { NextPage } from "next";
import { useState, useEffect } from "react";


import Box from "@mui/material/Box";
import AppForm from "../../src/components/organismos/AppForm";

import Typography from "../../src/components/atoms/Typography";
import FormButton from "../../src/components/atoms/FormButton";

import { useForm } from "react-hook-form";
import { Grid, Snackbar, TextField } from "@mui/material";


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


const Create: NextPage = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } =  useForm<FormData>();

  const apiUrl = 'https://bkbnchallenge.herokuapp.com/contacts';

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<AlertColor>("success");

  const onSubmit = async (evento) => {
    try {
      const post = {
        firstName: evento.name,
        lastName: evento.lastName,
        email: evento.email,
        phone: evento.phone
      }
      const data = await axios.post(apiUrl , post);
      setMessage("Se registro correctamente")
      setSeverity("success");
      setOpen(true)
      reset({ name: '', lastName: '', email: '', phone: '' });
    } catch (error) {      
      setSeverity("error");
      if(error.response.status === 422){
        setMessage("El telefono o el email ingresado ya existen.");
      }else{
        setMessage("Error al registrar un contacto");
      }
      setOpen(true)
    }
  };

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    setOpen(false);
  
  };

  return (
    <AppForm>
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
      <Alert
        onClose={handleClose}
        severity={severity}
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </Snackbar>

      <React.Fragment>
        <Typography variant="h5" gutterBottom marked="center" align="center">
          Crear Contacto
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
            <TextField
              required
              id="outlined-required"
              label="Nombres:"
              autoComplete="off"
              name="name"
              fullWidth
              error={errors.name && errors.name?.message !== ""}
              helperText={errors.name?.message}
              {...register("name", {
                required: {
                  value: true,
                  message: "El campo es requerido",
                },
              })}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <TextField
              required
              id="outlined-required"
              label="Apellidos:"
              autoComplete="off"
              name="lastName"
              fullWidth
              error={errors.lastName && errors.lastName?.message !== ""}
              helperText={errors.lastName?.message}
              {...register("lastName", {
                required: {
                  value: true,
                  message: "El campo es requerido",
                },
              })}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <TextField
              required
              id="outlined-required"
              label="Email:"
              name="email"
              fullWidth
              error={errors.email && errors.email?.message !== ""}
              helperText={errors.email?.message}
              {...register("email", {
                required: {
                  value: true,
                  message: "El campo es requerido",
                },
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                  message: "El formato no es correcto",
                },
              })}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <TextField
              required
              id="outlined-required"
              label="Telefono:"
              fullWidth
              error={errors.phone && errors.phone?.message !== ""}
              helperText={errors.phone?.message}
              {...register("phone", {
                required: {
                  value: true,
                  message: "El campo es requerido",
                },
                pattern: {
                  value: /[0-9]$/i,
                  message: "El formato no es correcto",
                },
                maxLength: {
                  value: 10,
                  message: "El telefono debe tener como máximo 10 caracteres"
                }
              })}
            />
          </Grid>
        </Grid>

        <FormButton
          sx={{ mt: 3, mb: 2 }}
          size="large"
          color="secondary"
          fullWidth
        >
          Registrar
        </FormButton>
      </Box>
    </AppForm>
  );
};

export default Create;
