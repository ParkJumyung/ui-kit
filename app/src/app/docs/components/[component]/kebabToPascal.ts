const kebabToCamel = (str: string) =>
  str.replace(/\s*-\s*\w/g, (parts) => parts[parts.length - 1].toUpperCase());
const kebabToPascal = (str: string) =>
  kebabToCamel(str).replace(/^\w/, (s) => s.toUpperCase());

export default kebabToPascal;
