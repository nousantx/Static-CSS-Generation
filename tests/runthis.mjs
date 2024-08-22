import { GenerateCSS } from "../src/js/index.mjs";
import path from "node:path"

const config = {
  property: {
    bg: "background-color",
    text: "color",
    gradient: {
      property: "backgroundImage",
      value: "linear-gradient(to right, purple, {value})"
    },
    p: "padding",
    br: "borderRadius",
    "border-color": "--bdr-clr", // css output example : .border-color-{value} { --bdr-clr: {value}; }
    size: ["width", "height"], // css output example : .box-{value} { width: {value}; height: {value} }
    flex: {
      property: ["justifyContent", "alignItems"],
      value: "{value}"
    }
  },
  values: {
    primary: "#ccf654",
    rex: "#0000ff"
  },
  classes: {
    display: {
      "se-flex": "flex",
      "b-tenox": "block"
    },
    alignItems: {
      "se-flex": "center"
    }
  },
  input: [path.resolve(process.cwd(), "index.html")],
  output: path.resolve(process.cwd(), "dist/styles.css")
};

const generator = new GenerateCSS(config);
generator.generateFromFiles();
console.log(generator.matchClass("hover:bg-primary"));
console.log(generator.create("p-[calc(1rem\\_+\\_10px)]"));
