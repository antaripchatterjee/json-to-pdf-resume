// breadcrumb-utils.js
import * as jsonc from "jsonc-parser";
import YAML from "yaml";
import * as tomlParser from "toml-eslint-parser";
import { parse as xmlParse } from "@xml-tools/parser";
import { buildAst } from "@xml-tools/ast";
import { findNodeAtOffset } from "@xml-tools/ast-position";

export function getJsonSiblings(node) {
  if (!node || !node.parent) return [];

  const parent = node.parent;
  if (parent.type === "object") {
    // Collect property names
    return parent.children.map(prop => ({
      label: prop.children[0].value,
      range: {
        start: prop.offset,
        end: prop.offset + prop.length
      }
    }));
  }

  if (parent.type === "array") {
    // Collect indices
    return parent.children.map((child, idx) => ({
      label: `[${idx}]`,
      range: {
        start: child.offset,
        end: child.offset + child.length
      }
    }));
  }

  return [];
}


// JSON
export function getJsonBreadcrumbPath(text, offset) {
  const root = jsonc.parseTree(text);
  if (!root) return [];

  const node = jsonc.findNodeAtOffset(root, offset);
  if (!node) return [];

  const path = [];
  let current = node;

  while (current && current.parent) {
    const parent = current.parent;

    if (parent.type === "property") {
      const key = parent.children[0].value;
      path.unshift({ label: key, node: parent });
    } else if (parent.type === "array") {
      const idx = parent.children.indexOf(current);
      path.unshift({ label: `[${idx}]`, node: parent });
    }

    current = parent;
  }

  return path;
}

// YAML
export function breadcrumbYaml(text, offset) {
  const doc = YAML.parseDocument(text, { keepCstNodes: true });
  if (!doc.contents?.cstNode) return [];
  const findPath = (node, trail = []) => {
    const range = node.cstNode.range;
    if (!range || offset < range[0] || offset > range[1]) return null;

    if (node.key && node.value) {
      const key = String(node.key.value);
      const right = findPath(node.value, [...trail, key]);
      if (right) return right;
      if (node.key.cstNode?.range?.includes(offset)) return [...trail, key];
    }
    if (node.items) {
      for (let item of node.items) {
        const res = findPath(item, trail);
        if (res) return res;
      }
    }
    return trail;
  };
  return findPath(doc.contents, []) || [];
}

// TOML
export function breadcrumbToml(text, offset) {
  let ast;
  try {
    ast = tomlParser.parse(text, { range: true });
  } catch {
    return [];
  }
  const traverse = (node, trail = []) => {
    if (!node.range) return null;
    const [start, end] = node.range;
    if (offset < start || offset > end) return null;

    if (node.type === "TOMLKeyValue") {
      const res = traverse(node.value, [...trail, node.key.name]);
      return res || [...trail, node.key.name];
    }
    if (node.type === "TOMLTable") {
      return traverse(node.body, [...trail, node.key.name]);
    }
    if (node.type === "Program") {
      for (const n of node.body) {
        const res = traverse(n, trail);
        if (res) return res;
      }
    }
    return trail;
  };
  return traverse(ast, []) || [];
}

// XML
export function breadcrumbXml(text, offset) {
  const { cst, tokenVector } = xmlParse(text);
  const ast = buildAst(cst, tokenVector);
  const node = findNodeAtOffset(ast, offset);
  if (!node) return [];
  let path = [];
  let n = node;
  while (n) {
    if (n.name) path.unshift(n.name);
    n = n.parent;
  }
  return path;
}

// Unified
export default function findBreadcrumbPath(lang, text, offset) {
  switch (lang) {
    case "json":
    case "jsonc":
      return getJsonBreadcrumbPath(text, offset);
    case "yaml":
    case "yml":
      return breadcrumbYaml(text, offset);
    case "toml":
      return breadcrumbToml(text, offset);
    case "xml":
      return breadcrumbXml(text, offset);
    default:
      return [];
  }
}
