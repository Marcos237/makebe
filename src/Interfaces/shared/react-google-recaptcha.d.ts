declare module 'react-google-recaptcha' {
  import * as React from 'react';

  interface ReCAPTCHAProps {
    sitekey: string;
    onChange: (value: string | null) => void;
    onExpired?: () => void;
    onErrored?: () => void;
    theme?: 'light' | 'dark';
    size?: 'compact' | 'normal' | 'invisible';
    tabindex?: number;
  }

  class ReCAPTCHA extends React.Component<ReCAPTCHAProps, any> {
    reset(): void;
    execute(): void;
  }

  export default ReCAPTCHA;
}
