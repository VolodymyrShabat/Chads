import React from "react"
import { MenuItem, FormControl, Select } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import { useDispatch, useSelector } from "react-redux"

import { setFilter } from "./depositsFilterSlice"

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 90,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}))

function FilterStatus() {
  const classes = useStyles()

  const dispatch = useDispatch()
  const filterVal = useSelector((state) => state.filter.filter)

  return (
    <div>
      <FormControl className={classes.formControl}>
        <Select
          disableUnderline
          labelId="Status"
          id="select"
          value={filterVal}
          onChange={(e) => dispatch(setFilter(e.target.value))}
          label="Status"
        >
          <MenuItem value="all">Status</MenuItem>
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="closed">Closed</MenuItem>
        </Select>
      </FormControl>
    </div>
  )
}

export default FilterStatus
