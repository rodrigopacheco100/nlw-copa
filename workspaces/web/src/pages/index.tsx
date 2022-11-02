import { GetServerSideProps } from "next";

import { api } from "../lib/api";

interface HomeProps {
  count: number;
}

export default function Home({ count }: HomeProps) {
  return <h1>Contagem: {count}</h1>;
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  const {
    data: { count },
  } = await api.get("/pools/count");

  return {
    props: {
      count,
    },
  };
};
