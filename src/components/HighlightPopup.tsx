import React from "react";

import "../../style/HighlightPopup.css";
import { CommentedHighlight, ViewportHighlight } from "../../types";

interface HighlightPopupProps {
  highlight: ViewportHighlight<CommentedHighlight>;
}

const HighlightPopup = ({ highlight }: HighlightPopupProps) => {
  return highlight.comment ? (
    <div className="Highlight__popup">{highlight.comment}</div>
  ) : (
    <div className="Highlight__popup">Comment has no Text</div>
  );
};

export default HighlightPopup;
