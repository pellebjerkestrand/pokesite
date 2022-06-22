import React from "react";

type Title = { text: string };

export const Title: React.FC<Title> = ({ text }) => (
  <h1 className="title">{text}</h1>
);
