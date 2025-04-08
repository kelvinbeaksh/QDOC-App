import React from "react";
import linkify from "linkify-it";
import { Link } from "react-router-dom";

interface TextMessageProps {
  body: string;
  isLocalParticipant: boolean;
}

const addLinks = (text: string) => {
  const matches = linkify().match(text);
  if (!matches) return text;

  const results = [];
  let lastIndex = 0;

  matches.forEach((match, i) => {
    results.push(text.slice(lastIndex, match.index));
    results.push(
      <Link target="_blank" rel="noreferrer" to={match.url} key={i}>
        {match.text}
      </Link>
    );
    lastIndex = match.lastIndex;
  });

  results.push(text.slice(lastIndex, text.length));

  return results;
};

const TextMessage = ({ body, isLocalParticipant }: TextMessageProps) => (
  <div>
    <div>{addLinks(body)}</div>
  </div>
);
export default TextMessage;
