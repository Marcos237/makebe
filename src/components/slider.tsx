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

const Carrousel: React.FC = () => {
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
                {pexelsImages.map((image, index) => (
                  <SwiperSlide key={index} className="imagens">
                    <img src={image} alt={`imagem${index + 1}`} className="carrousel-image" />
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
