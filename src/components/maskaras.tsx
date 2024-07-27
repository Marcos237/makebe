import * as React from 'react';
import MaskedInput from 'react-text-mask';
import { MaskarasItens } from '../Interfaces/TextBox/MaskarasItens';

const CustomMaskedInput: React.ForwardRefRenderFunction<HTMLInputElement, MaskarasItens> = (
  { inputRef, mask, ...other },
  ref
) => {
  const handleRef = (maskedInputRef: any) => {
    if (inputRef && typeof inputRef === 'function') {
      if (maskedInputRef) {
        inputRef(maskedInputRef.inputElement);
      } else {
        inputRef(null);
      }
    }
  };

  if (mask && mask.length > 0) {
    return (
      <MaskedInput
        {...other}
        ref={handleRef}
        mask={mask}
      />
    );
  }

  return (
    <input
      {...other}
      ref={ref}
    />
  );
};

export default React.forwardRef(CustomMaskedInput);
