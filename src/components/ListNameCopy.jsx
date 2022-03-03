import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { CopyToClipboard } from 'react-copy-to-clipboard';

export default function ListNameCopy({ copyText }) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyClick = () => {
    toast.success('Copied!');
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };
  return (
    <>
      <Toaster />
      <CopyToClipboard text={copyText}>
        <button onClick={handleCopyClick} className="px-2">
          <span>{isCopied ? 'Copied!' : 'Copy'}</span>
        </button>
      </CopyToClipboard>
    </>
  );
}
