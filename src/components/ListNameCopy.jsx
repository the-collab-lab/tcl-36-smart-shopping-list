import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { HiClipboardCopy } from 'react-icons/hi';
import { IconContext } from 'react-icons';

// UI component enabling users to copy list name to share with others
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
    // tailwindcss classes for styling (flex, text, hover effects)
    <>
      <Toaster />
      <CopyToClipboard text={copyText}>
        <IconContext.Provider value={{ color: 'tomato', size: '1.6em' }}>
          <button
            onClick={handleCopyClick}
            className="hover:text-tomato text-xl flex flex-row items-center whitespace-pre mx-4"
          >
            <HiClipboardCopy /> {isCopied ? ' Copied!' : ' Copy'}
          </button>
        </IconContext.Provider>
      </CopyToClipboard>
    </>
  );
}
