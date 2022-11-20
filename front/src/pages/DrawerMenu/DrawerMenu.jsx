/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
import React, { useEffect } from "react"
import clsx from "clsx"

import MonetizationOnIcon from "@material-ui/icons/MonetizationOn"
import MenuIcon from "@material-ui/icons/Menu"
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft"
import CreditCardIcon from "@material-ui/icons/CreditCard"
import FaceIcon from "@material-ui/icons/Face"
import AccountBalanceWalletIcon from "@material-ui/icons/AccountBalanceWallet"
import AccountBalanceIcon from "@material-ui/icons/AccountBalance"
import LogOutIcon from "@material-ui/icons/ExitToApp"
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  Typography,
  CssBaseline,
  List,
  Toolbar,
  AppBar,
  Drawer,
} from "@material-ui/core"

import { NavLink } from "react-router-dom"
import {
  createTheme,
  ThemeProvider,
  makeStyles,
} from "@material-ui/core/styles"
import { useSelector, useDispatch } from "react-redux"
import jwtDecode from "jwt-decode"
import { selectUser, logout } from "../auth/userSlice"
import AuthService from "../auth/authApi"

const theme = createTheme({
  overrides: {
    MuiListItemIcon: {
      root: {
        color: "inherit",
      },
    },
  },
})

const drawerWidth = 230

const useStyles = makeStyles(() => ({
  root: {
    marginTop: 60,
    display: "flex",
    color: "#595B83",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
  },
  drawerOpen: {
    borderRight: "0px",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    borderRight: "0px",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    backgroundColor: "#3F51B5",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(0),
  },
  typography: {
    marginLeft: 20,
  },
}))

const activeStyle = {
  fontWeight: "bold",
  color: "#4A69FF",
  textDecoration: "none",
}

export default function DrawerMenu() {
  const classes = useStyles()
  let token = localStorage.getItem("access_token")
  let decoded = token && jwtDecode(token)
  const dispatch = useDispatch()

  useEffect(() => {
    token = localStorage.getItem("access_token")
    decoded = token && jwtDecode(token)
  })

  // eslint-disable-next-line no-unused-vars
  const { loginState } = useSelector(selectUser)
  const [open, setOpen] = React.useState(true)

  const itemsDrawer = [
    {
      text: "Cards",
      icon: <CreditCardIcon />,
      link: "/cards",
    },
    {
      text: "Transactions",
      icon: <AccountBalanceWalletIcon />,
      link: "/transactions",
    },
    {
      text: "Deposits",
      icon: <AccountBalanceIcon />,
      link: "/deposits/",
    },
    {
      isAdmin: true,
      text: "Admin",
      icon: <FaceIcon />,
      link: "/admin",
    },
    {
      text: "Bank accounts",
      icon: <MonetizationOnIcon />,
      link: "/bankaccounts",
      borderBottom: "1px solid #dcdcdc",
    },
    {
      everyone: true,
      text: "Log out",
      icon: <LogOutIcon />,
      link: "/login",

      onClick: () => {
        dispatch(logout())
        AuthService.logout()
      },
    },
  ]

  const handleDrawerOpen = () => {
    setOpen(true)
  }

  const handleDrawerClose = () => {
    setOpen(false)
  }
  useEffect(() => {
    if (loginState) {
      setOpen(true)
    }
  }, [loginState])
  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={clsx(classes.appBar)}>
        <Toolbar>
          <IconButton
            /* Disable button if user not sign-up */
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: localStorage.getItem("access_token")
                ? open
                : true,
            })}
          >
            <MenuIcon />
          </IconButton>

          <IconButton
            edge="start"
            style={{ color: "white" }}
            onClick={handleDrawerClose}
            className={clsx(classes.menuButton, {
              [classes.hide]: localStorage.getItem("access_token")
                ? !open
                : true,
            })}
          >
            <ChevronLeftIcon />
          </IconButton>

          <Typography className={classes.typography} variant="h6" noWrap>
            ABank
          </Typography>
        </Toolbar>
      </AppBar>
      {localStorage.getItem("access_token") && (
        <Drawer
          variant="permanent"
          className={clsx(classes.drawer, {
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          })}
          classes={{
            paper: clsx(classes.root, {
              [classes.drawerOpen]: open,
              [classes.drawerClose]: !open,
            }),
          }}
        >
          <Divider />
          <List>
            {itemsDrawer.map((item, index) => {
              const { icon, text, link, onClick, marginTop, borderBottom } =
                item
              switch (decoded.role) {
                case "Admin":
                  if (item.isAdmin || item.everyone) {
                    return (
                      <ListItem
                        style={{ marginTop, borderBottom }}
                        button
                        component={NavLink}
                        activeStyle={activeStyle}
                        key={text}
                        to={link}
                        onClick={onClick}
                      >
                        <ThemeProvider theme={theme}>
                          <ListItemIcon>{icon}</ListItemIcon>
                        </ThemeProvider>

                        <ListItemText primary={text} />
                      </ListItem>
                    )
                  }
                  break
                case "User":
                  if (!item.isAdmin || item.everyone) {
                    return (
                      <ListItem
                        style={{ marginTop, borderBottom }}
                        button
                        component={NavLink}
                        activeStyle={activeStyle}
                        key={text}
                        to={link}
                        onClick={onClick}
                      >
                        <ThemeProvider theme={theme}>
                          <ListItemIcon>{icon}</ListItemIcon>
                        </ThemeProvider>

                        <ListItemText primary={text} />
                      </ListItem>
                    )
                  }
                  break
                default:
                  break
              }
            })}
          </List>
        </Drawer>
      )}
    </div>
  )
}
