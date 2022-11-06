import * as AuthSession from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { api } from "../services/api";

WebBrowser.maybeCompleteAuthSession();

type UserProps = {
  name: string;
  avatarUrl: string;
};

export type AuthContextDataProps = {
  user: UserProps | null;
  isUserLoading: boolean;
  signIn: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextDataProps>(
  {} as AuthContextDataProps
);

type AuthContextProviderProps = {
  children: ReactNode;
};

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
  children,
}) => {
  const [user, setUser] = useState<UserProps | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(false);

  const [, response, promptAsync] = Google.useAuthRequest({
    clientId:
      "116666545593-ng24ke4sqkmu5hdj0lcv5i6lquqj7jpa.apps.googleusercontent.com",
    redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
    scopes: ["profile", "email"],
  });

  const signIn = useCallback(async () => {
    try {
      setIsUserLoading(true);
      await promptAsync();
    } catch (error) {
      console.log("F", error);
      throw error;
    } finally {
      setIsUserLoading(false);
    }
  }, [promptAsync]);

  const contextValue = useMemo<AuthContextDataProps>(
    () => ({
      signIn,
      isUserLoading,
      user,
    }),
    [signIn, isUserLoading, user]
  );

  const signInWithGoogle = useCallback(async (accessToken: string) => {
    try {
      setIsUserLoading(true);

      const {
        data: { token },
      } = await api.post("auth/google", {
        accessToken,
      });

      api.defaults.headers.common.Authorization = `Bearer ${token}`;

      const { data } = await api.get("/me");

      setUser({
        name: data.user.name,
        avatarUrl: data.user.avatarUrl,
      });
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setIsUserLoading(false);
    }
  }, []);

  useEffect(() => {
    if (response?.type === "success" && response.authentication?.accessToken) {
      signInWithGoogle(response.authentication.accessToken);
    }
  }, [response, signInWithGoogle]);

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
