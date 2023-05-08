import React, { useState, useCallback } from "react";
import { Document, Page } from "react-pdf/dist/esm/entry.webpack";
import "./style.css";
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

const options = {
  cMapUrl: "cmaps/",
  cMapPacked: true,
  standardFontDataUrl: "standard_fonts/",
};

export const PdfViewer = ({ preview, setPreview, markWords }) => {
  const [file, setFile] = useState(preview);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  console.log('markWords', markWords);
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  function changePage(offset) {
    setPageNumber((prevPageNumber) => prevPageNumber + offset);
  }

  function previousPage() {
    changePage(-1);
  }

  function nextPage() {
    changePage(1);
  }


  function highlightPattern(text, pattern) {
    var str = text;
    pattern.forEach((p) => {
      str = str.replace(p, (value) => `<mark>${value}</mark>`);
    });
    return str;
  }

  const arr = ['Closing', 'CHECK', 'PURCHASE'];

  //replace arr with dictionary 1D array
  const textRenderer = useCallback(
    (textItem) => highlightPattern(textItem.str, markWords),
    []
  );

  return (
        <div className="main_container">
          <Document
            file={file}
            onLoadSuccess={onDocumentLoadSuccess}
            options={options}
          >
            <Page pageNumber={pageNumber} 
            
            customTextRenderer={textRenderer}
            renderTextLayer={true}
            width={690}
            />
          </Document>
          <div className="bottom_section_pdf">
            <button
              type="button"
              disabled={pageNumber <= 1}
              onClick={previousPage}
            >
              ‹
            </button>
            <span>
              {pageNumber || (numPages ? 1 : "--")} of {numPages || "--"}
            </span>
            <button
              type="button"
              disabled={pageNumber >= numPages}
              onClick={nextPage}
            >
              ›
            </button>
          </div>
        </div>
  );
};
