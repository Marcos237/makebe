import styles from "./CTASection.module.css";

export function CTASection() {
  return (
    <section className={styles.container}>
      <div className={styles.content}>
        <h2 className={styles.title}>
          Pronto para renovar seu visual?
        </h2>

        <p className={styles.subtitle}>
          Agende seu horário com nossos profissionais agora mesmo
        </p>

        <button className={styles.button}>
          Agendar horário
        </button>
      </div>
    </section>
  );
}