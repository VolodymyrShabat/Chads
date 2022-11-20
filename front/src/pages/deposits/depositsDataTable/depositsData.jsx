import * as React from "react"
import styled from "styled-components"
import {
  DataGrid,
  GridOverlay,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarDensitySelector,
} from "@material-ui/data-grid"
import { makeStyles } from "@material-ui/core/styles"
import { Box } from "@material-ui/core"
import LinearProgress from "@material-ui/core/LinearProgress"
import CustomNoRowsOverlay from "./noRowsOverlay"
import CustomErrorOverlay from "./errorOverlay"
import FilterStatus from "./filterStatus"

const columns = [
  { field: "id", headerName: "№", width: 100 },
  { field: "type", headerName: "Type name", width: 150 },
  {
    field: "depositAmount",
    headerName: "Amount ₴",
    width: 150,
    type: "number",
  },

  {
    field: "interestRate",
    headerName: "Interest rate %",
    width: 170,
    type: "number",
  },
  {
    field: "dateCreated",
    headerName: "Date created",
    width: 200,
    type: "dateTime",
    valueFormatter: (params) => {
      const valueFormatted = params.value.toLocaleString().slice(0, 16)
      const repValue = valueFormatted.replace("T", "\xa0\xa0\xa0")
      return repValue
    },
  },
  {
    field: "duration",
    headerName: "Duration (m)",
    type: "number",
    width: 200,
  },
]

const StyledDataGrid = styled(DataGrid)`
  .MuiDataGrid-footerContainer {
    justify-content: flex-start;
  }
  .MuiDataGrid-cell {
    border-bottom: 0;
  }
  .MuiDataGrid-cell--textLeft {
    text-align: center;
  }
  .MuiDataGrid-cell--textRight {
    text-align: center;
  }
  .MuiButton-textPrimary {
    color: black;
  }
  .MuiButton-textPrimary {
    color: rgb(0 0 0 / 80%);
    margin: 0 30px 0 10px;
  }
  .MuiDataGrid-columnHeaderTitleContainer {
    justify-content: flex-end;
  }
`

function CustomLoadingOverlay() {
  return (
    <GridOverlay>
      <div style={{ position: "absolute", top: 0, width: "100%" }}>
        <LinearProgress />
      </div>
    </GridOverlay>
  )
}

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(0),
    width: 1000,
    height: 700,
    left: 10,
    right: 0,
    border: 0,
  },
}))

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton color="primary" />
      <GridToolbarFilterButton color="primary" />
      <GridToolbarDensitySelector color="primary" />
      <GridToolbarExport color="primary" />
      <FilterStatus />
    </GridToolbarContainer>
  )
}

export default function DataTable({ data, loading, IsError }) {
  const classes = useStyles()
  return (
    <Box>
      <StyledDataGrid
        hideFooterPagination={IsError}
        autoHeight
        headerHeight={70}
        className={classes.root}
        components={{
          LoadingOverlay: CustomLoadingOverlay,
          NoRowsOverlay: CustomNoRowsOverlay,
          ErrorOverlay: CustomErrorOverlay,
          Toolbar: CustomToolbar,
        }}
        componentsProps={{
          toolbar: { color: "#383838" },
        }}
        loading={loading}
        rows={data || []}
        columns={columns}
        pageSize={10}
      />
    </Box>
  )
}
