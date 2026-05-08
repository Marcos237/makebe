import React from "react";
import { useLogout } from "../hooks/useLogout";

const LogoutPage: React.FC = () => {
    useLogout();
    return null;
};

export default LogoutPage;
