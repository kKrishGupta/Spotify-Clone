import { X } from "lucide-react";
import Button from "./Button";

const Modal = ({ open, title, children, onClose }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-night/80 p-4 backdrop-blur-xl">
      <div className="glass-panel w-full max-w-lg rounded-[2rem] p-6">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="text-xl font-extrabold text-white">{title}</h2>
          <Button variant="ghost" className="h-10 w-10 rounded-full p-0" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
