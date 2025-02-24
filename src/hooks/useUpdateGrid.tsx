import { useEffect, useRef, useState, useCallback } from "react";

const useUpdateGrid = (
  gridData: any, 
  updateGrid: (data: any) => void, 
  dependencies: any[] = [],
  callback?: () => void  
) => {
  const prevGridDataRef = useRef(gridData); 
  const [deps, setDeps] = useState(dependencies);

  // Memoriza updateGrid corretamente, garantindo que não mude desnecessariamente
  const stableUpdateGrid = useCallback((data: any) => {
    updateGrid(data);
  }, [updateGrid]);

  useEffect(() => {
    if (gridData !== prevGridDataRef.current) {
      if (gridData) {
        stableUpdateGrid(gridData);
      }
      prevGridDataRef.current = gridData; 
    }

    if (callback) {
      callback(); 
    }

  }, [gridData, deps, callback, stableUpdateGrid]); 

  useEffect(() => {
    setDeps(dependencies);
  }, [dependencies]);
};

export default useUpdateGrid;
