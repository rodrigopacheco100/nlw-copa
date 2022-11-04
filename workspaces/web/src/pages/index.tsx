import { AxiosError } from "axios";
import { GetStaticProps } from "next";
import Image from "next/image";
import { FormEvent, useState } from "react";
import { toast } from "react-hot-toast";

import appPreview from "../assets/app-mobile-preview.png";
import checkIcon from "../assets/check-icon.svg";
import logoImage from "../assets/logo.svg";
import usersAvatars from "../assets/users-avatars.png";
import { api } from "../lib/api";

interface HomeProps {
  poolCount: number;
  guessCount: number;
  userCount: number;
}

export default function Home({ poolCount, guessCount, userCount }: HomeProps) {
  const [poolTitle, setPoolTitle] = useState("");
  const [requestFinished, setRequestFinished] = useState(true);

  async function handleCreateUser(event: FormEvent) {
    event.preventDefault();

    await toast.promise(
      new Promise(async (resolve, reject) => {
        try {
          setRequestFinished(false);

          const { data } = await api.post("/pools", {
            title: poolTitle,
          });

          await navigator.clipboard.writeText(data.code);

          setPoolTitle("");
          setRequestFinished(true);
          resolve("");
        } catch (error) {
          setRequestFinished(true);
          if (error instanceof AxiosError) reject(error.message);
          reject("Internal Server Error");
        }
      }),
      {
        success: "Bolão criado com sucesso!",
        error: "Erro ao criar o bolão",
        loading: "Criando seu bolão, aguarde...",
      }
    );
  }

  return (
    <div className="max-w-7xl h-screen mx-auto grid grid-cols-2 items-center p-4 gap-28">
      <main>
        <Image src={logoImage} alt="Logo da NLW Copa" />

        <h1 className="mt-14 text-white text-5xl font-bold leading-tight">
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </h1>

        <div className="mt-10 flex flex-col justify-center gap-2">
          <Image src={usersAvatars} alt="" />
          <strong className="text-gray-100 text-xl">
            <span className="text-ignite-500">+{userCount}</span> pessoas já
            estão usando
          </strong>

          <form onSubmit={handleCreateUser} className="mt-10 flex gap-2">
            <input
              className="flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100"
              type="text"
              required
              placeholder="Qual nome do seu bolão?"
              onChange={(event) => setPoolTitle(event.target.value)}
              value={poolTitle}
              disabled={!requestFinished}
            />
            <button
              className="bg-yellow-500 px-6 py-4 rounded text-gray-900 font-bold text-sm uppercase hover:bg-yellow-700"
              type="submit"
              disabled={!requestFinished}
            >
              Criar meu bolão
            </button>
          </form>

          <p className="mt-4 text-sm text-gray-300 leading-relaxed">
            Após criar seu bolão, você receberá um código único que poderá usar
            para convidar outras pessoas 🚀
          </p>

          <div className="mt-10 pt-10 border-t border-gray-600 divide-x divide-gray-600 flex justify-evenly text-gray-100">
            <div className="flex pr-16 flex-row items-center gap-6">
              <Image className="w-10 h-10" src={checkIcon} alt="" />
              <div className="flex flex-col font-bold text-2xl">
                <span>+{poolCount}</span>
                <span> Bolões criados</span>
              </div>
            </div>
            <div className="flex pl-16 flex-row items-center gap-6">
              <Image className="w-10 h-10" src={checkIcon} alt="" />
              <div className="flex flex-col font-bold text-2xl">
                <span>+{guessCount}</span>
                <span> Palpites enviados</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Image
        src={appPreview}
        alt="Prévia do aplicativo NLW Copa"
        quality={100}
      />
    </div>
  );
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const [poolCountResponse, guessCountResponse, userCountResponse] =
    await Promise.all([
      api.get("/pools/count"),
      api.get("/guesses/count"),
      api.get("/users/count"),
    ]);

  return {
    props: {
      poolCount: poolCountResponse.data.count,
      guessCount: guessCountResponse.data.count,
      userCount: userCountResponse.data.count,
    },
    revalidate: 10 * 60,
  };
};
