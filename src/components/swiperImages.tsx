'use client'
import 'swiper/css';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide} from 'swiper/react';
import Image from 'next/image';
import { Autoplay } from 'swiper/modules';

export default function SwiperImages(props : { list: any[] }) {
  const { list } = props;
  const quantSlides = list.length > 3 ? 3 : list.length;
  return(
    <div className="text-black w-full">
      <Swiper
        modules={[Autoplay]}
        pagination={{clickable: true}}
        loop={true}
        slidesPerView={quantSlides}
        autoplay={{delay: 3000 }}
        className="w-full bg-black"
      >
        {
          list && list.length > 0 && list.map((itemList: string, index: number) => (
            <SwiperSlide key={index} className="mt-2 sm:mt-0">
              <Image
                src={itemList}
                alt={`Imagem ${index + 1} do jogo`}
                width={1000}
                height={1000}
                className="w-full object-contain h-48"
              />
            </SwiperSlide>
          ))
        }
      </Swiper>
    </div>
  );
}