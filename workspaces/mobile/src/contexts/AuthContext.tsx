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

WebBrowser.maybeCompleteAuthSession();

type UserProps = {
  name: string;
  avatarUrl: string;
};

export type AuthContextDataProps = {
  user: UserProps;
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
  const [user, setUser] = useState<UserProps>({} as UserProps);
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

  const signInWithGoogle = useCallback((accessToken: string) => {
    console.log(accessToken);
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
