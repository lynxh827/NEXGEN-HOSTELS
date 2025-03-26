
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

// This tells TypeScript that @tailwind directives are valid in CSS files
declare namespace CSS {
  interface AtRule {
    tailwind: any;
    layer: any;
    apply: any;
  }
}
