import React from "react";
import { PdfAnnotator } from "react-pdf-annotator-component";
import { UpdateHighlights } from "../../types";
import { testHighlights as _testHighlights } from "./test-highlights";

const SAMPLE_URL = "https://arxiv.org/pdf/2203.11115";
const TEST_HIGHLIGHTS = _testHighlights;

/* This is called whenever the highlights change (i.e. on add, delete, edit, or clear) */
const updateHighlights: UpdateHighlights = (highlights, modfication) => {
  console.log(`Highlights for ${SAMPLE_URL} have been modfied.`);
  console.log(`Modification type: ${modfication?.type}`);
  console.log("Modfied highlight:", modfication?.highlight);
};

const App = () => {
  return (
    <PdfAnnotator
      url={SAMPLE_URL}
      updateHighlights={updateHighlights}
      savedHighlights={TEST_HIGHLIGHTS}
    ></PdfAnnotator>
  );
};

export default App;
