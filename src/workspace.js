const customValues = this.valueRegistry[parsedValue];
const properties = this.styleAttribute[type];
let finalValue = customValues || parsedValue;
if ((parsedValue + unit).length !== parsedValue.toString().length && unit !== "") {
  finalValue = parsedValue;
} else if (typeof properties === "object" && "value" in properties && !properties.parsedValue.includes("{value}")) {
  return properties.value;
} else if (finalValue.startsWith("$")) {
  return `var(--${finalValue.slice(1)})`;
} else if (finalValue.startsWith("[") && finalValue.endsWith("]")) {
  const solidValue = finalValue.slice(1, -1).replace(/\\_/g, " ");
  return solidValue.startsWith("--") ? `var(${solidValue})` : solidValue;
}
const typeRegistry = this.valueRegistry[type];
if (typeof typeRegistry === "object") {
  finalValue = typeRegistry[parsedValue] || finalValue;
}
