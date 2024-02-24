// Button.js
import React from "react";

const Btn = ({ onClick, label }) => {
	return <button onClick={onClick}>{label}</button>;
};

export default Btn;
