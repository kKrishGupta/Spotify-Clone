import { useEffect } from "react";

export function useDocumentTitle(title, description) {
  useEffect(() => {
    document.title = `${title} - BeatFlow AI`;

    if (description) {
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement("meta");
        meta.name = "description";
        document.head.appendChild(meta);
      }
      meta.content = description;
    }
  }, [description, title]);
}
