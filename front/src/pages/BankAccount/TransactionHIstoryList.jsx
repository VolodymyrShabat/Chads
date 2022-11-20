import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import { Divider } from "@material-ui/core"
import TablePagination from "@material-ui/core/TablePagination"
import List from "@material-ui/core/List"
import { v1 as uuid } from "uuid"
import TransactionHistory from "./TransactionHistory"

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: "60ch",
  },
  text: {
    width: "400px",
    color: "#4D5863",
    fontSize: "20px",
    fontFamily: `"Libre Baskerville", serif`,
    marginTop: "30px",
  },
  inline: {
    display: "inline",
  },
  mainBox: {
    display: "flex",
    flexDirection: "column",
  },
  paginator: {
    justifyContent: "center",
    padding: "10px",
    width: "150%",
  },
  paginatorbox: {
    display: "flex",
    justifyContent: "left",
  },
  dividerHistory: {
    width: "133%",
  },
}))

function TransactionHistoryList({ data }) {
  const classes = useStyles()
  const itemsPerPage = 6
  const [page, setPage] = React.useState(0)
  const handleChange = (event, value) => {
    setPage(value)
  }
  return data.length > 0 ? (
    <div className={classes.mainBox}>
      <List className={classes.root}>
        {data
          .slice(page * itemsPerPage, (page + 1) * itemsPerPage)
          .map((element) => (
            <TransactionHistory
              key={uuid()}
              transaction={element}
              useraccountId={data[data.length - 1].ReceiverId}
            >
              {" "}
            </TransactionHistory>
          ))}
      </List>
      <Divider className={classes.dividerHistory} />
      <div className={classes.paginatorbox}>
        <TablePagination
          count={data.length}
          page={page}
          onPageChange={handleChange}
          rowsPerPage={itemsPerPage}
          component="div"
          rowsPerPageOptions={[]}
          classes={{ ul: classes.paginatorbox }}
        />
      </div>
    </div>
  ) : (
    <div className={classes.text}>You don&apos;t have any transaction yet</div>
  )
}
export default TransactionHistoryList
