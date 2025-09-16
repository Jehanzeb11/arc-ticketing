"use client";
import * as React from "react";
import { styled, Theme, CSSObject } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";
import useCustomMediaQuery from "@/hooks/useCustomMediaQuery";

import logo from "@/assets/images/auth/auth-logo.svg";
import smalllogo from "@/assets/images/small-logo.svg";
import Navigation from "./Navigation";
import AppBar from "./AppBar";
import CloseSideBarIcon from "@/assets/icons/navigation/closeSidebarIcon.svg";
import OpenSideBarIcon from "@/assets/icons/navigation/openSidebarIcon.svg";
import Link from "next/link";
import adminprofileLogo from "@/assets/icons/navigation/adminProfileIcon.svg";
import Typography from "@mui/material/Typography";
import Cookies from "js-cookie";
import { Avatar } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useApiStore } from "@/lib/api/apiStore";
import { imageUrl } from "@/lib/constants/variables";

const drawerWidth = 270;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  padding: "34px 15px",
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  padding: "10px",

  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  variants: [
    {
      props: ({ open }) => open,
      style: {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme),
      },
    },
    {
      props: ({ open }) => !open,
      style: {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme),
      },
    },
  ],
}));

export default function Sidebar() {
  const { fetchAdminProfile, callApi, setProfile }: any = useApiStore();

  const [open, setOpen] = React.useState(true);
  const isMobile = useCustomMediaQuery("(max-width:767px)");
  const [isNavVisible, setIsNavVisible] = React.useState(!isMobile);
  const [openMenus, setOpenMenus] = React.useState<{ [key: string]: boolean }>(
    {}
  );

  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: fetchAdminProfile,
    staleTime: Infinity,
  });

  React.useEffect(() => {
    if (user) {
      setProfile(user); // update Zustand global state
    }
  }, [user]);

  React.useEffect(() => {
    setIsNavVisible(!isMobile);
  }, [isMobile]);

  const handleDrawerClose = () => {
    setOpen(false);
    setOpenMenus({});
  };

  const toggleNavVisibility = () => {
    setIsNavVisible((prev) => !prev);
  };

  const handleMenuClick = (label: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
    setOpen(true);
  };
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  return (
    <Box sx={{ display: "flex" }} className="main-sidebar">
      <CssBaseline />

      <IconButton
        onClick={toggleNavVisibility}
        edge="start"
        color="inherit"
        aria-label="toggle sidebar"
        sx={{ color: "primary.main", zIndex: 9999, height: "50px", ml: "0px" }}
        className="menu-icon"
      >
        {isNavVisible ? <CloseIcon /> : <MenuIcon />}
      </IconButton>
      <div
        className={`main-nav ${isNavVisible ? "visible" : ""}`}
        // style={{ display: isNavVisible ? "block" : "none" }}
      >
        <Drawer variant="permanent" open={open}>
          <DrawerHeader sx={{ justifyContent: "center" }}>
            {open ? (
              <Box
                className=" main-logo"
                sx={{ mt: 5 }}
                // sx={[
                //   {
                //     width: '163px',
                //     py: 1,
                //     mb: 2
                //   }
                //   // open ? { display: "block" } : { display: "none" },
                // ]}
              >
                <Image src={logo} alt="logo" />
              </Box>
            ) : (
              <Image
                src={smalllogo}
                alt="logo"
                style={{ marginTop: "23px" }}
                // style={{
                //   maxWidth: "100%",
                //   height: "100%",
                //   marginLeft: "50%",
                //   transform: "translate(-85%, 0%)",
                // }}
              />
            )}

            <AppBar
              open={open}
              setOpen={setOpen}
              drawerWidth={drawerWidth}
              handleDrawerClose={handleDrawerClose}
              user={user}
            />
          </DrawerHeader>
          <Navigation
            open={open}
            openMenus={openMenus}
            handleMenuClick={handleMenuClick}
          />
          {/* <Typography
            variant="body1"
            color="initial"
            className="navigation-label"
          >
            {" "}
            <Image
              src={imageUrl + user?.picture}
              alt="Profile"
              width={20}
              height={20}
              style={{ objectFit: "cover", borderRadius: "50%" }}
            />
            {user?.full_name || "User"}
          </Typography> */}
          <Link
            href="/ticketing-system/admin-profile"
            className="navigation-label"
          >
            {" "}
            <Image
              src={imageUrl + user?.data?.picture}
              alt="Profile"
              width={20}
              height={20}
            />
            {user?.data?.full_name || "User"}
          </Link>
          <>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={[
                open && {
                  display: "none",
                },
                {
                  position: "absolute",
                  top: "100px",
                  left: "31px",
                  "&:hover": {
                    backgroundColor: "transparent",
                  },
                },
              ]}
            >
              <Image src={OpenSideBarIcon} alt="Back" />
            </IconButton>

            {/* {open && (
              <IconButton
                onClick={handleDrawerClose}
                sx={{
                  padding: 0,
                  '&hover': { backgroundColor: 'transparent' },
                  position: 'absolute',
                  top: '120px',
                  right: '0'
                }}
              >
                <Image src={CloseSideBarIcon} alt='Back' className='ajdyhadu' />
              </IconButton>
            )} */}
          </>
        </Drawer>
      </div>
    </Box>
  );
}
