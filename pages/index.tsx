import * as React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";

import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import {
  IconButton,
  Snackbar,
  Table,
  TableBody,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import MuiAlert, { AlertColor, AlertProps } from "@mui/material/Alert";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Home: NextPage = () => {
  const [contacts, setContacts] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<AlertColor>("success");

  const router = useRouter();

  const apiUrl = "https://bkbnchallenge.herokuapp.com/contacts";

  const getPosts = async (rowsPerPage, page) => {
    const pathUrl = "?perPage= " + rowsPerPage + "&" + "page=" + (page + 1);
    const { data: res } = await axios.get(apiUrl + pathUrl);
    setContacts(res.results);
    setTotal(res.count);
    setLoading(true);
  };

  useEffect(() => {
    getPosts(rowsPerPage, page);
  }, [rowsPerPage, page]);

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEdit = (id) => {
    router.push("/contact/edit/" + id);
  };

  const handleDelete = async (id) => {
    try {
      const pathUrl = "/" + id;
      const data = await axios.delete(apiUrl + pathUrl);
      if (data.status === 200) {
        getPosts(rowsPerPage, page);
        setMessage("Se elimino correctamente");
        setSeverity("success");
        setOpen(true);
      }
    } catch (error) {
      setSeverity("error");
      setMessage("Error al eliminar un contacto");
      setOpen(true);
    }
  };

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    setOpen(false);
  };

  return (
    <>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
      <Container maxWidth="lg">
        <Box
          sx={{
            my: 4,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            mt: 20,
          }}
        >
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">Email</StyledTableCell>
                  <StyledTableCell align="center">Nombre</StyledTableCell>
                  <StyledTableCell align="center">Apellido</StyledTableCell>
                  <StyledTableCell align="center">Telefono</StyledTableCell>
                  <StyledTableCell align="center">&nbsp;</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading &&
                  contacts.map((row) => (
                    <StyledTableRow key={row.id}>
                      <StyledTableCell align="center">
                        {row.email}
                      </StyledTableCell>
                      <StyledTableCell style={{ width: 160 }} align="center">
                        {row.firstName}
                      </StyledTableCell>
                      <StyledTableCell style={{ width: 160 }} align="center">
                        {row.lastName}
                      </StyledTableCell>
                      <StyledTableCell style={{ width: 160 }} align="center">
                        {row.phone}
                      </StyledTableCell>
                      <StyledTableCell style={{ width: 160 }} align="center">
                        <IconButton
                          aria-label="edit"
                          onClick={() => {
                            handleEdit(row._id);
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          aria-label="delete"
                          onClick={() => {
                            handleDelete(row._id);
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[
                      5,
                      10,
                      25,
                      { label: "All", value: -1 },
                    ]}
                    colSpan={4}
                    count={total}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    SelectProps={{
                      inputProps: {
                        "aria-label": "rows per page",
                      },
                      native: true,
                    }}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </Box>
      </Container>
    </>
  );
};

export default Home;
