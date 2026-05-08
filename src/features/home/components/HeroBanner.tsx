import styles from "./HeroBanner.module.css";

export function HeroBanner() {
  return (
    <section className={styles.hero}>
      <div className={styles.overlay}>
        <h1 className={styles.title}>
          Transforme seu visual
        </h1>

        <p className={styles.subtitle}>
          Corte, coloração e cuidados personalizados
        </p>

        <button className={styles.button}>
          Agendar agora
        </button>
      </div>
    </section>
  );
}