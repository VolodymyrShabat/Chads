import React, { useState } from "react"
// import { makeStyles } from "@material-ui/core/styles"
import { Divider, CircularProgress, ListItem } from "@material-ui/core"
import TablePagination from "@material-ui/core/TablePagination"
import { makeStyles } from "@material-ui/core/styles"
import "./css/UserBankAccounts.css"
import BankAccount from "./BankAccount"
import {
  useFetchUserBankAccountsQuery,
  useFetchTransactionHistoryQuery,
} from "./BankAccountsApiSlice"
import TransactionHistoryList from "./TransactionHIstoryList"
import UpdateLimitForm from "./UpdateLimitForm"

const useStyles = makeStyles({
  pagination: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    justifyContent: "left",
    marginLeft: "280px",
  },
  list: { display: "flex", flexDirection: "column" },
  divider: {
    width: "60%",
  },
  progress: {
    margin: "200px 0 0 200px",
  },
  buttonCircularProccess: {
    margin: "10% auto",
  },
})

function UserBankAccounts({ id }) {
  const classes = useStyles()
  const {
    data = [{ Id: 0 }],
    isLoading,
    isFetching: FetchingAccounts,
    isSuccess,
  } = useFetchUserBankAccountsQuery()
  const [selected, setSelected] = useState(id)
  const {
    data: transactionHistory = [],
    isLoading: isLoadingTransactionsHistory,
    isFetching,
  } = useFetchTransactionHistoryQuery(selected)
  const [openId, setOpenId] = useState(0)
  const itemsPerPage = 3
  const [page, setPage] = React.useState(0)
  const handleChange = (event, value) => {
    setPage(value)
  }
  React.useEffect(() => {
    if (data.length > 0 && isSuccess && id === undefined) {
      setSelected(data[0].Id)
    }
  }, [isSuccess])
  if (isLoading) {
    return (
      <CircularProgress size={200} className={classes.buttonCircularProccess} />
    )
  }
  return data.length > 1 ? (
    <>
      <h1 className="titleAccounts">Your bank accounts</h1>
      <div className="userBankAccountsInfo">
        <div className="userBankAccounts">
          {data.slice(page * 3, (page + 1) * 3).map((element) => (
            <ListItem className={classes.list} key={element.Id}>
              <BankAccount
                id={element.Id}
                transactionLimit={element.TransactionLimit}
                amount={element.Amount}
                setOpenId={setOpenId}
                openId={openId}
                setSelected={setSelected}
                selected={selected}
                cardNumber={element.CardNumber}
              />
              {openId === element.Id ? (
                <UpdateLimitForm
                  isFetching={FetchingAccounts}
                  id={element.Id}
                  transactionLimit={element.TransactionLimit}
                />
              ) : null}
            </ListItem>
          ))}
          {data.length > 3 ? (
            <>
              <br />
              <Divider className={classes.divider} />
              <div className={classes.pagination}>
                <TablePagination
                  count={data.length}
                  page={page}
                  onPageChange={handleChange}
                  rowsPerPage={itemsPerPage}
                  component="div"
                  rowsPerPageOptions={[]}
                />
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
        <>
          {isLoadingTransactionsHistory || isFetching ? (
            <CircularProgress className={classes.progress} size={80} />
          ) : (
            <TransactionHistoryList data={transactionHistory} />
          )}
        </>
      </div>
    </>
  ) : (
    <h1 className="titleAccountsEmpty">
      You don&apos;t have any bank accounts yet
    </h1>
  )
}
export default UserBankAccounts
