import { useEffect, useRef } from "react";

const useUpdatePersistirPrev = (fetchData: () => Promise<void>, limparUpload?: () => Promise<void>, item?: any): void => {
    const prevItemRef = useRef(item);

    useEffect(() => {
        const prevItem = prevItemRef.current;

        if (item && prevItem !== item) {
            fetchData();
        }
        prevItemRef.current = item;
        if (!prevItem) {
            fetchData();
        }
        if(prevItem && prevItem === item){
            limparUpload?.()
        }

    }, [fetchData, item, limparUpload]);
};

export default useUpdatePersistirPrev;

