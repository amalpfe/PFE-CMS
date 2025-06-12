import { motion } from "framer-motion";
import Banner from "../components/Banner";
import Header from "../components/Header";
import Speciality from "../components/Speciality";
// import TopDoctors from "../components/TopDoctors";

// Section animation variant
const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const Home = () => {
  return (
    <main className="space-y-12">
      <motion.section
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
      >
        <Header />
      </motion.section>

      <motion.section
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
      >
        <Speciality />
      </motion.section>

      <motion.section
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
      >
        {/* <TopDoctors /> */}
      </motion.section>

      <motion.section
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
      >
        <Banner />
      </motion.section>
    </main>
  );
};

export default Home;
