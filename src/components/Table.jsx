import React from "react";
import "./Table.css";

export default function Table({ headers, children }) {
  return (
    <table className="custom-table">
      <thead>
        <tr>
          {headers.map((h, i) => (
            <th key={i}>{h}</th>
          ))}
        </tr>
      </thead>

      <tbody>{children}</tbody>
    </table>
  );
}
