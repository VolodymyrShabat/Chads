import React, { useMemo } from "react"
import {
  Grid,
  Table,
  TableRow,
  TableCell,
  TableHead,
  makeStyles,
  CircularProgress,
} from "@material-ui/core"
import { useSelector } from "react-redux"
import { useFetchDepositsQuery } from "./depositsApiSlice"
import DataTable from "./depositsData"
import StartChart from "./statsChart"
import img from "./error.png"
import { ImgError } from "./errorOverlay"

const useStyles = makeStyles((theme) => ({
  tableCell: {
    color: "rgb(0 0 0 / 70%)",
  },
  table: {
    marginLeft: "25%",
  },
  statsTable: {
    marginLeft: "15%",
    maxWidth: "70%",
  },
  statChart: {
    marginTop: 25,
    marginLeft: 150,
    width: 320,
    height: 320,
  },
  circLoader: {
    display: "flex",
    marginLeft: 150,
  },
}))

function DepositsTable() {
  const { data = [], isLoading, isError } = useFetchDepositsQuery()
  const filterVal = useSelector((state) => state.filter.filter)
  const classes = useStyles()

  const itemsToRender = useMemo(() => {
    switch (filterVal) {
      case "active":
        return data.filter((e) => e.isActive)
      case "closed":
        return data.filter((e) => !e.isActive)
      default:
        return data
    }
  }, [filterVal, data])
  console.log(data)
  const totalSumOfDeposits = itemsToRender.reduce(
    (n, { depositAmount }) => n + depositAmount,
    0
  )
  const totalRate = itemsToRender.reduce(
    (n, { interestRate }) => n + interestRate,
    0
  )
  const totalDuration = itemsToRender.reduce(
    (n, { duration }) => n + duration,
    0
  )
  const avrDuration = totalDuration / itemsToRender.length

  const avrRate = totalRate / itemsToRender.length

  const avrRatePerMonth = avrRate / 1200
  const avrAmount = totalSumOfDeposits / itemsToRender.length
  const avrProfitPerMonth = avrAmount * avrRatePerMonth

  const totalProfitPerMonth = totalSumOfDeposits * avrRatePerMonth

  const totalProfit = (avrDuration * totalProfitPerMonth).toFixed(2)
  const fixedAvrDuration = avrDuration.toFixed(2)
  const fixedAvrRate = avrRate.toFixed(2)
  const fixedAvrProfitPerMonth = avrProfitPerMonth.toFixed(2)

  const economSum = itemsToRender
    .filter((el) => el.type === "econom")
    .reduce((n, { depositAmount }) => n + depositAmount, 0)

  const fastSum = itemsToRender
    .filter((el) => el.type === "fast")
    .reduce((n, { depositAmount }) => n + depositAmount, 0)

  const standartSum = itemsToRender
    .filter((el) => el.type === "standart")
    .reduce((n, { depositAmount }) => n + depositAmount, 0)

  return (
    <div className="mt">
      {isError ? (
        <ImgError src={img} />
      ) : (
        <Grid
          container
          spacing={3}
          direction="row"
          justifyContent="center"
          alignItems="flex-start"
        >
          <Grid item xs={8}>
            <div className={classes.table}>
              <DataTable
                loading={isLoading}
                data={itemsToRender}
                error={isError}
              />
            </div>
          </Grid>

          {isLoading ? (
            <div>
              <CircularProgress className={classes.circLoader} size={250} />
            </div>
          ) : (
            <Grid item xs={4}>
              <div className={classes.statChart}>
                <StartChart
                  economSum={economSum}
                  fastSum={fastSum}
                  standartSum={standartSum}
                />
              </div>

              <Table className={classes.statsTable}>
                <TableHead>
                  <TableRow>
                    <TableCell className={classes.tableCell}>
                      {" "}
                      Total Deposits Amount
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      {" "}
                      {totalSumOfDeposits} ₴{" "}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className={classes.tableCell}>
                      Total Profit
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      {" "}
                      {totalProfit} ₴
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className={classes.tableCell}>
                      {" "}
                      Avarage rate
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      {" "}
                      {fixedAvrRate} %{" "}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className={classes.tableCell}>
                      {" "}
                      Avarage duration
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      {" "}
                      {fixedAvrDuration} month{" "}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className={classes.tableCell}>
                      {" "}
                      Avarage profit per month{" "}
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      {" "}
                      {fixedAvrProfitPerMonth} ₴{" "}
                    </TableCell>
                  </TableRow>
                </TableHead>
              </Table>
            </Grid>
          )}
        </Grid>
      )}
    </div>
  )
}

export default DepositsTable
