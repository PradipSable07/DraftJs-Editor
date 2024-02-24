import React from "react";
import Title from "./components/Title";
import DraftEditor from "./components/DraftEditor";
import Btn from "./components/Btn";
import MarkDownEditor from "./MarkDownEditor";

const App = () => {
	return (
		<>
			<Title title='Demo editor by Pradip Sable' />
			<DraftEditor />
		</>
	);
};

export default App;
