'use client'
import { getVideoById } from "@/firebase/video";
import { useEffect, useState } from "react";
import { IoIosStar, IoIosStarOutline } from "react-icons/io";

export default function StaticReviews(props: any) {
  const { video } = props;
  const [review, setReview] = useState(0);

  useEffect(() => {
    updatedReview();
  }, []);

  const updatedReview = async () => {
    const getVideo = await getVideoById(video.id);
    if (getVideo) {
      const reviews = getVideo.reviews;
      var numberNote = 0;
      for (let i = 0; i < reviews.length; i += 1) {
        numberNote += Number(reviews[i].value);
      }
      const media = numberNote / reviews.length;
      setReview(media);
    }
  };

  return(
    <div className="flex gap-1 pb-3">
      {
        review >= 1
        ? <IoIosStar className="text-lg text-violet-500" />
        : <IoIosStarOutline className="text-lg text-violet-500" />
      }
      {
        review >= 2
        ? <IoIosStar className="text-lg text-violet-500" />
        : <IoIosStarOutline className="text-lg text-violet-500" />
      }
      {
        review >= 3
        ? <IoIosStar className="text-lg text-violet-500" />
        : <IoIosStarOutline className="text-lg text-violet-500" />
      }
      {
        review >= 4
        ? <IoIosStar className="text-lg text-violet-500" />
        : <IoIosStarOutline className="text-lg text-violet-500" />
      }
      {
        review === 5
        ? <IoIosStar className="text-lg text-violet-500" />
        : <IoIosStarOutline className="text-lg text-violet-500" />
      }
    </div>
  );
}