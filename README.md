# React PDF Viewer

Easy React PDF Viewer for tablet/phone base on pdf-dist.js.

> \*Componnent computer browser base on iframe

### Install

```bash
npm i @ogs/react-pdf-viewer
```

### Importing

```js
import PDFViewer from "@ogs/react-pdf-viewer";
import "@ogs/react-pdf-viewer/dist/style.css";
```

### Usage

```html
<PDFViewer src="{file}" />
```

### Props

| Prop name | Description | Default |
| --------- | ----------- | ------- |
| src | imported using `import … from …` or from file input form element or an object with parameters (`"url"` - URL) | n/a |

###  Node version requirements
```bash
node: ">18.5.0"
```