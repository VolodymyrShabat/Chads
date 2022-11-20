import {
  Table,
  TableRow,
  TableCell,
  TableHead,
  makeStyles,
} from "@material-ui/core"
import React from "react"

const useStyles = makeStyles((theme) => ({
  tableCell: {
    color: "rgb(0 0 0 / 70%)",
  },
}))

function DepositCalcTable({
  depAmount,
  profitPerMonth,
  interestRate,
  duration,
  totalAmountOfDeposit,
  totalAmountOfProfit,
}) {
  const classes = useStyles()
  return (
    <div>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell className={classes.tableCell}> Deposit Amount</TableCell>
            <TableCell className={classes.tableCell}> {depAmount} ₴ </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.tableCell}>
              {" "}
              Profit per month
            </TableCell>
            <TableCell className={classes.tableCell}>
              {" "}
              {profitPerMonth} ₴{" "}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.tableCell}>
              {" "}
              Deposit interestRate{" "}
            </TableCell>
            <TableCell className={classes.tableCell}>
              {" "}
              {interestRate} %
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.tableCell}>
              {" "}
              Deposit duration
            </TableCell>
            <TableCell className={classes.tableCell}>
              {" "}
              {duration} month{" "}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.tableCell}>
              {" "}
              Total amount with profit{" "}
            </TableCell>
            <TableCell className={classes.tableCell}>
              {" "}
              {totalAmountOfDeposit} ₴{" "}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.tableCell}>
              {" "}
              Amount of pure profit{" "}
            </TableCell>
            <TableCell className={classes.tableCell}>
              {" "}
              {totalAmountOfProfit} ₴{" "}
            </TableCell>
          </TableRow>
        </TableHead>
      </Table>
    </div>
  )
}

export default React.memo(DepositCalcTable)
