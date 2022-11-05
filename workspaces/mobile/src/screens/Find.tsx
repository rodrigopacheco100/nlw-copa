import { Heading, VStack } from "native-base";

import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { Input } from "../components/Input";

export const Find: React.FC = () => {
  return (
    <VStack bgColor="gray.900" flex={1}>
      <Header title="Buscar por código" showBackButton />

      <VStack mx={5} alignItems="center">
        <Heading
          fontFamily="heading"
          color="white"
          fontSize="xl"
          my={8}
          textAlign="center"
        >
          Encontre um bolão através de{"\n"}seu código único
        </Heading>

        <Input mb={2} placeholder="Qual o código do bolão?" />
        <Button title="BUSCAR BOLÃO" />
      </VStack>
    </VStack>
  );
};
