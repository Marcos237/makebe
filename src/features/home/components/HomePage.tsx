import React from "react";
import { Box } from "@mui/material";

import Banner from "../../../components/banner";
import Footer from "../../../components/footer";
import Carroussel from "../../../components/slider";

import { HeroBanner } from "../components/HeroBanner";
import { ServicesSection } from "../components/ServicesSection";
import { ProfessionalsSection } from "../components/ProfessionalsSection";
import { CTASection } from "../components/CTASection";

import { useHome } from "../hooks/useHome";
import styles from "./HomePage.module.css";

const HomePage: React.FC = () => {
  const { usuarioLogado } = useHome();

  return (
    <main className={styles.container}>
      
      {/* HEADER / BANNER EXISTENTE */}
      <Banner usuarioLogado={usuarioLogado} />

      {/* HERO (nova vitrine) */}
      <HeroBanner />

      {/* CARROSSEL EXISTENTE */}
      <Carroussel />

      {/* SERVIÇOS */}
      <Box className={styles.section}>
        <ServicesSection />
      </Box>

      {/* PROFISSIONAIS */}
      <Box className={styles.section}>
        <ProfessionalsSection />
      </Box>

      {/* CTA */}
      <Box className={styles.section}>
        <CTASection />
      </Box>

      {/* FOOTER EXISTENTE */}
      <Footer />
      
    </main>
  );
};

export default HomePage;
