import React from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { RecaptchaItens } from "../Interfaces/shared/RecaptchaItens";



const RecaptchaComponent: React.FC<RecaptchaItens> = ({ siteKey, onChange }) => {

  if (window.grecaptcha && window.grecaptcha.enterprise) {
    window.grecaptcha.enterprise.ready(async () => {

      const token = await window.grecaptcha.enterprise.execute(siteKey, { action: 'submit' });
      onChange(token);

    });
  };


  return (
    <ReCAPTCHA
      sitekey={siteKey}
      onChange={onChange}
    />
  );
};

export default RecaptchaComponent;
