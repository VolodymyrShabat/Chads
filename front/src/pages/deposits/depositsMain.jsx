import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import Tabs from "@material-ui/core/Tabs"
import Tab from "@material-ui/core/Tab"
import DepositCalculator from "./depositCalc/Calculator"
import DepositsTable from "./depositsDataTable/depositsTable"
import OpenForm from "./openForm/OpenForm"

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    marginRight: 920,
    marginTop: 10,
  },
})

export default function DepositTabs(props) {
  const { match, history } = props
  const { params } = match
  const { page } = params

  const classes = useStyles()

  const tabNameToIndex = {
    0: "my",
    1: "calculator",
    2: "open",
  }

  const indexToTabName = {
    my: 0,
    calculator: 1,
    open: 2,
  }

  const [selectedTab, setSelectedTab] = React.useState(indexToTabName[page])

  const handleChange = (event, newValue) => {
    history.push(`/deposits/${tabNameToIndex[newValue]}`)
    setSelectedTab(newValue)
  }

  return (
    <>
      <Tabs
        className={classes.root}
        value={selectedTab}
        onChange={handleChange}
        indicatorColor="primary"
        textColor="primary"
        centered
      >
        <Tab label="My deposits" />
        <Tab label="Deposit calculator" />
        <Tab label="Open new deposit" />
      </Tabs>

      {selectedTab === 0 && <DepositsTable />}
      {selectedTab === 1 && <DepositCalculator />}
      {selectedTab === 2 && <OpenForm />}
    </>
  )
}
