"use client";

import {
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Collapse,
  Divider,
  Button,
  Tooltip,
} from "@mui/material";
import React, { act, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import KeyboardArrowRightSharpIcon from "@mui/icons-material/KeyboardArrowRightSharp";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import "@/lib/i18n";
import icon1 from "@/assets/icons/navigation/icon1.svg";
import icon2 from "@/assets/icons/navigation/icon2.svg";
import icon3 from "@/assets/icons/navigation/icon3.svg";
import icon4 from "@/assets/icons/navigation/icon4.svg";
import icon5 from "@/assets/icons/navigation/icon5.svg";
import activeicon1 from "@/assets/icons/navigation/active-tickets.png";
import activeicon2 from "@/assets/icons/navigation/active/icon2.svg";
import activeicon3 from "@/assets/icons/navigation/active/icon3.svg";
import activeicon4 from "@/assets/icons/navigation/active/icon4.svg";

import phoneIcon from "@/assets/icons/navigation/phone.svg";
import aiAgnetIcon from "@/assets/icons/navigation/ai-agent-icon.svg";
import { isActivePath } from "@/utils/pathMatch";

import { useThemeStore } from "@/store/useThemeStore";
import Logout from "./Logout";

export default function Navigation({ open, openMenus, handleMenuClick }: any) {
  const pathname = usePathname();
  // const { t, i18n } = useTranslation()
  const { themeMode, toggleTheme } = useThemeStore();

  const navigation = [
    {
      i18nKey: "Tickets",
      href: "javascript:void(0)",
      pathname: "#",
      icon: icon1,
      activeIcon: activeicon1,
      subItems: [
        {
          i18nKey: "All Tickets",
          href: "/ticketing-system/tickets",
          pathname: "/ticketing-system/tickets",
        },
        {
          i18nKey: "Archived Tickets",
          href: "/ticketing-system/tickets/archive",
          pathname: "/ticketing-system/tickets/archive",
        },
        {
          i18nKey: "Deleted Tickets",
          href: "/ticketing-system/tickets/delete",
          pathname: "/ticketing-system/tickets/delete",
        },
      ],
    },

    {
      i18nKey: "User Management",
      href: "javascript:void(0)",
      pathname: "#",
      icon: icon2,
      activeIcon: activeicon2,
      subItems: [
        {
          i18nKey: "All Users",
          href: "/ticketing-system/all-users",
          pathname: "/ticketing-system/all-users",
        },
        {
          i18nKey: "Roles & Permissions",
          href: "/ticketing-system/roles-permission",
          pathname: "/ticketing-system/roles-permission",
        },
      ],
    },
    {
      i18nKey: "Department",
      href: "/ticketing-system/department",
      pathname: "/ticketing-system/department",
      icon: icon3,
      activeIcon: activeicon3,
    },
    {
      i18nKey: "Analytics",
      href: "/ticketing-system/analytics",
      pathname: "/ticketing-system/analytics",
      icon: icon4,
      activeIcon: activeicon4,
    },
    {
      i18nKey: "Company Profile",
      href: "/ticketing-system/company-profile",
      pathname: "/ticketing-system/company-profile",
      icon: icon5,
      activeIcon: icon5,
    },
     {
      i18nKey: "Email",
      href: "javascript:void(0)",
      pathname: "#",
      icon: icon1,
      activeIcon: activeicon1,
      subItems: [
        {
          i18nKey: "SMTP Configuration",
          href: "/ticketing-system/smtp-configuration",
          pathname: "/ticketing-system/smtp-configuration",
        },
        {
          i18nKey: "IMAP Configuration",
          href: "/ticketing-system/imap-configuration",
          pathname: "/ticketing-system/imap-configuration",
        },
      ],
    },
  ];

  return (
    <List
      sx={{
        height: "64vh",
        overflowY: "auto",
        mt: 8,
        pr: 1,
        "::-webkit-scrollbar": { width: "5px" },
      }}
    >
      {/* {open && (
        <Typography sx={{ mb: 1, color: 'rgba(0, 0, 0, 0.5)' }}>
          overview
        </Typography>
      )} */}
      {navigation.map((data, index) => (
        <React.Fragment key={index}>
          {data.i18nKey === "store" && <Divider sx={{ my: "30px" }} />}
          {data.subItems ? (
            <>
              {!open ? (
                <Tooltip
                  title={data.i18nKey}
                  placement="right"
                  arrow
                  key={index}
                  sx={{
                    display: "block",
                    position: "relative",
                    background: isActivePath(pathname, data.pathname)
                      ? "linear-gradient(90deg, #32ABB1 0%, #32ABB1 100%)"
                      : "",
                    borderRadius: open ? "100px" : "10px",
                    "& :hover": { borderRadius: open ? "100px" : "" },
                  }}
                >
                  <ListItem disablePadding>
                    <Link
                      href={data.href}
                      style={{
                        textDecoration: "none",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "100%",
                        padding: "9px",
                      }}
                    >
                      <Image
                        src={
                          isActivePath(pathname, data.pathname)
                            ? data.activeIcon
                            : data.icon
                        }
                        alt="icon"
                        // className={`nav-icon ${
                        //   isActivePath(pathname, data.pathname) ? 'active' : ''
                        // }`}
                        // style={{
                        //   filter: isActivePath(pathname, data.pathname)
                        //     ? 'invert(1) brightness(0.9)'
                        //     : 'none'
                        // }}
                      />
                    </Link>
                  </ListItem>
                </Tooltip>
              ) : (
                <>
                  <ListItem
                    className={`nav-item ${
                      isActivePath(pathname, data.pathname) ||
                      data.subItems.some((sub) => pathname === sub.pathname)
                        ? "active"
                        : ""
                    }`}
                    disablePadding
                    sx={{
                      display: "block",
                      background:
                        // openMenus[data.i18nKey] ||
                        isActivePath(pathname, data.pathname) ||
                        data.subItems.some((sub) => pathname === sub.pathname)
                          ? "linear-gradient(90deg, #32ABB1 0%, #3286BD 100%)"
                          : "",
                      borderRadius: open ? "30px" : "10px",
                      "& :hover": { borderRadius: open ? "10px" : "" },
                      color:
                        isActivePath(pathname, data.pathname) ||
                        data.subItems.some((sub) => pathname === sub.pathname)
                          ? "white"
                          : "#797979",

                      // mb: 1,
                      // overflow: 'hidden'
                    }}
                    onClick={() => handleMenuClick(data.i18nKey)}
                  >
                    <div
                      style={{
                        textDecoration: "none",
                        color:
                          isActivePath(pathname, data.pathname) ||
                          data.subItems.some((sub) => pathname === sub.pathname)
                            ? "white"
                            : "#797979",
                      }}
                    >
                      <ListItemButton
                        sx={[
                          {
                            minHeight: 48,
                            px: 2.5,
                            "&:hover": { borderRadius: "10px" },
                          },

                          open
                            ? { justifyContent: "initial" }
                            : { justifyContent: "center" },
                        ]}
                      >
                        <ListItemIcon
                          sx={[
                            {
                              minWidth: 0,
                              justifyContent: "center",
                              color:
                                isActivePath(pathname, data.pathname) ||
                                data.subItems.some(
                                  (sub) => pathname === sub.pathname
                                )
                                  ? "currentColor"
                                  : "currentColor",
                            },
                            open ? { mr: 2 } : { mr: "auto" },
                          ]}
                        >
                          <Image
                            src={
                              isActivePath(pathname, data.pathname)
                                ? data.activeIcon
                                : data.icon
                            }
                            alt="icon"
                            // style={{
                            //   filter:
                            //     isActivePath(pathname, data.pathname) ||
                            //     data.subItems.some(
                            //       sub => pathname === sub.pathname
                            //     )
                            //       ? 'invert(1) brightness(0.9)'
                            //       : 'none'
                            // }}
                            // className={`nav-icon ${
                            //   isActivePath(pathname, data.pathname) ||
                            //   data.subItems.some(
                            //     sub => pathname === sub.pathname
                            //   )
                            //     ? 'active'
                            //     : ''
                            // }`}
                          />
                        </ListItemIcon>
                        <ListItemText
                          sx={[open ? { opacity: 1 } : { opacity: 0 }]}
                        >
                          <Typography
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            {data.i18nKey}
                          </Typography>
                        </ListItemText>
                        {open && (
                          <IconButton
                            size="small"
                            sx={{
                              color:
                                isActivePath(pathname, data.pathname) ||
                                data.subItems.some(
                                  (sub) => pathname === sub.pathname
                                )
                                  ? ""
                                  : "",
                            }}
                          >
                            {openMenus[data.i18nKey] ? (
                              <ExpandLess
                                sx={{
                                  color:
                                    isActivePath(pathname, data.pathname) ||
                                    data.subItems.some(
                                      (sub) => pathname === sub.pathname
                                    )
                                      ? "white"
                                      : "",
                                }}
                              />
                            ) : (
                              <KeyboardArrowRightSharpIcon
                                sx={{
                                  color:
                                    isActivePath(pathname, data.pathname) ||
                                    data.subItems.some(
                                      (sub) => pathname === sub.pathname
                                    )
                                      ? "white"
                                      : "",
                                }}
                              />
                            )}
                          </IconButton>
                        )}
                      </ListItemButton>
                    </div>
                  </ListItem>
                  <Collapse
                    in={openMenus[data.i18nKey]}
                    timeout="auto"
                    unmountOnExit
                  >
                    <List
                      component="div"
                      disablePadding
                      className="sub-menu"
                      sx={{
                        background:
                          "linear-gradient(90deg, #32abb13c 0%, #3285bd38 100%)",
                      }}
                    >
                      {data.subItems.map((subItem, subIndex) => (
                        <ListItem
                          key={subIndex}
                          disablePadding
                          sx={{
                            display: "block",
                            pl: open ? 4 : 0,
                            borderRadius: open ? "10px" : "",
                            mb: 1,
                            overflow: "hidden",
                          }}
                        >
                          <Link
                            href={subItem.href}
                            style={{
                              textDecoration: "none",
                              color:
                                pathname === subItem.pathname
                                  ? "var(--pri-color)"
                                  : "#797979",
                              fontWeight:
                                pathname === subItem.pathname ? "bold" : "400",
                            }}
                          >
                            <ListItemButton
                              sx={{
                                minHeight: 48,
                                px: 2.5,
                                borderRadius: "10px",
                                "&:hover": {
                                  background: "transparent !important",
                                },

                                // background:
                                //   pathname === subItem.pathname ? "#32abb12e" : "",
                              }}
                            >
                              <ListItemText
                                sx={[open ? { opacity: 1 } : { opacity: 0 }]}
                              >
                                <Typography>{subItem.i18nKey}</Typography>
                              </ListItemText>
                            </ListItemButton>
                          </Link>
                        </ListItem>
                      ))}
                    </List>
                  </Collapse>
                </>
              )}
            </>
          ) : (
            <>
              {!open ? (
                <Tooltip
                  title={data.i18nKey}
                  placement="right"
                  arrow
                  key={index}
                  sx={{
                    display: "block",
                    position: "relative",
                    background: isActivePath(pathname, data.pathname)
                      ? "linear-gradient(90deg, #32ABB1 0%, #3286BD 100%)"
                      : "",
                    borderRadius: "10px",
                    "& :hover": { borderRadius: open ? "10px" : "" },
                  }}
                >
                  <ListItem disablePadding>
                    <Link
                      href={data.href}
                      style={{
                        textDecoration: "none",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "100%",
                        padding: "9px",
                      }}
                    >
                      <Image
                        src={
                          isActivePath(pathname, data.pathname)
                            ? data.activeIcon
                            : data.icon
                        }
                        alt="icon"
                        // className={`nav-icon ${
                        //   isActivePath(pathname, data.pathname) ? 'active' : ''
                        // }`}
                        // style={{
                        //   filter: isActivePath(pathname, data.pathname)
                        //     ? 'invert(1) brightness(0.9)'
                        //     : 'none'
                        // }}
                      />
                    </Link>
                  </ListItem>
                </Tooltip>
              ) : (
                <ListItem
                  className={`nav-item ${
                    isActivePath(pathname, data.pathname) ? "active" : ""
                  }`}
                  key={index}
                  disablePadding
                  sx={{
                    display: "block",
                    position: "relative",
                    background: isActivePath(pathname, data.pathname)
                      ? "linear-gradient(90deg, #32ABB1 0%, #3286BD 100%)"
                      : "",
                    borderRadius: "25px",
                    "& :hover": { borderRadius: open ? "10px" : "" },

                    // mb: 1
                    // overflow: 'hidden'
                  }}
                >
                  <Link
                    href={data.href}
                    style={{
                      textDecoration: "none",
                      // fontWeight: 'bold',
                      color: isActivePath(pathname, data.pathname)
                        ? "white"
                        : "#797979",
                    }}
                  >
                    <ListItemButton
                      sx={[
                        {
                          minHeight: 48,
                          px: 2.5,
                          "&:hover": {
                            borderRadius: "10px",
                            background: "transparent",
                          },
                        },
                        open
                          ? { justifyContent: "initial" }
                          : { justifyContent: "center" },
                      ]}
                    >
                      <ListItemIcon
                        sx={[
                          {
                            minWidth: 0,
                            justifyContent: "center",
                            color: isActivePath(pathname, data.pathname)
                              ? "var(--pri-color)"
                              : "#797979",
                          },
                          open ? { mr: 2 } : { mr: "auto" },
                        ]}
                      >
                        <Image
                          src={
                            isActivePath(pathname, data.pathname)
                              ? data.activeIcon
                              : data.icon
                          }
                          alt="icon"
                          // className={`nav-icon ${
                          //   isActivePath(pathname, data.pathname)
                          //     ? 'active'
                          //     : ''
                          // }`}
                          // style={{
                          //   filter: isActivePath(pathname, data.pathname)
                          //     ? 'invert(1) brightness(0.9)'
                          //     : 'none'
                          // }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        sx={[open ? { opacity: 1 } : { opacity: 0 }]}
                      >
                        <Typography
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            fontWeight: isActivePath(pathname, data.pathname)
                              ? "600"
                              : "400",
                          }}
                        >
                          {data.i18nKey}
                        </Typography>
                      </ListItemText>
                    </ListItemButton>
                  </Link>
                </ListItem>
              )}
            </>
          )}
          {data.i18nKey === "help" && <Divider sx={{ my: "30px" }} />}
        </React.Fragment>
      ))}

      <Logout open={open} />
      {/* <div style={{ padding: '0 22px', marginTop: '10px' }}>
        <Button
          onClick={() => i18n.changeLanguage('en')}
          sx={{ mr: 1 }}
          variant="outlined"
          size="small"
        >
          {t('english')}
        </Button>
        <Button
          onClick={() => i18n.changeLanguage('ur')}
          variant="outlined"
          size="small"
        >
          {t('urdu')}
        </Button>
        <Button
          onClick={toggleTheme}
          sx={{ mr: 1, mt: 1 }}
          variant={themeMode === 'light' ? 'contained' : 'outlined'}
          size="small"
        >
          {t('theme.light')}
        </Button>
        <Button
          onClick={toggleTheme}
          sx={{ mt: 1 }}
          variant={themeMode === 'dark' ? 'contained' : 'outlined'}
          size="small"
        >
          {t('theme.dark')}
        </Button>
      </div> */}
    </List>
  );
}
