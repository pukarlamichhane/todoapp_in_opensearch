import React, { useState } from 'react';
import { EuiFieldText } from '@elastic/eui';

export default function Textfield(props: any) {
  const { passData, handlePassData, placeholder } = props;
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: any) => {
    const currentValue = e.target.value;
    handlePassData(currentValue);
    const trimmedTitle = currentValue.trim();
    if (currentValue.length === 0) {
      setErrorMessage('Error message');
    } else if (currentValue.length !== trimmedTitle.length) {
      setErrorMessage('Remove spacing');
    } else {
      setErrorMessage('');
    }
  };

  console.log(passData, 'this is value');
  return (
    /* DisplayToggles wrapper for Docs only */
    <div className="textfield">
      <EuiFieldText
        placeholder={placeholder}
        value={passData}
        onChange={handleChange}
        aria-label="Use aria labels when no actual label is in use"
      />
      {errorMessage && <div className="error-message">{errorMessage}</div>}
    </div>
  );
}
