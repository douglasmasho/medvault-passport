import { motion } from "framer-motion";
import Backdrop from "../Backdrop";

const dropIn = {
  hidden: {
    y: "-100vh",
    opacity: 0,
  },
  visible: {
    y: "0",
    opacity: 1,
    transition: {
      duration: 0.1,
      type: "spring",
      damping: 25,
      stiffness: 500,
    },
  },
  exit: {
    y: "100vh",
    opacity: 0,
  },
};

const Modal = ({ handleClose, text }) => {
  return (
    <Backdrop onClick={handleClose} variants={dropIn}>
      <motion.div
        onClick={(e) => e.stopPropagation()}
        className="modal bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        orgfjproejgoprjge
      </motion.div>
    </Backdrop>
  );
};

export default Modal;
