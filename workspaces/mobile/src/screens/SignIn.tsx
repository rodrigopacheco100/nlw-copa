import { Fontisto } from "@expo/vector-icons";
import { Center, Icon, Text } from "native-base";

import Logo from "../assets/logo.svg";
import { Button } from "../components/Button";
import { useAuth } from "../hooks/useAuth";

export const SignIn: React.FC = () => {
  const { signIn, isUserLoading } = useAuth();

  return (
    <Center bgColor="gray.900" flex={1} p={7}>
      <Logo width={212} height={40} />
      <Button
        title="ENTRAR COM GOOGLE"
        type="SECONDARY"
        leftIcon={<Icon as={Fontisto} name="google" color="white" size="md" />}
        mt={12}
        onPress={signIn}
        isLoading={isUserLoading}
      />

      <Text color="white" textAlign="center" mt={4}>
        Não utilizamos nenhuma informação além{"\n"}
        do seu e-mail para criação de sua conta.
      </Text>
    </Center>
  );
};
