import React from "react";
import { Grid, Box } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import "../assets/styles/Carrousel/carrousel.css";
import pexelsImage1 from "../assets/images/imagem1.jpg";
import pexelsImage2 from "../assets/images/imagem2.jpg";
import pexelsImage3 from "../assets/images/imagem3.jpg";
import pexelsImage4 from "../assets/images/imagem4.jpg";
import pexelsImage5 from "../assets/images/imagem4.jpg";
import pexelsImage6 from "../assets/images/imagem4.jpg";
import pexelsImage7 from "../assets/images/imagem4.jpg";
import pexelsImage8 from "../assets/images/imagem4.jpg";
import pexelsImage9 from "../assets/images/imagem4.jpg";

const pexelsImages = [
  pexelsImage1, pexelsImage2, pexelsImage3,
  pexelsImage4, pexelsImage5, pexelsImage6,
  pexelsImage7, pexelsImage8, pexelsImage9
];

export interface CarrouselItem {
  nomeImagem?: string;
  urlImagem?: string;
  tituloImagem?: string;
}

interface CarrouselProps {
  items?: CarrouselItem[];
}

const Carrousel: React.FC<CarrouselProps> = ({ items = [] }) => {
  const imagens = items
    .filter((item) => Boolean(item?.urlImagem))
    .map((item, index) => ({
      id: item.nomeImagem ?? `${index}`,
      url: item.urlImagem ?? "",
      titulo: item.tituloImagem ?? `imagem${index + 1}`,
    }));

  const imagensFallback = pexelsImages.map((image, index) => ({
    id: `${index}`,
    url: image,
    titulo: `imagem${index + 1}`,
  }));

  const slides = imagens.length > 0 ? imagens : imagensFallback;

  return (
    <Box className="sessao">
        <Grid container spacing={0}>
          <Grid item xs={12}>
            <div className="carrousel">
              <Swiper
                spaceBetween={30}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                loop={true}
                autoplay={{
                  delay: 4500,
                  disableOnInteraction: false,
                }}
                modules={[Autoplay, Pagination, Navigation]}
              >
                {slides.map((slide, index) => (
                  <SwiperSlide key={slide.id} className="imagens">
                    <div className="carrousel-slide">
                      <img src={slide.url} alt={slide.titulo} className="carrousel-image" />
                      <div className="carrousel-caption">
                        {slide.titulo}
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </Grid>
        </Grid>
    </Box>
  );
};

export default Carrousel;
