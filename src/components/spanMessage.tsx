import * as React from 'react';
import { SpanMessageProps } from '../Interfaces/shared/spanMessageItem';

const SpanMessage: React.FC<SpanMessageProps> = ({ id }) => {
  return (
    <>
      <span id={id}></span>
      <div className={`erroSession_${id} spanErro`}></div>
    </>
  );
};

export default SpanMessage;
