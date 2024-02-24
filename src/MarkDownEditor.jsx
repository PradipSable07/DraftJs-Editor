// MarkdownEditor.js

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
import "draft-js/dist/Draft.css";

const MarkDownEditor = () => {
	const [editorState, setEditorState] = useState(() => {
		const savedContent = localStorage.getItem("editorContent");
		if (savedContent) {
			const contentState = convertFromRaw(JSON.parse(savedContent));
			return EditorState.createWithContent(contentState);
		}
		return EditorState.createEmpty();
	});

	useEffect(() => {
		const contentState = editorState.getCurrentContent();
		localStorage.setItem(
			"editorContent",
			JSON.stringify(convertToRaw(contentState))
		);
	}, [editorState]);

	const handleChange = (newEditorState) => {
		setEditorState(newEditorState);
	};

	const handleKeyCommand = (command, editorState) => {
		if (command === "header") {
			setEditorState(RichUtils.toggleBlockType(editorState, "header-one"));
			return "handled";
		}
		return "not-handled";
	};

	const keyBindingFn = (e) => {
		if (e.key === "#" && e.getModifierState("Shift")) {
			return "header";
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

		if (blockText.startsWith("# ") && blockText.trim().length === 2) {
			setEditorState(RichUtils.toggleBlockType(editorState, "header-one"));
			return "handled";
		}

		return "not-handled";
	};

	const handleBeforeInput = (chars, editorState) => {
		const currentContent = editorState.getCurrentContent();
		const selection = editorState.getSelection();
		const currentBlock = currentContent.getBlockForKey(selection.getStartKey());
		const blockText = currentBlock.getText();

		// Check if the typed characters are '#' or '*' and at the beginning of a line
		if (
			(chars === " " && blockText.trim().startsWith("#")) ||
			(chars === " " && blockText.trim().startsWith("*")) ||
			(chars === " " && blockText.trim().startsWith("**")) ||
			(chars === " " && blockText.trim().startsWith("***"))
		) {
			let newContent = currentContent;

			// Remove the '#' or '*' characters from the beginning of the line
			if (blockText.trim().startsWith("#")) {
				newContent = Modifier.replaceText(
					currentContent,
					new SelectionState({
						anchorKey: currentBlock.getKey(),
						anchorOffset: 0,
						focusKey: currentBlock.getKey(),
						focusOffset: blockText.indexOf("#") + 2,
					}),
					""
				);
			} else if (blockText.trim().startsWith("*")) {
				newContent = Modifier.replaceText(
					currentContent,
					new SelectionState({
						anchorKey: currentBlock.getKey(),
						anchorOffset: 0,
						focusKey: currentBlock.getKey(),
						focusOffset: blockText.indexOf("*") + 2,
					}),
					""
				);
			} else if (blockText.trim().startsWith("**")) {
				newContent = Modifier.replaceText(
					currentContent,
					new SelectionState({
						anchorKey: currentBlock.getKey(),
						anchorOffset: 0,
						focusKey: currentBlock.getKey(),
						focusOffset: blockText.indexOf("**") + 3,
					}),
					""
				);
			} else if (blockText.trim().startsWith("***")) {
				newContent = Modifier.replaceText(
					currentContent,
					new SelectionState({
						anchorKey: currentBlock.getKey(),
						anchorOffset: 0,
						focusKey: currentBlock.getKey(),
						focusOffset: blockText.indexOf("***") + 4,
					}),
					""
				);
			}

			const newEditorState = EditorState.push(
				editorState,
				newContent,
				"remove-range"
			);

			// Apply bold format to the subsequent text on the same line
			const boldEditorState = RichUtils.toggleInlineStyle(
				newEditorState,
				"BOLD"
			);

			// Apply red line style to the subsequent text on the same line
			// Apply inline style based on the typed characters
			let nextEditorState = newEditorState;
			if (chars === " " && blockText.trim().startsWith("**")) {
				nextEditorState = RichUtils.toggleInlineStyle(
					newEditorState,
					"RED_LINE_STYLE"
				);
			} else if (chars === " " && blockText.trim().startsWith("***")) {
				nextEditorState = RichUtils.toggleInlineStyle(
					newEditorState,
					"UNDERLINE_STYLE"
				);
			}

			setEditorState(nextEditorState);

			setEditorState(boldEditorState);

			return "handled"; // Indicate that the input has been handled
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
		<div>
			<div className='container'>
				<Editor
					editorState={editorState}
					onChange={handleChange}
					handleKeyCommand={handleKeyCommand}
					keyBindingFn={keyBindingFn}
					handleReturn={handleReturn}
					handleBeforeInput={handleBeforeInput}
				/>
			</div>
			<button onClick={handleSave}>Save</button>
		</div>
	);
};

export default MarkDownEditor;
