import React from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { RecaptchaItens } from "../Interfaces/shared/RecaptchaItens";



const RecaptchaComponent: React.FC<RecaptchaItens> = ({ siteKey, onChange }) => {
  return (
    <ReCAPTCHA
      sitekey={siteKey}
      onChange={onChange}
    />
  );
};

export default RecaptchaComponent;
