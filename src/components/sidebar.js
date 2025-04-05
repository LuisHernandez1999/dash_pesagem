"use client"

import { useState, useEffect } from "react"
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
} from "@mui/material"
import {
  AiOutlineReconciliation,  
  AiOutlineLogout,
  AiOutlineSearch,
  AiOutlineTeam,
  AiOutlineCar,
  AiOutlineDown,
  AiOutlineMenu,    
} from "react-icons/ai"
import { MdOutlineAddBusiness, MdOutlineBalance } from "react-icons/md";
import { BsGraphUpArrow } from "react-icons/bs";
import { useRouter } from "next/router"
import Image from "next/image"

const greenColors = {
  deepGreen: "#1b5e20",
  mainGreen: "#379E50",
  lightGreen: "#CFD989",
}

export default function Sidebar({ onCollapse, user }) {
  const router = useRouter()
  const [isRouterReady, setIsRouterReady] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [openSubMenu, setOpenSubMenu] = useState(null)
  const [activeItem, setActiveItem] = useState("")
  const [filteredMenuItems, setFilteredMenuItems] = useState([])

  // Define os itens do menu
  const menuItems = [
    { text: "Cadastro de Pesagem", icon: MdOutlineBalance, path: "/cadastro/cadastro" },
    { text: "Resumo de Pesagem", icon: BsGraphUpArrow, path: "/resumo_pesagem/resumo_pesagens_rel" },
    {
      text: "Controle e Registro",
      icon: AiOutlineReconciliation,
      subItems: [
        { text: "Colaboradores", icon: AiOutlineTeam, path: "/colaborador/colaboradores_page" },
        { text: "Veículos", icon: AiOutlineCar, path: "/veiculos/veiculos_page" },
        { text: "Cooperativas", icon: MdOutlineAddBusiness, path: "/cooperativas/cooperativa_page" },
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

    // Remove acentos e converte para minúsculas
    const normalizeText = (text) =>
      text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()

    const searchNormalized = normalizeText(searchValue)

    const filtered = menuItems.reduce((acc, item) => {
      const mainItemMatches = normalizeText(item.text).includes(searchNormalized)

      let matchingSubItems = []
      if (item.subItems) {
        matchingSubItems = item.subItems.filter(subItem =>
          normalizeText(subItem.text).includes(searchNormalized)
        )
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
    if (router?.isReady) {
      setIsRouterReady(true)
      const currentPath = router.pathname
      menuItems.forEach((item) => {
        if (item.path === currentPath) {
          setActiveItem(item.text)
        }
        if (item.subItems) {
          item.subItems.forEach((subItem) => {
            if (subItem.path === currentPath) {
              setActiveItem(subItem.text)
              setOpenSubMenu(item.text)
            }
          })
        }
      })
    }
  }, [router?.isReady, router?.pathname])

  const toggleCollapse = () => {
    const newCollapsedState = !isCollapsed
    setIsCollapsed(newCollapsedState)
    if (onCollapse) onCollapse(newCollapsedState)
  }

  const handleNavigation = (path, itemText) => {
    if (isRouterReady && path) {
      setActiveItem(itemText)
      router.push(path)
    }
  }

  const toggleSubMenu = (menuName) => {
    setOpenSubMenu(openSubMenu === menuName ? null : menuName)
  }

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value)
  }

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
      {/* Cabeçalho */}
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
              <Image
                
                alt="LimpaGyn Logo"
                width={150}
                height={70}
                style={{
                  objectFit: "contain",
                  filter: "brightness(0) invert(1)",
                  transition: "all 0.3s ease",
                }}
              />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "1.3rem", letterSpacing: "0.5px", textShadow: "0px 2px 4px rgba(0,0,0,0.2)" }}>
              LimpaGyn
            </Typography>
          </Box>
        )}
        <IconButton
          onClick={toggleCollapse}
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
          <AiOutlineMenu size={20} />
        </IconButton>
      </Box>

      {/* Área do usuário */}
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
            {!user?.avatarUrl && user?.name ? user.name.charAt(0).toUpperCase() : user?.email ? user.email.charAt(0).toUpperCase() : "U"}
          </Avatar>
          <Box sx={{ ml: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#fff", fontSize: "0.95rem", lineHeight: 1.2 }}>
              {user?.name || user?.email || "Usuário"}
            </Typography>
            <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "0.8rem" }}>
              Sistema de Pesagem
            </Typography>
          </Box>
        </Box>
      )}

      {/* Barra de pesquisa */}
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
                  <AiOutlineSearch color="rgba(255, 255, 255, 0.8)" size={20} />
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

      {/* Itens do menu */}
      <Box
        sx={{
          mt: 2,
          px: isCollapsed ? 1 : 1.5,
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden", // Impede scrollbar horizontal
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
                          <AiOutlineDown size={14} />
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

      {/* Rodapé: Logout */}
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
              <AiOutlineLogout style={{ fontSize: "1.5rem" }} />
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
    </Box>
  )
}