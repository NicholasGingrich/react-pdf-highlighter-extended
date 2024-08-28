import React, { MouseEvent, useEffect, useRef, useState } from "react";
import CommentForm from "./CommentForm";
import ContextMenu, { ContextMenuProps } from "./ContextMenu";
import ExpandableTip from "./ExpandableTip";
import HighlightContainer from "./HighlightContainer";
import Sidebar from "./Sidebar";
import Toolbar from "./Toolbar";
import "../../style/App.css";
import {
  CommentedHighlight,
  GhostHighlight,
  Tip,
  ViewportHighlight,
  Highlight,
  HighlightModication,
  UpdateHighlights,
} from "../../types";
import {
  PdfHighlighterUtils,
  PdfLoader,
  PdfHighlighter,
} from "react-pdf-highlighter-extended";

const getNextId = () => String(Math.random()).slice(2);

const parseIdFromHash = () => {
  return document.location.hash.slice("#highlight-".length);
};

const resetHash = () => {
  document.location.hash = "";
};

interface PdfAnnotatorProps {
  url: string;
  savedHighlights: CommentedHighlight[];
  updateHighlights: UpdateHighlights;
}

const PdfAnnotator: React.FC<PdfAnnotatorProps> = ({
  url,
  savedHighlights,
  updateHighlights,
}) => {
  const [highlights, setHighlights] = useState<Array<CommentedHighlight>>(
    savedHighlights ?? []
  );
  const [contextMenu, setContextMenu] = useState<ContextMenuProps | null>(null);
  const [pdfScaleValue, setPdfScaleValue] = useState<number | undefined>(
    undefined
  );

  // Refs for PdfHighlighter utilities
  const highlighterUtilsRef = useRef<PdfHighlighterUtils>();

  // Click listeners for context menu
  useEffect(() => {
    const handleClick = () => {
      if (contextMenu) {
        setContextMenu(null);
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [contextMenu]);

  const handleContextMenu = (
    event: MouseEvent<HTMLDivElement>,
    highlight: ViewportHighlight<CommentedHighlight>
  ) => {
    event.preventDefault();

    setContextMenu({
      xPos: event.clientX,
      yPos: event.clientY,
      deleteHighlight: () => deleteHighlight(highlight),
      editComment: () => editComment(highlight),
    });
  };

  const addHighlight = (highlight: GhostHighlight, comment: string) => {
    console.log("Saving highlight", highlight);
    const newHighlight = { ...highlight, comment, id: getNextId() };
    const updatedHighlights = [newHighlight, ...highlights];
    const modification: HighlightModication = {
      type: "Add",
      highlight: newHighlight,
    };
    setHighlights(updatedHighlights);
    updateHighlights(updatedHighlights, modification); //update highlights externally to component
  };

  const deleteHighlight = (highlight: ViewportHighlight | Highlight) => {
    console.log("Deleting highlight", highlight);
    const updatedHighlights = highlights.filter((h) => h.id != highlight.id);
    const modification: HighlightModication = {
      type: "Delete",
      highlight: highlight,
    };
    setHighlights(updatedHighlights);
    updateHighlights(updatedHighlights, modification); //update highlights externally to component
  };

  const editHighlight = (
    idToUpdate: string,
    edit: Partial<CommentedHighlight>
  ) => {
    console.log(`Editing highlight ${idToUpdate} with `, edit);
    const updatedHighlights = highlights.map((highlight) =>
      highlight.id === idToUpdate ? { ...highlight, ...edit } : highlight
    );

    const editIndex = updatedHighlights.findIndex(
      (highlight) => highlight.id === idToUpdate
    );
    const highlight = { ...highlights[editIndex], ...edit };
    const modification: HighlightModication = {
      type: "Edit",
      highlight: highlight,
    };

    setHighlights(updatedHighlights);
    updateHighlights(updatedHighlights, modification); //update highlights externally to component
  };

  const resetHighlights = () => {
    const modification: HighlightModication = {
      type: "Clear",
    };
    setHighlights([]);
    updateHighlights([], modification); //update highlights externally to component
  };

  const getHighlightById = (id: string) => {
    return highlights.find((highlight) => highlight.id === id);
  };

  // Open comment tip and update highlight with new user input
  const editComment = (highlight: ViewportHighlight<CommentedHighlight>) => {
    if (!highlighterUtilsRef.current) return;

    const editCommentTip: Tip = {
      position: highlight.position,
      content: (
        <CommentForm
          placeHolder={
            highlight.comment ? highlight.comment : "Your comment..."
          }
          onSubmit={(input) => {
            editHighlight(highlight.id, { comment: input });
            highlighterUtilsRef.current!.setTip(null);
            highlighterUtilsRef.current!.toggleEditInProgress(false);
          }}
        ></CommentForm>
      ),
    };

    highlighterUtilsRef.current.setTip(editCommentTip);
    highlighterUtilsRef.current.toggleEditInProgress(true);
  };

  // Scroll to highlight based on hash in the URL
  const scrollToHighlightFromHash = () => {
    const highlight = getHighlightById(parseIdFromHash());

    if (highlight && highlighterUtilsRef.current) {
      highlighterUtilsRef.current.scrollToHighlight(highlight);
    }
  };

  // Hash listeners for autoscrolling to highlights
  useEffect(() => {
    window.addEventListener("hashchange", scrollToHighlightFromHash);

    return () => {
      window.removeEventListener("hashchange", scrollToHighlightFromHash);
    };
  }, [scrollToHighlightFromHash]);

  return (
    <div className="App" style={{ display: "flex", height: "100vh" }}>
      <Sidebar highlights={highlights} resetHighlights={resetHighlights} />
      <div
        style={{
          height: "100vh",
          width: "75vw",
          overflow: "hidden",
          position: "relative",
          flexGrow: 1,
        }}
      >
        <Toolbar setPdfScaleValue={(value) => setPdfScaleValue(value)} />
        <PdfLoader document={url}>
          {(pdfDocument) => (
            <PdfHighlighter
              enableAreaSelection={(event) => event.altKey}
              pdfDocument={pdfDocument}
              onScrollAway={resetHash}
              utilsRef={(_pdfHighlighterUtils) => {
                highlighterUtilsRef.current = _pdfHighlighterUtils;
              }}
              pdfScaleValue={pdfScaleValue}
              selectionTip={<ExpandableTip addHighlight={addHighlight} />}
              highlights={highlights}
              style={{
                height: "calc(100% - 41px)",
              }}
            >
              <HighlightContainer
                editHighlight={editHighlight}
                onContextMenu={handleContextMenu}
              />
            </PdfHighlighter>
          )}
        </PdfLoader>
      </div>

      {contextMenu && <ContextMenu {...contextMenu} />}
    </div>
  );
};

export default PdfAnnotator;
