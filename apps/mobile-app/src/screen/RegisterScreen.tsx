import { useState } from "react";
import { useLocation, useParams } from "wouter";
import { register } from "../service/auth.service";
import { ButtonGlow } from "./PlayerGameScreen/ButtonGlow";

export const RegisterScreen = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const [name, setName] = useState("");
  const [, navigate] = useLocation();

  const [sendingRequest, setSendingRequest] = useState<boolean>(false);

  return (
    <form
      className="w-full h-full flex flex-col justify-center gap-20 p-5 pb-5"
      onSubmit={async (e) => {
        e.preventDefault();
        const result = await register(name);
        localStorage.setItem("token", result.token);
        navigate("/lobby/" + gameId);
      }}
    >
      <div className="flex justify-center items-end flex-1">
        <div className="p-6 px-3 bg-white rounded-[30px] border-4 border-x-2 border-b-8 border-gray-500 h-fit">
          <img src="/assets/Hublock.png" className="w-[147px] h-[120px]" />
        </div>
      </div>

      <div className="flex flex-col gap-2 flex-1 justify-center h-[40vh]">
        <span className="font-bold text-xl font-[GothamBold]">
          Tên của bạn là gì
        </span>
        <input
          className="w-full h-12 p-2 border-2 text-xl text-gray-500 rounded-md BeVietnamProSemiBold"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nhập tên của bạn"
        />
      </div>

      <ButtonGlow
        size="w-full h-12 -top-10"
        bgColor="bg-[#F57EB5]"
        glowColor="bg-[#B56386]"
        rounded="rounded-[20px]"
        glowTop="top-3"
        formButton
        type="submit"
        role="button"
        disabled={sendingRequest}
        onClick={async () => {
          if (sendingRequest) return;
          setSendingRequest(true);
          const result = await register(name);
          if (result) {
            localStorage.setItem("token", result.token);
            navigate("/lobby/" + gameId);
          }
          setSendingRequest(false);
        }}
        children={
          <p className="text-2xl font-[GothamBold] text-center">
            Tham gia ngay
          </p>
        }
      />
    </form>
  );
};
