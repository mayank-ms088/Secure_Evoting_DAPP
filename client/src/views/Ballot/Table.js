import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Radio from "@material-ui/core/Radio";
import FiberManualRecord from "@material-ui/icons/FiberManualRecord";
import FormControlLabel from "@material-ui/core/FormControlLabel";
///

const columns = [
  {
    id: "ID",
    label: "ID",
    minWidth: 170,
    align: "left",
    format: (value) => value.toLocaleString("en-US"),
  },
  { id: "name", label: "Name", minWidth: 170 },
];

function createData(ID, name) {
  return { ID, name };
}

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);
const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);
const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: 440,
  },
});

export default function CustomTables(props) {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [SelectedEnabled, setSelectedEnabled] = React.useState(null);
  const Rows = props.rows;
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  function assignRows(Rows) {
    let tmp = [];
    Rows.map((row) => {
      //console.log(row.votesReceived);
      return tmp.push(createData(row.candidateID, row.candidateName));
    });
    return tmp;
  }
  const rows = assignRows(Rows);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const handleSelect = (name) => () => {
    setSelectedEnabled(name);
    props.selectCandidate(name);
  };

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <StyledTableRow>
              <StyledTableCell>Select</StyledTableCell>
              {columns.map((column) => (
                <StyledTableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </StyledTableCell>
              ))}
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <StyledTableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={row.ID}
                  >
                    <StyledTableCell>
                      <div
                        className={
                          classes.checkboxAndRadio +
                          " " +
                          classes.checkboxAndRadioHorizontal
                        }
                      >
                        <FormControlLabel
                          control={
                            <Radio
                              checked={SelectedEnabled === row.ID}
                              onChange={handleSelect(row.ID)}
                              value="a"
                              name="radio button enabled"
                              aria-label="A"
                              icon={
                                <FiberManualRecord
                                  className={classes.radioUnchecked}
                                />
                              }
                              checkedIcon={
                                <FiberManualRecord
                                  className={classes.radioChecked}
                                />
                              }
                              classes={{
                                checked: classes.radio,
                                root: classes.radioRoot,
                              }}
                            />
                          }
                          classes={{
                            label: classes.label,
                            root: classes.labelRoot,
                          }}
                          label=""
                        />
                      </div>
                    </StyledTableCell>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <StyledTableCell key={column.id} align={column.align}>
                          {column.format && typeof value === "number"
                            ? column.format(value)
                            : value}
                        </StyledTableCell>
                      );
                    })}
                  </StyledTableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
