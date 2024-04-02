'use client'
import { authenticate } from "@/firebase/authenticate";
import { getUserByEmail } from "@/firebase/user";
import { updateReview } from "@/firebase/video";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoIosStar, IoIosStarOutline } from "react-icons/io";

export default function UpdateReview(props: any) {
  const { video } = props;
  const [review, setReview] = useState(0);
  const [loggedUser, setLoggedUser] = useState<any>();
  const router = useRouter();

  useEffect(() => {
    const authUser = async () => {
      const auth = await authenticate();
      if (auth) {
        const user = await getUserByEmail(auth.email);
        setLoggedUser(user);
        const findUser = video.reviews.find((rev: any) => rev.user === auth.email);
        if (findUser) setReview(findUser.value);
      } else router.push("/");
    };
    authUser();
  }, []);

  const updateValue = async (value: number) => {
    const findUser = video.reviews.find((rev: any) => rev.user === loggedUser.email);
    const filterUsers = video.reviews.filter((rev: any) => rev.user !== loggedUser.email);
    console.log(findUser);
    if (findUser) {
      findUser.value = value;
      video.reviews = [...filterUsers, findUser];
      await updateReview(video);
    } else {
      video.reviews = [...filterUsers, { user: loggedUser.email, value }];
      await updateReview(video);
    }
    setReview(value);
  };

  return(
    <div className="flex gap-1 pb-3">
      {
        review >= 1
        ? <IoIosStar
            className="text-2xl cursor-pointer text-violet-500"
            onClick={() => updateValue(0)}
          />
        : < IoIosStarOutline className="text-2xl cursor-pointer text-violet-500"
            onClick={() => updateValue(1)}
          />
      }
      {
        review >= 2
        ? <IoIosStar
            className="text-2xl cursor-pointer text-violet-500"
            onClick={() => updateValue(2)}
          />
        : < IoIosStarOutline className="text-2xl cursor-pointer text-violet-500"
            onClick={() => updateValue(2)}
          />
      }
      {
        review >= 3
        ? <IoIosStar
            className="text-2xl cursor-pointer text-violet-500"
            onClick={() => updateValue(3)}
          />
        : < IoIosStarOutline className="text-2xl cursor-pointer text-violet-500"
            onClick={() => updateValue(3)}
          />
      }
      {
        review >= 4
        ? <IoIosStar
            className="text-2xl cursor-pointer text-violet-500"
            onClick={() => updateValue(4)}
          />
        : < IoIosStarOutline className="text-2xl cursor-pointer text-violet-500"
            onClick={() => updateValue(4)}
          />
      }
      {
        review === 5
        ? <IoIosStar
            className="text-2xl cursor-pointer text-violet-500"
            onClick={() => updateValue(5)}
          />
        : < IoIosStarOutline className="text-2xl cursor-pointer text-violet-500"
            onClick={() => updateValue(5)}
          />
      }
    </div>
  );
}