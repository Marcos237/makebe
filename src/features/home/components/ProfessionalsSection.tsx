import styles from "./ProfessionalsSection.module.css";

const professionals = [
  { name: "João Silva", role: "Barbeiro" },
  { name: "Maria Souza", role: "Colorista" },
  { name: "Carlos Lima", role: "Cabeleireiro" },
];

export function ProfessionalsSection() {
  return (
    <section className={styles.container}>
      <h2 className={styles.title}>Profissionais</h2>

      <div className={styles.grid}>
        {professionals.map((p, index) => (
          <div key={index} className={styles.card}>
            <div className={styles.avatar}></div>

            <h3>{p.name}</h3>
            <p>{p.role}</p>
          </div>
        ))}
      </div>
    </section>
  );
}