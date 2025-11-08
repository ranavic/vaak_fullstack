import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "./components/Navbar";

function App() {
  const location = useLocation();

  // Softer warm palette for each page (beige <-> brown shifts)
  const getPageColors = (path) => {
    switch (path) {
      case "/":
        return { bg: "#F8EBD5", heading: "#5E3D22" }; // warm beige + deep brown
      case "/dictionary":
        return { bg: "#FAE6D0", heading: "#6B4220" }; // light sand tone
      case "/translate":
        return { bg: "#F5E0C8", heading: "#4B2C13" }; // creamy paper + espresso
      case "/history":
        return { bg: "#F3E8D2", heading: "#5A3B1E" }; // soft parchment + walnut
      default:
        return { bg: "#F8EBD5", heading: "#5E3D22" };
    }
  };

  const colors = getPageColors(location.pathname);

  const isHomePage = location.pathname === "/";

  return (
    <div className="min-h-screen overflow-hidden transition-colors duration-300">
      <Navbar />

      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{
            opacity: 0,
            backgroundColor: colors.bg,
            filter: "blur(4px)",
          }}
          animate={{
            opacity: 1,
            backgroundColor: colors.bg,
            filter: "blur(0px)",
          }}
          exit={{
            opacity: 0,
            backgroundColor: colors.bg,
            filter: "blur(4px)",
          }}
          transition={{
            duration: 0.35, // faster
            ease: [0.45, 0, 0.55, 1],
          }}
          className={!isHomePage ? "min-h-screen flex flex-col p-4 md:p-8" : ""}
        >
          {!isHomePage && (
            <motion.div
              initial={{ color: "#3B2A14" }}
              animate={{ color: colors.heading }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="text-center font-semibold text-3xl md:text-4xl tracking-wide mb-6"
            >
              Vaak
            </motion.div>
          )}

          <Outlet />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default App;
