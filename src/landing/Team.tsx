import { motion } from "motion/react";
import { Reveal, Words } from "../motion/primitives";
import { ease } from "../motion/tokens";

const SCHOOLS = ["Ho Chi Minh City University of Technology (HCMUT)", "University of Technology Sydney (UTS)"];

const TEAM: { name: string; role: string; photo: string }[] = [
  { name: "Long Quan Ton", role: "AI Engineer", photo: "/team/long-quan-ton.jpg" },
  { name: "Thanh Loi Tran", role: "ML Engineer", photo: "/team/thanh-loi-tran.jpg" },
  { name: "Huu Nhan Nguyen", role: "Backend Engineer", photo: "/team/huu-nhan-nguyen.jpg" },
  { name: "Vo Di Luan Dang", role: "Data Scientist", photo: "/team/vo-di-luan-dang.jpg" },
];

export function Team() {
  return (
    <section id="team" className="section">
      <div className="container">
        <div className="section-head">
          <Reveal><span className="eyebrow">Team GenData</span></Reveal>
          <h2><Words text="The people behind Unfound." /></h2>
        </div>
        <ul className="team">
          {TEAM.map((m, i) => (
            <motion.li
              key={m.name}
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7, ease: ease.out, delay: i * 0.08 }}
            >
              <div className="team-photo"><img src={m.photo} alt={`Portrait of ${m.name}`} loading="lazy" /></div>
              <div className="team-body">
                <h3>{m.name}</h3>
                <span className="team-role">{m.role}</span>
                <ul className="team-schools">
                  {SCHOOLS.map((s) => <li key={s}>{s}</li>)}
                </ul>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
