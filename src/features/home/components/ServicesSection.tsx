import styles from "./ServicesSection.module.css";

const services = [
  { title: "Corte", description: "Estilo moderno e personalizado" },
  { title: "Barba", description: "Acabamento perfeito" },
  { title: "Coloração", description: "Técnicas profissionais" },
  { title: "Tratamento", description: "Cuidados capilares completos" },
];

export function ServicesSection() {
  return (
    <section className={styles.container}>
      <h2 className={styles.title}>Serviços</h2>

      <div className={styles.grid}>
        {services.map((service, index) => (
          <div key={index} className={styles.card}>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}