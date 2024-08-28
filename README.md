# react-pdf-annotator-component

`react-pdf-annotator-component` is a [React](https://reactjs.org/) library that provides a more flexible implementation of the sample app in [react-pdf-highlighter-extended](https://github.com/DanielArnould/react-pdf-highlighter-extended).

The idea for this project originated from the need to find an existing React PDF annotator to use in my react project. I found [react-pdf-highlighter-extended](https://github.com/DanielArnould/react-pdf-highlighter-extended) which provides the tools to build a highly customizable PDF annotator, but for my use case I only needed a basic implementation. After looking at the sample app included in the [react-pdf-highlighter-extended](https://github.com/DanielArnould/react-pdf-highlighter-extended) libary, I was satisfied with the included functionality and decided to refactor the app to be compatible with any PDF. I figured there were other developers who might find this basic out-of-the-box PDF annotator useful and decided to publish it for others to use.

The major difference between this implementation and the one provided by [react-pdf-highlighter-extended](https://github.com/DanielArnould/react-pdf-highlighter-extended) is that this version allows you to pass a reference to a function which gets called whenever the highlight data is modified. This makes it possible to store the highlight data externally rather than having to store it in the local test file. The other major difference is that this implementation allows you to dynamically pass any url/highlight-data into the annotator component, making it compatible with any PDF rather than the two hardcoded PDF's in the example app.

## Table of Contents

- [Example](#example)
- [Installation](#installation)
- [Usage](#usage)

## Example

To run the example app locally:

```
git clone https://github.com/NicholasGingrich/react-pdf-highlighter-extended/tree/main

npm install
npm run dev
```

## Installation

`npm install react-pdf-annotator-component --save`

## Usage

Here is the basic usage of the PDF annotator component. The component itself takes in three parameters:

1. The URL of the PDF you want to display
2. A reference to a function which will be called whenever the highlight data changes
3. Any exisitng highlight data to be rendered when the component is mounted

```
const SAMPLE_URL = "https://arxiv.org/pdf/2203.11115";
const TEST_HIGHLIGHTS = _testHighlights;

const updateHighlights: UpdateHighlights = (highlights, modfication) => {
  console.log(`Highlights for ${SAMPLE_URL} have been modfied.`);
  console.log(`Modification type: ${modfication?.type}`);
  console.log("Modfied highlight:", modfication?.highlight);
  console.log("The latest version of highlights from the annotator", highlights)
};

const App = () => {
  return (
    <PdfAnnotator
      url={SAMPLE_URL}
      updateHighlights={updateHighlights}
      savedHighlights={TEST_HIGHLIGHTS}
    ></PdfAnnotator>
  );
};
```

## Contribute

If you have a bug to report, please add it as an issue with clear steps to reproduce it.

If you have a feature request, please add it as an issue or make a pull request.
