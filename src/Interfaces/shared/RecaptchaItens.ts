export interface RecaptchaItens {
    siteKey: string;
    onChange: (token: string | null) => void;
  }