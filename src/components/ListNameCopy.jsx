import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { CopyToClipboard } from 'react-copy-to-clipboard';

/* export default function ListNameCopy({ copyText }) {
  const [isCopied, setIsCopied] = useState(false);

  async function copyTextToClipboard(text) {
    if ('clipboard' in navigator) {
      return await navigator.clipboard.writeText(text);
    } else {
      return document.execCommand('copy', true, text);
    }
  }
  // onClick handler function for the copy button
  const handleCopyClick = () => {
    // Asynchronously call copyTextToClipboard
    copyTextToClipboard(copyText)
      .then(() => {
        // If successful, update the isCopied state value
        setIsCopied(true);
        toast.success('Copied!');
        setTimeout(() => {
          setIsCopied(false);
        }, 2000);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <Toaster />
      <input
        type="text"
        value={` ${copyText}`}
        readOnly
        style={{ backgroundColor: '#0369a1', fontWeight: 'bold', width: '20%' }}
      />
      <button onClick={handleCopyClick}>
        <span>{isCopied ? 'Copied!' : 'Copy'}</span>
      </button>
    </>
  );
} */
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
