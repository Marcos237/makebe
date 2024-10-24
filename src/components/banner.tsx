import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import { Box, Button, Menu, MenuItem, Fade } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import { URL_IMAGENS } from '../config/apiConfig';
import { Link } from 'react-router-dom';
import { MenuUsuarioItens } from '../Interfaces/Banner/MenuUsuarioItens';
import { UsuarioLogadoItens } from '../Interfaces/Usuario/UsuarioLogadoItens';


import "../assets/styles/Banner/banner.css";

interface BannerProps {
  usuarioLogado?: UsuarioLogadoItens;
}

const Banner: React.FC<BannerProps> = ({ usuarioLogado }) => {
  const [menuElemento, setMenuElemento] = useState<HTMLElement | null>(null);
  const [subMenuElemento, setSubElemento] = useState<HTMLElement | null>(null);
  const [openSubMenu, setOpenSubMenu] = useState<number | null>(null);
  const [anchorElUser, setAnchorElUser] = useState<HTMLElement | null>(null);


  const menuUsuarioItems: MenuUsuarioItens[] = usuarioLogado?.menus?.length
    ? [
      { id: 1, descricao: 'Perfil', urlMenu: '/perfil' },
      { id: 2, descricao: 'Alterar Senha', urlMenu: '/alteraSenha' },
      { id: 3, descricao: 'Sair', urlMenu: '/Deslogar' },
    ]
    : [
      { id: 1, descricao: 'Login', urlMenu: '/login' },
      { id: 2, descricao: 'Cadastro', urlMenu: '/perfil' },
      { id: 3, descricao: 'Recuperar Senha', urlMenu: '/alteraSenha' },
    ];

  const menuUsuarioLogadoItems: MenuUsuarioItens[] = usuarioLogado?.menus?.length
    ? usuarioLogado.menus.map(menu => ({
      id: menu.id,
      descricao: menu.descricao,
      urlMenu: menu.urlMenu,
      subMenus: menu.subMenus
    }))
    : [
      { id: 1, descricao: 'Sobre', urlMenu: '/sobre' },
      { id: 2, descricao: 'Contato', urlMenu: '/contato' },
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
  };

  const handleSubMenuToggle = (event: React.MouseEvent<HTMLElement>, itemId: number) => {
    setOpenSubMenu(prev => (prev === itemId ? null : itemId));
    setSubElemento(event.currentTarget);
  };


  const handleMenuItemClick = (event: React.MouseEvent<HTMLElement>,item: MenuUsuarioItens) => {
    if (item.subMenus && item.subMenus.length > 0) {
      setOpenSubMenu(item.id);
      setSubElemento(event.currentTarget);
      return;
    }
    window.location.href = item.urlMenu;
    handleMenuClose();
  };


  const renderSubMenu = (item: MenuUsuarioItens) => (
    <Menu
      id={`submenu-${item.id}`}
      anchorEl={subMenuElemento}
      open={openSubMenu === item.id}
      onClose={() => setOpenSubMenu(null)}
      MenuListProps={{ 'aria-labelledby': `fade-button-${item.id}` }}
    >
      {item?.subMenus?.map(subItem => (
        <MenuItem key={subItem.subMenuId} onClick={() => setOpenSubMenu(null)}>
          <Link to={subItem?.subMenuUrl || ''} style={{ textDecoration: 'none', color: 'inherit' }}>
            {subItem.subMenuDescricao}
          </Link>
        </MenuItem>
      ))}
    </Menu>
  );

  return (
    <>
      <AppBar position="static" className="menu" sx={{ backgroundColor: 'black' }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Typography variant="h6" noWrap component="a" href="/" sx={{
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
              >
                {menuUsuarioLogadoItems.map((item) => (
                  <Box key={item.id}>
                    <MenuItem onClick={(event) => handleMenuItemClick(event, item)}>
                      {item.descricao}
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
                  <Button component={Link} to={item.urlMenu} onClick={item.subMenus && item.subMenus.length > 0 ? (event) => handleSubMenuToggle(event, item.id) : handleMenuClose} sx={{ my: 2, color: 'white', display: 'block' }}>
                    {item.descricao}
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
                    <Link to={item.urlMenu} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <Typography textAlign="center">{item.descricao}</Typography>
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
