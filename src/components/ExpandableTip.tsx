import React, { useLayoutEffect, useRef, useState } from "react";
import CommentForm from "./CommentForm";
import "../../style/ExpandableTip.css";
import { GhostHighlight, PdfSelection } from "../../types";
import { usePdfHighlighterContext } from "react-pdf-highlighter-extended";
interface ExpandableTipProps {
  addHighlight: (highlight: GhostHighlight, comment: string) => void;
}

const ExpandableTip = ({ addHighlight }: ExpandableTipProps) => {
  const [compact, setCompact] = useState(true);
  const selectionRef = useRef<PdfSelection | null>(null);

  const {
    getCurrentSelection,
    removeGhostHighlight,
    setTip,
    updateTipPosition,
  } = usePdfHighlighterContext();

  useLayoutEffect(() => {
    updateTipPosition!();
  }, [compact]);

  return (
    <div className="Tip">
      {compact ? (
        <button
          className="Tip__compact"
          onClick={() => {
            setCompact(false);
            selectionRef.current = getCurrentSelection();
            selectionRef.current!.makeGhostHighlight();
          }}
        >
          Add highlight
        </button>
      ) : (
        <CommentForm
          placeHolder="Your comment..."
          onSubmit={(input) => {
            addHighlight(
              {
                content: selectionRef.current!.content,
                type: selectionRef.current!.type,
                position: selectionRef.current!.position,
              },
              input
            );

            removeGhostHighlight();
            setTip(null);
          }}
        />
      )}
    </div>
  );
};

export default ExpandableTip;
