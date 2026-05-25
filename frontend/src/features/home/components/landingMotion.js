export const reveal = {
  initial: { opacity: 0, y: 26 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.55, ease: "easeOut" },
};

export const staggerReveal = {
  initial: "initial",
  whileInView: "animate",
  viewport: { once: true, margin: "-80px" },
  variants: {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.075,
      },
    },
  },
};

export const childReveal = {
  variants: {
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
  },
  transition: { duration: 0.42, ease: "easeOut" },
};
