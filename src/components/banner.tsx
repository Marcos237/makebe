import React, { useEffect, useState, useRef } from 'react';
import { Box, Button, Menu, MenuItem } from '@mui/material';
import { URL_IMAGENS } from '../config/apiConfig';
import { Link } from 'react-router-dom';
import { MenuUsuarioItens } from '../Interfaces/Banner/MenuUsuarioItens';
import { BannerItens } from '../Interfaces/Banner/bannerItens';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';

import "../assets/styles/Banner/banner.css";


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


  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuElemento(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuElemento(null);
    setOpenSubMenu(null);
    setOpenSubMenuNivel2(null);

  };

  const handleSubMenuToggle = (event: React.MouseEvent<HTMLElement>, itemId: number) => {
    setOpenSubMenu(prev => (prev === itemId ? null : itemId));
    setSubElemento(event.currentTarget);
  };


  const handleMenuItemClick = (event: React.MouseEvent<HTMLElement>, item: MenuUsuarioItens) => {
    if (item.subMenus && item.subMenus.length > 0) {
      setOpenSubMenu(item.id);
      setSubElemento(event.currentTarget);
      return;
    }
    window.location.href = item.menuUrl;
    handleMenuClose();
  };


  const handleSubMenuNivel2Toggle = (
    event: React.MouseEvent<HTMLElement>,
    subMenuId: number
  ) => {
    event.stopPropagation();
    setOpenSubMenuNivel2(prev => (prev === subMenuId ? null : subMenuId));
    setSubMenuElementoNivel2(event.currentTarget);
  };
  const renderSubMenu = (item: MenuUsuarioItens): JSX.Element | null => {
    const subMenuItens = item?.subMenus?.filter(sub => sub.subMenuPaiId == null) || [];
    const subMenuFilhos = item?.subMenus?.filter(sub => sub.subMenuPaiId !== null) || [];

    return (
      <Menu
        id={`submenu-${item.id}`}
        anchorEl={subElemento}
        open={openSubMenu === item.id}
        onClose={() => {
          setOpenSubMenu(null);
          setOpenSubMenuNivel2(null);
        }}
        MenuListProps={{ 'aria-labelledby': `fade-button-${item.id}` }}
        ref={subMenuRef}
      >
        {subMenuItens.map(subItem => {
          const filhos = subMenuFilhos.filter(f => f.subMenuPaiId === subItem.subMenuId);

          const hasFilhos = filhos.length > 0;

          return (
            <MenuItem
              key={subItem.subMenuId}
              onClick={
                hasFilhos
                  ? (event) => handleSubMenuNivel2Toggle(event, subItem?.subMenuId ?? 0)
                  : () => setOpenSubMenu(null)
              }
            >
              {hasFilhos ? (
                <>
                  {subItem.subMenuDescricao}
                  <Menu
                    anchorEl={subMenuElementoNivel2}
                    open={openSubMenuNivel2 === subItem.subMenuId}
                    onClose={() => setOpenSubMenuNivel2(null)}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'left' }}
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
                        <Link to={filho.subMenuUrl || ''} style={{ textDecoration: 'none', color: 'inherit' }}>
                          {filho.subMenuDescricao}
                        </Link>
                      </MenuItem>
                    ))}
                  </Menu>
                </>
              ) : (
                <Link to={subItem.subMenuUrl || ''} style={{ textDecoration: 'none', color: 'inherit' }}>
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
      const target = event.target as Node;
  
      const clickedInsideMenu = menuRef.current?.contains(target);
      const clickedInsideSubMenu = subMenuRef.current?.contains(target);
      const clickedInsideSubMenuNivel2 = subMenuNivel2Ref.current?.contains(target);
  
      if ((!clickedInsideMenu && !clickedInsideSubMenu) ||  clickedInsideSubMenuNivel2) {
        
        handleMenuClose();
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <AppBar position="static" className="menu" sx={{ backgroundColor: 'black' }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Typography variant="h6" noWrap component="a" href="/Home" sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'default',
              textDecoration: 'none',
            }}>
              <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                <img src={`${URL_IMAGENS}/logo_5.png`} alt="Logo" className="imagem" />
              </Box>
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
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
                anchorEl={menuElemento}
                open={Boolean(menuElemento)}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
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
                flexGrow: 1,
                display: { xs: 'none', md: 'flex' },
                justifyContent: 'flex-start',
                alignItems: 'flex-end',
                mr: 6,
                height: '200px',
              }}
            >
              {menuUsuarioLogadoItems.map(item => (
                <Box key={item.id}>
                  <Button component={Link} to={item.menuUrl} onClick={item.subMenus && item.subMenus.length > 0 ? (event) => handleSubMenuToggle(event, item.id) : handleMenuClose} sx={{ my: 2, color: 'white', display: 'block' }}>
                    {item.menuDescricao}
                  </Button>
                  {item.subMenus && renderSubMenu(item)}
                </Box>
              ))}
            </Box>

            <Box sx={{
              flexGrow: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              mt: { md: 12 }
            }}>
              <Tooltip title={tooltipText()}>
                <IconButton onClick={handleOpenUser} sx={{ p: 0 }}>
                  <Avatar
                    alt={usuarioLogado?.nome || ''}
                    src={usuarioLogado?.urlImagem}
                    sx={{ width: 80, height: 80, fontSize: 40 }} />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar-user"
                anchorEl={anchorElUser}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                keepMounted
                open={Boolean(anchorElUser)}
                onClose={handleCloseUser}
              >
                {menuUsuarioItems.map((item) => (
                  <MenuItem key={item.id} onClick={handleCloseUser}>
                    <Link to={item.menuUrl} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <Typography textAlign="center">{item.menuDescricao}</Typography>
                    </Link>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
}

export default Banner;
