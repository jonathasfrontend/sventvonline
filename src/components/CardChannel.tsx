import { Heart, Star, BookmarkSimple } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { api } from "../services/api";
import { Bounce, ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
// } from "./ui/select";

interface CardChannelProps {
  id: string;
  name: string;
  description: string;
  image: string;
  url: string;
  likeCount: number;
  likedBy: {
    user_id: string;
    user_name: string;
    user_avatar: string;
  }[];
}

export function CardChannel(props: CardChannelProps) {

  return (
    <div className="w-[300px] p-3 bg-[#323262] rounded-md shadow-md relative">

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />

      <div className="w-full h-[130px] flex">
        <img src={props.image} alt={props.name} className="w-28 h-28 rounded-full" />

        <div className="w-full flex flex-col justify-center ml-5">
          <h2 className="text-lg font-bold">{props.name}</h2>
          <p className="text-xs text-gray-300 mb-1">{props.description}</p>
          <div className="w-full flex items-center justify-between">
            <button className="hover:text-red-400">
              <Heart size={24} weight="regular" />
            </button>
            <button className="hover:text-yellow-400">
              <Star size={24} weight="regular" />
            </button>

            <button className="hover:text-green-400">
              <BookmarkSimple size={24} weight="regular" />
            </button>
          </div>
          <Link to={props.id} className="w-[140px] text-center text-sm font-medium text-[#323262] px-5 py-2 mt-2 rounded-full bg-white">
            Acessar
          </Link>
        </div>
      </div>

      <div className="w-full absolute left-[220px] top-2 text-xs text-gray-400 flex items-center">
        {props.likedBy.slice(0, 3).map((user) => (
          <img
            key={user.user_id}
            src={user.user_avatar}
            alt={user.user_name}
            className="w-6 h-6 rounded-full -ml-3 border-[3px] border-[#323262]"
          />
        ))}
        <div className="w-full text-xs text-gray-400 flex items-center">
          <span className="text-sm">
            {props.likeCount > 0
              ? props.likeCount > 1
                ? `${props.likeCount} curtidas`
                : `${props.likeCount} curtida`
              : ""}
          </span>
        </div>
      </div>
    </div>
  );
}