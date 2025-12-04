import React, { useState } from "react";

const ReadMoreText = ({ text }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const limit = 80; // Kitna text by default show karna hai

  const toggleReadMore = () => setIsExpanded(!isExpanded);

  return (
    <span className="text-secondary mt-1">
      {isExpanded ? text : text.slice(0, limit) + (text.length > limit ? "..." : "")}
      {text.length > limit && (
        <button
          onClick={toggleReadMore}
          className="text-primary border-0"
        >
          {isExpanded ? "Read Less" : "Read More"}
        </button>
      )}
    </span>
  );
};

export default ReadMoreText;
