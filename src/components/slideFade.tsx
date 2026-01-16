import React from 'react';
import { Fade } from '@mui/material';
import type { TransitionProps } from '@mui/material/transitions';

const OnlyFade = React.forwardRef(function OnlyFadeTransition(props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return (
    <Fade ref={ref} {...props} timeout={props.timeout}>
      {props.children}
    </Fade>
  );
});

export default OnlyFade;
