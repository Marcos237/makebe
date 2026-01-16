import { useEffect } from "react";

export function useHiddenItem(formHidden: string, formOpen: string, visivel: boolean) {

  useEffect(() => {
    const formClose = document.querySelector(`.${formHidden}`);
    const formOpenItem = document.querySelector(`.${formOpen}`);

    if (visivel) {
      formClose?.classList.remove("hidden");
      formOpenItem?.classList.add("hidden");
    } else {
      formClose?.classList.add("hidden");
      formOpenItem?.classList.remove("hidden");
    }
  }, [formHidden, formOpen, visivel]);
}