"use client"

import { useState, useEffect, useRef } from "react"
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  InputAdornment,
  Tooltip,
  Collapse,
  IconButton,
  Typography,
  Avatar,
  useMediaQuery,
  useTheme,
  Drawer,
} from "@mui/material"
import {
  BarChart as BarChartIcon,
  Balance as BalanceIcon,
  TrendingUp as TrendingUpIcon,
  Receipt as ReceiptIcon,
  People as TeamIcon,
  DirectionsCar as CarIcon,
  Business as BusinessIcon,
  KeyboardArrowDown,
  Search,
  Logout,
  Menu as MenuIcon,
  LocalShipping as TruckIcon,
  FindInPage as InspectionIcon,
  CommuteRounded as FleetIcon,
} from "@mui/icons-material"

const greenColors = {
  deepGreen: "#1b5e20",
  mainGreen: "#379E50",
  lightGreen: "#CFD989",
}

export default function Sidebar({ onCollapse, user }) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const [isRouterReady, setIsRouterReady] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openSubMenu, setOpenSubMenu] = useState(null)
  const [activeItem, setActiveItem] = useState("")
  const [filteredMenuItems, setFilteredMenuItems] = useState([])
  const sidebarContentRef = useRef(null)

  // Define menu items
  const menuItems = [
    { text: "Dashboard de Pesagem", icon: BarChartIcon, path: "/dashboard/pesagem" },
    { text: "Cadastro de Pesagem", icon: BalanceIcon, path: "/cadastro/cadastro" },
    { text: "Resumo de Pesagem", icon: TrendingUpIcon, path: "/resumo_pesagem/resumo_pesagens_rel" },
    {
      text: "Controle e Registro",
      icon: ReceiptIcon,
      subItems: [
        { text: "Colaboradores", icon: TeamIcon, path: "/colaborador/colaboradores_page" },
        { text: "Veículos", icon: CarIcon, path: "/veiculos/veiculos_page" },
        { text: "Cooperativas", icon: BusinessIcon, path: "/cooperativas/cooperativa_page" },
      ],
    },
    {
      text: "Controle de Frota",
      icon: FleetIcon,
      subItems: [
        { text: "Controle de Remoções", icon: TruckIcon, path: "/" },
        { text: "Averiguação de Rotas", icon: InspectionIcon, path: "/averiguacao/averiguacao_page" },
      ],
    },
  ]

  useEffect(() => {
    setFilteredMenuItems(menuItems)
  }, [])

  useEffect(() => {
    if (searchValue.trim() === "") {
      setFilteredMenuItems(menuItems)
      return
    }

    // Remove accents and convert to lowercase
    const normalizeText = (text) =>
      text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()

    const searchNormalized = normalizeText(searchValue)

    const filtered = menuItems.reduce((acc, item) => {
      const mainItemMatches = normalizeText(item.text).includes(searchNormalized)

      let matchingSubItems = []
      if (item.subItems) {
        matchingSubItems = item.subItems.filter((subItem) => normalizeText(subItem.text).includes(searchNormalized))
      }

      if (mainItemMatches || matchingSubItems.length > 0) {
        const newItem = { ...item }
        if (item.subItems) {
          newItem.subItems = matchingSubItems.length > 0 ? matchingSubItems : item.subItems
          if (matchingSubItems.length > 0 && searchValue.trim() !== "") {
            setOpenSubMenu(item.text)
          }
        }
        acc.push(newItem)
      }
      return acc
    }, [])

    setFilteredMenuItems(filtered)
  }, [searchValue])

  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window !== "undefined") {
      const handleResize = () => {
        if (window.innerWidth < 768 && !isCollapsed) {
          setIsCollapsed(true)
          if (onCollapse) onCollapse(true)
        }
      }

      // Initial check
      handleResize()

      // Add event listener
      window.addEventListener("resize", handleResize)

      // Cleanup
      return () => window.removeEventListener("resize", handleResize)
    }
  }, [isCollapsed, onCollapse])

  const toggleCollapse = () => {
    const newCollapsedState = !isCollapsed
    setIsCollapsed(newCollapsedState)
    if (onCollapse) onCollapse(newCollapsedState)
  }

  const toggleMobileDrawer = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleNavigation = (path, itemText) => {
    if (isRouterReady && path) {
      setActiveItem(itemText)
      if (isMobile) {
        setMobileOpen(false)
      }
      // router.push(path) - commented out as we don't have router in this example
    }
  }

  const toggleSubMenu = (menuName) => {
    const isOpening = openSubMenu !== menuName
    setOpenSubMenu(isOpening ? menuName : null)

    // If opening the Controle de Frota section, scroll the sidebar down
    if (isOpening && menuName === "Controle de Frota" && sidebarContentRef.current) {
      setTimeout(() => {
        const element = sidebarContentRef.current.querySelector(`[data-menu-name="${menuName}"]`)
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" })
        }
      }, 100) // Small delay to ensure the submenu is rendered
    }
  }

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value)
  }

  const sidebarContent = (
    <>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: isCollapsed ? "center" : "space-between",
          p: isCollapsed ? "1.5rem 0" : "1.5rem",
          borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
          background: "rgba(0, 0, 0, 0.1)",
        }}
      >
        {!isCollapsed && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              cursor: "pointer",
              transition: "transform 0.2s ease",
              "&:hover": { transform: "scale(1.02)" },
            }}
          >
            <Box sx={{ width: 150, height: 70, position: "relative", mb: 0.5 }}>
              {/* Placeholder for Image component */}
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  background: "rgba(255, 255, 255, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  filter: "brightness(0) invert(1)",
                }}
              >
                LimpaGyn Logo
              </div>
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                fontSize: "1.3rem",
                letterSpacing: "0.5px",
                textShadow: "0px 2px 4px rgba(0,0,0,0.2)",
              }}
            >
              LimpaGyn
            </Typography>
          </Box>
        )}
        <IconButton
          onClick={isMobile ? toggleMobileDrawer : toggleCollapse}
          sx={{
            color: "#fff",
            backgroundColor: "rgba(255, 255, 255, 0.15)",
            borderRadius: "50%",
            width: 40,
            height: 40,
            transition: "all 0.5s ease",
            "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.25)", transform: "rotate(180deg)" },
          }}
        >
          {isMobile ? <MenuIcon size={20} /> : <MenuIcon size={20} />}
        </IconButton>
      </Box>

      {/* User area */}
      {!isCollapsed && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            p: "1.2rem 1.5rem",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          <Avatar
            src={user?.avatarUrl || ""}
            sx={{
              width: 48,
              height: 48,
              bgcolor: "rgba(255, 255, 255, 0.2)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              fontSize: "1.2rem",
            }}
          >
            {!user?.avatarUrl && user?.name
              ? user.name.charAt(0).toUpperCase()
              : user?.email
                ? user.email.charAt(0).toUpperCase()
                : "U"}
          </Avatar>
          <Box sx={{ ml: 2 }}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, color: "#fff", fontSize: "0.95rem", lineHeight: 1.2 }}
            >
              {user?.name || user?.email || "Usuário"}
            </Typography>
            <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "0.8rem" }}>
              Sistema de Pesagem
            </Typography>
          </Box>
        </Box>
      )}

      {/* Search bar */}
      {!isCollapsed && (
        <Box sx={{ p: "1.2rem 1.5rem 0.8rem" }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Pesquisar..."
            value={searchValue}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search color="rgba(255, 255, 255, 0.8)" size={20} />
                </InputAdornment>
              ),
            }}
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              borderRadius: "12px",
              "& .MuiOutlinedInput-root": {
                height: "42px",
                color: "white",
                "& fieldset": { borderColor: "transparent", borderRadius: "12px" },
                "&:hover fieldset": { borderColor: "rgba(255, 255, 255, 0.3)" },
                "&.Mui-focused fieldset": { borderColor: "rgba(255, 255, 255, 0.5)", borderWidth: "1px" },
              },
              "& .MuiInputBase-input::placeholder": { color: "rgba(255, 255, 255, 0.8)", opacity: 1 },
              boxShadow: "inset 0 2px 8px rgba(0,0,0,0.1)",
            }}
          />
        </Box>
      )}

      {/* Menu items */}
      <Box
        ref={sidebarContentRef}
        sx={{
          mt: 2,
          px: isCollapsed ? 1 : 1.5,
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden", // Prevent horizontal scrollbar
          "&::-webkit-scrollbar": { width: "4px" },
          "&::-webkit-scrollbar-track": { background: "rgba(255, 255, 255, 0.05)" },
          "&::-webkit-scrollbar-thumb": { background: "rgba(255, 255, 255, 0.2)", borderRadius: "4px" },
          "&::-webkit-scrollbar-thumb:hover": { background: "rgba(255, 255, 255, 0.3)" },
        }}
      >
        <List sx={{ px: 0 }}>
          {filteredMenuItems.map((item) => (
            <Box key={item.text}>
              <Tooltip title={isCollapsed ? item.text : ""} placement="right" arrow>
                <ListItem
                  button
                  data-menu-name={item.text}
                  sx={{
                    mb: "0.6rem",
                    p: isCollapsed ? "12px 0" : "10px 12px",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: activeItem === item.text ? "rgba(255, 255, 255, 0.18)" : "transparent",
                    transition: "all 0.2s ease",
                    "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.12)", transform: "translateX(4px)" },
                    justifyContent: isCollapsed ? "center" : "flex-start",
                  }}
                  onClick={() => {
                    if (item.subItems) {
                      if (!isCollapsed) {
                        toggleSubMenu(item.text)
                      } else {
                        setIsCollapsed(false)
                        toggleSubMenu(item.text)
                        if (onCollapse) onCollapse(false)
                      }
                    } else {
                      handleNavigation(item.path, item.text)
                    }
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: activeItem === item.text ? "#FFFFFF" : "rgba(255, 255, 255, 0.8)",
                      minWidth: isCollapsed ? "auto" : "40px",
                      justifyContent: isCollapsed ? "center" : "flex-start",
                    }}
                  >
                    <item.icon style={{ fontSize: "1.5rem" }} />
                  </ListItemIcon>
                  {!isCollapsed && (
                    <>
                      <ListItemText
                        primary={item.text}
                        primaryTypographyProps={{
                          variant: "body2",
                          fontWeight: activeItem === item.text ? 600 : 500,
                          color: activeItem === item.text ? "#FFFFFF" : "rgba(255, 255, 255, 0.9)",
                          fontSize: "0.9rem",
                        }}
                      />
                      {item.subItems && (
                        <Box
                          component="span"
                          sx={{
                            ml: 1,
                            color: "rgba(255, 255, 255, 0.8)",
                            transition: "transform 0.3s ease",
                            transform: openSubMenu === item.text ? "rotate(180deg)" : "rotate(0deg)",
                          }}
                        >
                          <KeyboardArrowDown size={14} />
                        </Box>
                      )}
                    </>
                  )}
                </ListItem>
              </Tooltip>
              {!isCollapsed && item.subItems && (
                <Collapse in={openSubMenu === item.text} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding sx={{ mt: 0.5, mb: 1 }}>
                    {item.subItems.map((subItem) => (
                      <ListItem
                        key={subItem.text}
                        button
                        sx={{
                          pl: 5,
                          py: 0.75,
                          borderRadius: "12px",
                          mb: "0.4rem",
                          mx: "0.8rem",
                          backgroundColor: activeItem === subItem.text ? "rgba(255, 255, 255, 0.15)" : "transparent",
                          transition: "all 0.2s ease",
                          "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.08)", transform: "translateX(4px)" },
                        }}
                        onClick={() => handleNavigation(subItem.path, subItem.text)}
                      >
                        <ListItemIcon
                          sx={{
                            color: activeItem === subItem.text ? "#FFFFFF" : "rgba(255, 255, 255, 0.8)",
                            minWidth: "30px",
                          }}
                        >
                          <subItem.icon style={{ fontSize: "1.1rem" }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={subItem.text}
                          primaryTypographyProps={{
                            variant: "body2",
                            fontSize: "0.85rem",
                            fontWeight: activeItem === subItem.text ? 600 : 400,
                            color: activeItem === subItem.text ? "#FFFFFF" : "rgba(255, 255, 255, 0.8)",
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              )}
            </Box>
          ))}
        </List>
      </Box>

      {/* Footer: Logout */}
      <Box
        sx={{
          mt: "auto",
          borderTop: "1px solid rgba(255, 255, 255, 0.12)",
          p: isCollapsed ? "1.2rem 0" : "1.2rem 1.5rem",
          display: "flex",
          flexDirection: "column",
          alignItems: isCollapsed ? "center" : "flex-start",
          background: "rgba(0, 0, 0, 0.1)",
        }}
      >
        <Tooltip title={isCollapsed ? "Logout" : ""} placement="right" arrow>
          <ListItem
            button
            sx={{
              borderRadius: "12px",
              p: isCollapsed ? "10px 0" : "10px 12px",
              justifyContent: isCollapsed ? "center" : "flex-start",
              transition: "all 0.2s ease",
              "&:hover": { backgroundColor: "rgba(255, 0, 0, 0.15)", transform: "translateX(4px)" },
            }}
            onClick={() => handleNavigation("/", "Logout")}
          >
            <ListItemIcon
              sx={{
                color: "rgba(255, 255, 255, 0.9)",
                minWidth: isCollapsed ? "auto" : "40px",
                justifyContent: isCollapsed ? "center" : "flex-start",
              }}
            >
              <Logout style={{ fontSize: "1.5rem" }} />
            </ListItemIcon>
            {!isCollapsed && (
              <ListItemText
                primary="Logout"
                primaryTypographyProps={{
                  variant: "body2",
                  fontWeight: 600,
                  color: "rgba(255, 255, 255, 0.9)",
                  fontSize: "0.9rem",
                }}
              />
            )}
          </ListItem>
        </Tooltip>
      </Box>
    </>
  )

  // For mobile, render a drawer
  if (isMobile) {
    return (
      <>
        <IconButton
          onClick={toggleMobileDrawer}
          sx={{
            position: "fixed",
            top: "10px",
            left: "10px",
            zIndex: 1200,
            color: "#fff",
            backgroundColor: greenColors.mainGreen,
            "&:hover": {
              backgroundColor: greenColors.deepGreen,
            },
          }}
        >
          <MenuIcon />
        </IconButton>

        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={toggleMobileDrawer}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile
          }}
          sx={{
            "& .MuiDrawer-paper": {
              width: "280px",
              background: `linear-gradient(165deg, ${greenColors.deepGreen} 0%, ${greenColors.mainGreen} 100%)`,
              boxSizing: "border-box",
            },
          }}
        >
          {sidebarContent}
        </Drawer>
      </>
    )
  }

  // For desktop, render the sidebar
  return (
    <Box
      sx={{
        width: isCollapsed ? "80px" : "280px",
        height: "100vh",
        background: `linear-gradient(165deg, ${greenColors.deepGreen} 0%, ${greenColors.mainGreen} 100%)`,
        color: "#FFFFFF",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 1000,
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
        transition: "all 0.3s ease",
        overflow: "hidden",
        borderRight: "1px solid rgba(255, 255, 255, 0.08)",
      }}
    >
      {sidebarContent}
    </Box>
  )
}
