import { styled } from '@mui/material/styles';
import { Box, Button } from '@mui/material';

export const CookieBannerContainer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  width: '100%',
  zIndex: theme.zIndex.snackbar,
  backgroundColor: 'rgba(22, 18, 16, 0.96)',
  color: '#f8f1ea',
  boxShadow: '0 -10px 30px rgba(0, 0, 0, 0.18)',
  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
  backdropFilter: 'blur(10px)',
}));

export const CookieBannerContent = styled(Box)(({ theme }) => ({
  margin: '0 auto',
  maxWidth: theme.breakpoints.values.lg,
  padding: theme.spacing(2, 3),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
    flexDirection: 'column',
    alignItems: 'stretch',
  },
}));

export const CookieAcceptButton = styled(Button)(({ theme }) => ({
  minWidth: 140,
  alignSelf: 'center',
  whiteSpace: 'nowrap',
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
}));
