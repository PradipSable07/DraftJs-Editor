import React, { useState, useEffect } from "react";
import {
	Editor,
	EditorState,
	RichUtils,
	getDefaultKeyBinding,
	convertToRaw,
	convertFromRaw,
	Modifier,
	SelectionState,
} from "draft-js";

import Btn from "./Btn";
const styleMap = {
	UNDERLINE_STYLE: {
		textDecoration: "underline",
	},
	RED_LINE_STYLE: {
		color: "red",
	},
};
const DraftEditor = () => {
	const [editorState, setEditorState] = useState(() => {
		const savedContent = localStorage.getItem("editorContent");
		if (savedContent) {
			const contentState = convertFromRaw(JSON.parse(savedContent));
			return EditorState.createWithContent(contentState);
		}
		return EditorState.createEmpty();
	});

	const handleChange = (newEditorState) => {
		setEditorState(newEditorState);
	};

	const handleKeyCommand = (command, editorState) => {
		if (command === "header") {
			setEditorState(RichUtils.toggleBlockType(editorState, "header-one"));
			return "handled";
		} else if (command === "bold") {
			setEditorState(RichUtils.toggleInlineStyle(editorState, "BOLD"));
			return "handled";
		} else if (command === "red") {
			setEditorState(
				RichUtils.toggleInlineStyle(editorState, "RED_LINE_STYLE")
			);
			return "handled";
		} else if (command === "underline") {
			setEditorState(
				RichUtils.toggleInlineStyle(editorState, "UNDERLINE_STYLE")
			);
			return "handled";
		}
		return "not-handled";
	};

	const keyBindingFn = (e) => {
		const contentState = editorState.getCurrentContent();
		const currentSelection = editorState.getSelection();
		const currentBlock = contentState.getBlockForKey(
			currentSelection.getStartKey()
		);
		const blockText = currentBlock.getText();

		if (e.key === "#") {
			// console.log("header");
			return "header";
		} else if (e.key === "*") {
			// console.log("bold");
			return "bold";
		} else if (e.key === "R") {
			// console.log("red");
			return "red";
		} else if (e.key === "_") {
			// console.log("underline");
			return "underline";
		}
		return getDefaultKeyBinding(e);
	};
	const handleReturn = (e) => {
		const currentState = editorState.getCurrentContent();
		const currentSelection = editorState.getSelection();
		const currentBlock = currentState.getBlockForKey(
			currentSelection.getStartKey()
		);
		const blockText = currentBlock.getText();

		if (blockText.startsWith("#") && blockText.trim().length === 1) {
			setEditorState(RichUtils.toggleBlockType(editorState, "header-one"));
			return "handled";
		}
		if (blockText.startsWith("R") && blockText.trim().length === 2) {
			setEditorState(
				RichUtils.toggleInlineStyle(editorState, "RED_LINE_STYLE")
			);
			return "handled";
		}

		return "not-handled";
	};
	const handleSave = () => {
		const contentState = editorState.getCurrentContent();
		localStorage.setItem(
			"editorContent",
			JSON.stringify(convertToRaw(contentState))
		);
	};
	return (
		<main className='align-element'>
			<div className='btn-block'>
				<div className='info-con'>
					<p className='info-text'>
						<span>"#"</span>: Heading one{" "}
					</p>
					<p className='info-text'>
						<span>"*"</span>: Bold{" "}
					</p>
				</div>
				<div className='info-con'>
					<p className='info-text'>
						<span>"R"</span>: Red{" "}
					</p>
					<p className='info-text'>
						<span>"_"</span>: Underline
					</p>
				</div>
				<Btn onClick={handleSave} label={"save"} />
			</div>
			<div className='container'>
				<Editor
					editorState={editorState}
					handleKeyCommand={handleKeyCommand}
					keyBindingFn={keyBindingFn}
					handleReturn={handleReturn}
					onChange={handleChange}
					customStyleMap={styleMap}
				/>
			</div>
		</main>
	);
};

export default DraftEditor;
