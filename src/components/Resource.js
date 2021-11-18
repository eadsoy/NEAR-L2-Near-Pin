// src/components/Todo.js
//import { useState } from "react";

export function Resource({ creator, url, title, category }) {
  console.log('resource:', creator)
  return (
    <>
      <p>{creator}</p>
      <p>{url}</p>
      <p>{title}</p>
      <p>{category}</p>
    </>
  );
}