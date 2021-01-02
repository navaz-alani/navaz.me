import styles from "./pattern.module.css";


let patterns = (() => {
  let m = new Map<string, string>();
  [
    "_base-dark",
    "_none-dark",
    "wavy-dark",
    "zigzag-dark",
    "zigzag3d-dark",
    "isometric-dark",
    "polka-dark",
    "rectangles-dark",
    "cross-dark",

    "_base-light",
    "_none-light",
    "wavy-light",
    "zigzag-light",
    "zigzag3d-light",
    "isometric-light",
    "polka-light",
    "rectangles-light",
    "cross-light",
  ].forEach((p: string) => {
    let s: string = styles[p];
    (s !== undefined) && m.set(p, s);
  });
  return m;
})();

export default patterns;
