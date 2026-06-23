import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Box, Button, Menu, MenuItem } from '@mui/material';
import { URL_IMAGENS } from '../config/apiConfig';
import { Link } from 'react-router-dom';
import { MenuUsuarioItens } from '../Interfaces/Banner/MenuUsuarioItens';
import { BannerItens } from '../Interfaces/Banner/bannerItens';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { FaAngleDoubleRight, FaAngleDoubleDown } from "react-icons/fa";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import useMediaQuery from '@mui/material/useMediaQuery';

import "../assets/styles/Banner/banner.css";

const normalizeMenuUrl = (url?: string): string => {
  if (!url) {
    return '/vitrine';
  }

  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  const [pathPart, hashPart] = url.split('#');
  const [pathname, search = ''] = pathPart.split('?');
  const normalizedPath = pathname
    .split('/')
    .map((segment, index) => (index === 0 ? segment : segment.toLowerCase()))
    .join('/')
    .replace(/\/+$/, '');

  const finalPath = normalizedPath || '/';
  const finalSearch = search ? `?${search}` : '';
  const finalHash = hashPart ? `#${hashPart}` : '';

  return `${finalPath}${finalSearch}${finalHash}`;
};

const Banner: React.FC<BannerItens> = ({ usuarioLogado }) => {
  const [menuElemento, setMenuElemento] = useState<HTMLElement | null>(null);
  const [openSubMenu, setOpenSubMenu] = useState<number | null>(null);
  const [subElemento, setSubElemento] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<HTMLElement | null>(null);
  const [openSubMenuNivel2, setOpenSubMenuNivel2] = useState<number | null>(null);
  const [subMenuElementoNivel2, setSubMenuElementoNivel2] = useState<null | HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const subMenuRef = useRef<HTMLDivElement | null>(null);
  const subMenuNivel2Ref = useRef<HTMLDivElement | null>(null);
  const safeAnchor = (el: HTMLElement | null) => (el && el.isConnected ? el : null);
  const isMobile = useMediaQuery('(max-width:820px)');

  const closeAllMenus = useCallback(() => {
    setMenuElemento(null);
    setAnchorElUser(null);
    setOpenSubMenu(null);
    setOpenSubMenuNivel2(null);
    setSubElemento(null);
    setSubMenuElementoNivel2(null);
  }, []);

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      background: {
        default: '#0d0d0d',
        paper: '#1a1a1a',
      },
      text: {
        primary: '#f0f0f0',
        secondary: '#ccc',
      },
    },
    components: {
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            backgroundColor: '#0d0d0d',
            borderRadius: 6,
            '& fieldset': {
              borderColor: '#333',
            },
            '&:hover fieldset': {
              borderColor: '#555',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#007bff',
              boxShadow: '0 0 0 2px rgba(0, 123, 255, 0.2)',
            },
          },
          input: {
            color: '#f0f0f0',
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            color: '#aaa',
            '&.Mui-focused': {
              color: '#007bff',
            },
          },
        },
      },
    },
  });
  const menuUsuarioItems: MenuUsuarioItens[] = usuarioLogado?.menus?.length
    ? [
      { id: 1, menuDescricao: 'Perfil', menuUrl: '/perfil' },
      { id: 2, menuDescricao: 'Alterar Senha', menuUrl: '/alteraSenha' },
      { id: 3, menuDescricao: 'Sair', menuUrl: '/Deslogar' },
    ]
    : [
      { id: 1, menuDescricao: 'Login', menuUrl: '/login' },
      { id: 2, menuDescricao: 'Cadastro', menuUrl: '/perfil' },
      { id: 3, menuDescricao: 'Recuperar Senha', menuUrl: '/alteraSenha' },
    ];

  const menuUsuarioLogadoItems: MenuUsuarioItens[] = usuarioLogado?.menus?.length
    ? usuarioLogado.menus.map(menu => ({
      id: menu.id,
      menuDescricao: menu.menuDescricao,
      menuUrl: menu.menuUrl,
      subMenus: menu.subMenus
    }))
    : [
      { id: 1, menuDescricao: 'Sobre', menuUrl: '/sobre' },
      { id: 2, menuDescricao: 'Contato', menuUrl: '/contato' },
    ];

  const handleOpenUser = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUser = () => {
    setAnchorElUser(null);
  };

  const tooltipText = () => {
    if (usuarioLogado?.isValid) return 'acessar conta';
    return 'perfil';
  };
  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) => {
    setMenuElemento(e.currentTarget);
  };

  const handleSubMenuToggle = (e: React.MouseEvent<HTMLElement>, itemId: number) => {
    setOpenSubMenu(prev => (prev === itemId ? null : itemId));
    setSubElemento(e.currentTarget);
  };

  const handleSubMenuNivel2Toggle = (e: React.MouseEvent<HTMLElement>, subMenuId: number) => {
    e.stopPropagation();
    setOpenSubMenuNivel2(prev => (prev === subMenuId ? null : subMenuId));
    setSubMenuElementoNivel2(e.currentTarget);
  };

  const handleMenuClose = () => {

    closeAllMenus()

  };

  const handleMenuItemClick = (event: React.MouseEvent<HTMLElement>, item: MenuUsuarioItens) => {
    if (item.subMenus && item.subMenus.length > 0) {
      setOpenSubMenu(item.id);
      setSubElemento(event.currentTarget);
      return;
    }
    window.location.href = normalizeMenuUrl(item.menuUrl);
    handleMenuClose();
  };

  const renderSubMenu = (item: MenuUsuarioItens): JSX.Element | null => {
    const subMenuItens = item?.subMenus?.filter(sub => sub.subMenuPaiId == null) || [];
    const subMenuFilhos = item?.subMenus?.filter(sub => sub.subMenuPaiId !== null) || [];

    return (
      <Menu
        id={`submenu-${item.id}`}
        anchorEl={safeAnchor(subElemento)}
        open={openSubMenu === item.id && Boolean(safeAnchor(subElemento))}
        onClose={() => {
          setOpenSubMenu(null);
          setOpenSubMenuNivel2(null);
          setSubElemento(null);
        }}
        MenuListProps={{ 'aria-labelledby': `fade-button-${item.id}` }}
        TransitionProps={{ timeout: 100 }}
        keepMounted
        disableScrollLock
        PaperProps={{ sx: { willChange: 'transform,opacity' } }}
        ref={subMenuRef}
      >
        {subMenuItens.map(subItem => {
          const filhos = subMenuFilhos.filter(f => f.subMenuPaiId === subItem.subMenuId);

          const hasFilhos = filhos.length > 0;

          return (
            <MenuItem
              className="submenu-item-nivel"
              key={subItem.subMenuId}
              onClick={
                hasFilhos
                  ? (event) => handleSubMenuNivel2Toggle(event, subItem?.subMenuId ?? 0)
                  : () => setOpenSubMenu(null)
              }
              sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}
            >
              {hasFilhos ? (
                <>
                  <span>{subItem.subMenuDescricao}</span>
                  <FaAngleDoubleRight size={12} />
                  <Menu
                    anchorEl={safeAnchor(subMenuElementoNivel2)}
                    open={openSubMenuNivel2 === subItem.subMenuId && Boolean(safeAnchor(subMenuElementoNivel2))}
                    onClose={() => {
                      setOpenSubMenuNivel2(null);
                      setSubMenuElementoNivel2(null);  // <--- zera âncora
                    }}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                    keepMounted
                    disableScrollLock
                    TransitionProps={{ timeout: 100 }}
                    PaperProps={{ sx: { willChange: 'transform,opacity' } }}
                    ref={subMenuNivel2Ref}
                  >
                    {filhos.map(filho => (
                      <MenuItem
                        key={filho.subMenuId}
                        onClick={() => {
                          setOpenSubMenu(null);
                          setOpenSubMenuNivel2(null);
                        }}
                      >
                        <Link
                          to={normalizeMenuUrl(filho.subMenuUrl)}
                          style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                          {filho.subMenuDescricao}
                        </Link>
                      </MenuItem>
                    ))}
                  </Menu>
                </>
              ) : (
                <Link
                  to={normalizeMenuUrl(subItem.subMenuUrl)}
                  style={{ textDecoration: 'none', color: 'inherit', flexGrow: 1 }}
                >
                  {subItem.subMenuDescricao}
                </Link>
              )}
            </MenuItem>
          );
        })}
      </Menu>
    );
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!menuElemento && !anchorElUser && !openSubMenu && !openSubMenuNivel2) return;
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuElemento, anchorElUser, openSubMenu, openSubMenuNivel2]);

  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <AppBar position="static" className="menu" sx={{ backgroundColor: 'transparent', backgroundImage: 'none' }}>
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              <Typography className="bannerHomeLink" variant="h6" noWrap component={Link} to="/" sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'default',
                textDecoration: 'none',
              }}>
                <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                  <img
                    src={`${URL_IMAGENS}/logo_5.png`}
                    alt="Logo"
                    className="imagem"
                    style={{ width: '64px', height: '54px' }}
                  />
                </Box>
              </Typography>
              <Box className="mobileMenuTrigger" sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  color="inherit"
                  onClick={handleMenuOpen}
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={safeAnchor(menuElemento)}
                  open={Boolean(safeAnchor(menuElemento))}
                  onClose={handleMenuClose}
                  anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                  keepMounted
                  disableScrollLock
                  TransitionProps={{ timeout: 100 }}
                  PaperProps={{ sx: { willChange: 'transform,opacity' } }}
                  ref={menuRef}
                >
                  {menuUsuarioLogadoItems.map((item) => (
                    <Box key={item.id}>
                      <MenuItem onClick={(event) => handleMenuItemClick(event, item)}>
                        {item.menuDescricao}
                      </MenuItem>
                      {item.subMenus && renderSubMenu(item)}
                    </Box>
                  ))}
                </Menu>
              </Box>
              <Box
                sx={{
                  flexGrow: 0,
                  display: { xs: 'none', md: 'flex' },
                  justifyContent: 'center',
                  alignItems: 'center',
                  mr: 1,
                  minHeight: '72px',
                  gap: 3.2,
                  flexWrap: 'nowrap',
                }}
              >
                {menuUsuarioLogadoItems.map(item => (
                  <Box key={item.id} sx={{ display: 'flex', m: 0, p: 0 }}>
                    <Button
                      component={Link}
                      to={normalizeMenuUrl(item.menuUrl)}
                      onClick={
                        item.subMenus && item.subMenus.length > 0
                          ? (event) => handleSubMenuToggle(event, item.id)
                          : handleMenuClose
                      }
                      sx={{
                        my: 0,
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 0.5,
                        px: 0.55,
                        minWidth: 0
                      }}
                    >
                      {item.menuDescricao}

                      {item.subMenus && item.subMenus.length > 0 && <FaAngleDoubleDown size={12} />}
                    </Button>


                    {item.subMenus && renderSubMenu(item)}
                  </Box>
                ))}
              </Box>

              <Box className="profileArea" sx={{
                flexGrow: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                mt: 0,
                minHeight: '72px'
              }}>
                <Tooltip title={tooltipText()}>
                  <span>
                    <IconButton onClick={handleOpenUser} sx={{ p: 0 }}>
                      <Avatar
                        alt={usuarioLogado?.nome || ''}
                        src={usuarioLogado?.urlImagem}
                        sx={{ width: 56, height: 56, fontSize: 28 }} />
                    </IconButton>
                  </span>
                </Tooltip>
                <Menu
                  sx={{ mt: isMobile ? '6px' : '12px' }}
                  id="menu-appbar-user"
                  anchorEl={anchorElUser}
                  anchorOrigin={{ vertical: isMobile ? 'bottom' : 'top', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  keepMounted
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUser}
                >
                  {menuUsuarioItems.map((item) => (
                    <MenuItem key={item.id} onClick={handleCloseUser}>
                      <Link to={normalizeMenuUrl(item.menuUrl)} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <Typography textAlign="center">{item.menuDescricao}</Typography>
                      </Link>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      </ThemeProvider>
    </>
  );
}

export default Banner;
