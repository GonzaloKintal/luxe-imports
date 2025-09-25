export default function getEmptyLexicalState() {
  return JSON.stringify({
    root: {
      children: [
        {
          type: "paragraph",
          children: [],
          direction: "ltr",
          format: "",
          indent: 0,
          version: 1
        }
      ],
      direction: "ltr",
      format: "",
      indent: 0,
      type: "root",
      version: 1
    }
  });
}
