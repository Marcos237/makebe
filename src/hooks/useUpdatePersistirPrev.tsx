import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom"; 

const useUpdatePersistirPrev = (
  fetchData: () => Promise<void>, 
  limparUpload?: () => Promise<void>, 
  item?: any
): void => {
    const isFirstRender = useRef(true);
    const prevItemRef = useRef(item);
    const prevPathnameRef = useRef(window.location.pathname);
    const location = useLocation(); 

    useEffect(() => {

        if (isFirstRender.current) {
            isFirstRender.current = false;

            if (limparUpload && typeof limparUpload === "function") {
                limparUpload();
            }
            return;
        }

        if (item && prevItemRef.current !== item) {
            fetchData();
        }
        if (prevPathnameRef.current !== location.pathname) {
            if (limparUpload && typeof limparUpload === "function") {
                limparUpload();
            }
            prevPathnameRef.current = location.pathname; 
        }

        prevItemRef.current = item;
    }, [item, fetchData, limparUpload, location.pathname]);
};

export default useUpdatePersistirPrev;
