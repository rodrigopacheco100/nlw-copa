import { useContext } from "react";

import { AuthContext, AuthContextDataProps } from "../contexts/AuthContext";

export const useAuth = (): AuthContextDataProps => useContext(AuthContext);
