// Configuration
const property = {
  bg: "background-color",
  text: "color",
  gradient: {
    property: "backgroundImage",
    value: "linear-gradient(to right, purple, {value})"
  }
};

const values = {
  primary: "#ccf654",
  rex: "#0000ff"
  // Add more values as needed
};

// Utility functions
function toCamelCase(str) {
  return str.replace(/-([a-z])/g, g => g[1].toUpperCase());
}

function toKebabCase(str) {
  return str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
}

// Class creation and parsing
function createClass(input) {
  const output = {};
  for (const [className, properties] of Object.entries(input)) {
    for (const [prop, value] of Object.entries(properties)) {
      if (!output[prop]) output[prop] = {};
      output[prop][className] = value;
    }
  }
  return output;
}

const classes = createClass({
  "se-flex": {
    display: "flex",
    alignItems: "center"
  },
  "b-tenox": {
    background: "red",
    color: "blue"
  }
});

function getParentClass(className) {
  const classObject = classes;
  const matchingProperties = [];
  for (const cssProperty in classObject) {
    if (classObject[cssProperty].hasOwnProperty(className)) {
      matchingProperties.push(cssProperty);
    }
  }
  return matchingProperties;
}

function matchClass(className) {
  const regex =
    /(?:([a-zA-Z0-9-]+):)?(-?[a-zA-Z0-9_]+(?:-[a-zA-Z0-9_]+)*|\[--[a-zA-Z0-9_-]+\])-(-?(?:\d+(\.\d+)?)|(?:[a-zA-Z0-9_]+(?:-[a-zA-Z0-9_]+)*(?:-[a-zA-Z0-9_]+)*)|(?:#[0-9a-fA-F]+)|(?:\[[^\]]+\])|(?:\$[^\s]+))([a-zA-Z%]*)/;
  const match = className.match(regex);
  return match ? match.slice(1) : null;
}

function parseClass(className) {
  const [prefix, type] = className.split(":");
  const getType = type || prefix;
  const getPrefix = type ? prefix : undefined;

  // First, check for custom classes
  const propKeys = getParentClass(getType);
  if (propKeys.length > 0) {
    const cssProperties = propKeys
      .map(propKey => {
        const value = classes[propKey][getType];
        return `${toKebabCase(propKey)}: ${value}`;
      })
      .join("; ");
    return getPrefix
      ? `.${getPrefix}\\:${getType}:${getPrefix} { ${cssProperties} }`
      : `.${getType} { ${cssProperties} }`;
  }

  // If not a custom class, proceed with regex matching
  const matcher = matchClass(className);
  if (!matcher) return null;

  let [parsedPrefix, parsedType, parsedValue, , unit] = matcher;
  const properties = property[parsedType];
  const customValues = values[parsedValue];
  const finalValue = customValues || parsedValue + (unit || "");

  if (typeof properties === "object" && properties !== null && "value" in properties && "property" in properties) {
    const value = properties.value.replace(/{value}/g, finalValue);
    return parsedPrefix
      ? `.${parsedPrefix}\\:${parsedType}-${parsedValue}:${parsedPrefix} { ${toKebabCase(
          properties.property
        )}: ${value} }`
      : `.${parsedType}-${parsedValue} { ${toKebabCase(properties.property)}: ${value} }`;
  } else if (typeof properties === "string") {
    return parsedPrefix
      ? `.${parsedPrefix}\\:${parsedType}-${parsedValue}:${parsedPrefix} { ${properties}: ${finalValue} }`
      : `.${parsedType}-${parsedValue} { ${properties}: ${finalValue} }`;
  }

  return null;
}

// Usage examples
console.log(parseClass("hover:se-flex"));
console.log(parseClass("b-tenox"));
console.log(parseClass("gradient-rex"));
console.log(parseClass("hover:gradient-primary"));
console.log(parseClass("bg-blue"));
console.log(parseClass("text-red"));
