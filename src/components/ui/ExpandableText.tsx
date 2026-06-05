"use client";
import React, { useState } from "react";
import { Text } from "@radix-ui/themes";

interface ExpandableTextProps {
  text?: string;
  maxLength?: number;
  className?: string;
  textStyle?: string;
  buttonStyle?: string;
}

const ExpandableText: React.FC<ExpandableTextProps> = ({
  text = "",
  maxLength = 100,
  className = "",
  textStyle = "",
  buttonStyle = "",
}) => {
  const [expanded, setExpanded] = useState(false);

  if (!text) {
    return (
      <Text size="2" className={`text-gray-500 ${className}`}>
        -- No description provided --
      </Text>
    );
  }

  const isLong = text.length > maxLength;
  const displayText = expanded
    ? text
    : text.substring(0, maxLength) + (isLong ? "..." : "");

  return (
    <div className={`flex flex-col ${className}`}>
      <Text size="2" className={`${textStyle}`}>
        {displayText}
      </Text>
      {isLong && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(!expanded);
          }}
          className={buttonStyle ? buttonStyle : "text-sm text-blue-600 hover:text-blue-800 transition-all self-start mt-1 cursor-pointer!"}
        >
          {expanded ? "See less" : "See more"}
        </button>
      )}
    </div>
  );
};

export default ExpandableText;
