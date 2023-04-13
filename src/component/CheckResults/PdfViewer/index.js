import React, { useState } from "react";
import { Document, Page } from "react-pdf/dist/esm/entry.webpack";
import "./style.css";

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

  const highlightPattern = (text, highlightWords) => {
    // This is the only major change -- rather than searching for a string, create a regex to search
    // for any strings in a provided array
    const regex = new RegExp(highlightWords.join('|'), 'gi')
    const splitText = text.split(regex)

    if (splitText.length <= 1) {
      return text
    }

    const matches = text.match(regex)

    return splitText.reduce(
      (arr, element, index) =>
        matches[index]
          ? [...arr, element, <mark
            style={{ backgroundColor: "orange" }}
            key={index}
          >
            {matches[index]}
          </mark>]
          : [...arr, element],
      []
    )
  }
  const makeTextRenderer = searchText => textItem => highlightPattern(textItem.str, searchText);

  return (
        <div className="Pdf__container__document">
          <Document
            file={file}
            onLoadSuccess={onDocumentLoadSuccess}
            options={options}
          >
            <Page pageNumber={pageNumber} 
            
            customTextRenderer={makeTextRenderer(markWords)}
            renderTextLayer={true}
            width={690}
            // scale={0.95}
            // renderMode="svg"
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
