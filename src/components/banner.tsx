import React, { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { Link } from 'react-router-dom';
import { MenuUsuarioItens } from '../Interfaces/Banner/MenuUsuarioItens';
import { UsuarioLogadoItens } from '../Interfaces/Usuario/UsuarioLogadoItens';


import "../assets/styles/Banner/banner.css";

interface BannerProps {
  usuarioLogado?: UsuarioLogadoItens;
}

const Banner: React.FC<BannerProps> = ({ usuarioLogado }) => {
  const [menuUsuarioItems, setMenuUsuarioItems] = useState<MenuUsuarioItens[]>([]);
  const [menuUsuarioLogadoItems, setMenuUsuarioLogadoItems] = useState<MenuUsuarioItens[]>([]);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [anchorElUser, setAnchorElUser] = useState<HTMLElement | null>(null);


  useEffect(() => {
    if (usuarioLogado?.isValid) {
      const items: MenuUsuarioItens[] = [
        { id: 1, descricao: 'Perfil', urlMenu: '/perfil' },
        { id: 2, descricao: 'Sair', urlMenu: '/Deslogar' }
      ];
      setMenuUsuarioItems(items);
    } else {
      const defaultItems: MenuUsuarioItens[] = [
        { id: 1, descricao: 'Cadastro', urlMenu: '/perfil' },
        { id: 2, descricao: 'Login', urlMenu: '/login' }
      ];
      setMenuUsuarioItems(defaultItems);
    }

    if (usuarioLogado?.menus) {
      const menuItem = usuarioLogado.menus.map(menu => ({
        id: menu.id,
        descricao: menu.descricao,
        urlMenu: menu.urlMenu
      }));
      setMenuUsuarioLogadoItems(menuItem);
    } else {
      const defaultItems: MenuUsuarioItens[] = [
        { id: 1, descricao: 'Sobre', urlMenu: '/sobre' },
        { id: 2, descricao: 'Contato', urlMenu: '/contato' }
      ];
      setMenuUsuarioLogadoItems(defaultItems);
    }
  }, [usuarioLogado]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleOpenUser = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUser = () => {
    setAnchorElUser(null);
  };

  const tooltipText = () => {
    if (usuarioLogado?.isValid)
      return 'acessar conta';
    return 'perfil';
  }

  return (
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
              <img src='http://192.168.15.17/imagens/logo_5.png' alt="Logo" className="imagem" />
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
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              {menuUsuarioLogadoItems.map((item) => (
                <MenuItem key={item.id} onClick={handleMenuClose}>
                  {item.descricao}
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Box sx={{
            flexGrow: 1, display: { xs: 'none', md: 'flex' },
            justifyContent: 'flex-start',
            alignItems: 'flex-end',
            mr: 6,
            height: '200px'
          }}>
            {menuUsuarioLogadoItems.map((item) => (
              <Button
                key={item.id}
                component={Link}
                to={item.urlMenu}
                onClick={handleMenuClose}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {item.descricao}
              </Button>
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
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
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
  );
}

export default Banner;
