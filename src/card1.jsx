import React from "react";
import Any3D_Number from "./components3D/number/Any3D_Number";
import Any3D_Alphabet from "./components3D/Alphabets/Any3D_Alphabet";
import Any3D_Alphabet1 from "./components3D/Alphabets/Any3D_Alphabet1";

const lettersHAPPY = ["H", "A", "P", "P", "Y"];
const lettersNEW = ["N", "E", "W"];
const lettersYEAR = ["Y", "E", "A", "R"];
const numbers = ["2", "0", "2", "6"];

export default function Card1() {
  return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100vh", zIndex: "100" }}>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center" }}>
        {lettersHAPPY.map((l, i) => (
          <span key={i} className="pop-in" style={{ animationDelay: `${i * 0.1}s` }}>
            <Any3D_Alphabet1 value={l} />
          </span>
        ))}
        <div style={{ padding: "10px" }}></div>
        {lettersNEW.map((l, i) => (
          <span key={i} className="pop-in" style={{ animationDelay: `${(i + lettersHAPPY.length) * 0.1}s` }}>
            <Any3D_Alphabet value={l} />
          </span>
        ))}
        <div style={{ padding: "10px" }}></div>
        {lettersYEAR.map((l, i) => (
          <span key={i} className="pop-in" style={{ animationDelay: `${(i + lettersHAPPY.length + lettersNEW.length) * 0.1}s` }}>
            <Any3D_Alphabet value={l} />
          </span>
        ))}
      </div>

      <div style={{ padding: "10px" }}></div>

      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
        {numbers.map((n, i) => (
          <span key={i} className="pop-in" style={{ animationDelay: `${(i + lettersHAPPY.length + lettersNEW.length + lettersYEAR.length) * 0.1}s` }}>
            <Any3D_Number value={n} />
          </span>
        ))}
      </div>
    </div>
  );
}
