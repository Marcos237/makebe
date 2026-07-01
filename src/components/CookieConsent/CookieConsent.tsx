import React from 'react';
import { Typography } from '@mui/material';

import {
  CookieAcceptButton,
  CookieBannerContainer,
  CookieBannerContent,
} from './CookieConsent.styles';

type CookieConsentValue = {
  accepted: true;
  acceptedAt: string;
};

const COOKIE_CONSENT_STORAGE_KEY = 'cookieConsent';
const COOKIE_CONSENT_ACCEPTED_EVENT = 'cookieConsentAccepted';

const getCookieConsent = (): CookieConsentValue | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  const storedValue = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);

  if (!storedValue) {
    return null;
  }

  try {
    const parsedValue = JSON.parse(storedValue) as Partial<CookieConsentValue>;

    if (parsedValue.accepted === true && typeof parsedValue.acceptedAt === 'string') {
      return {
        accepted: true,
        acceptedAt: parsedValue.acceptedAt,
      };
    }
  } catch (error) {
    console.warn('Invalid cookie consent value in localStorage.', error);
  }

  return null;
};

const persistCookieConsent = () => {
  const consentValue: CookieConsentValue = {
    accepted: true,
    acceptedAt: new Date().toISOString(),
  };

  window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, JSON.stringify(consentValue));
  window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_ACCEPTED_EVENT, { detail: consentValue }));
};

const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    setIsVisible(!getCookieConsent());
  }, []);

  const handleAccept = () => {
    persistCookieConsent();
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <CookieBannerContainer component="aside" role="dialog" aria-live="polite" aria-label="Consentimento de cookies">
      <CookieBannerContent>
        <Typography variant="body2" sx={{ lineHeight: 1.7 }}>
          Utilizamos cookies para melhorar sua experiência de navegação, analisar o tráfego do site e personalizar
          conteúdos. Ao continuar navegando você concorda com nossa Política de Privacidade.
        </Typography>

        <CookieAcceptButton variant="contained" color="primary" onClick={handleAccept}>
          Aceitar
        </CookieAcceptButton>
      </CookieBannerContent>
    </CookieBannerContainer>
  );
};

export default CookieConsent;
export { COOKIE_CONSENT_ACCEPTED_EVENT, COOKIE_CONSENT_STORAGE_KEY, getCookieConsent };
