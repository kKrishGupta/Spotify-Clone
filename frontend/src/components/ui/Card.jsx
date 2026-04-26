import { cn } from "../../utils/helpers";

const Card = ({ children, className = "", as: Component = "div" }) => {
  return (
    <Component className={cn("glass-soft rounded-[1.75rem] p-5", className)}>
      {children}
    </Component>
  );
};

export default Card;
