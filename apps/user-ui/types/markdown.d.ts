declare module "*.md" {
  // Assuming the imported content is the raw markdown string
  const content: string;
  export default content;

  // If you were using an MDX loader that returns a React component,
  // you might use:
  // import { ComponentType } from "react";
  // const Component: ComponentType;
  // export default Component;
}
declare module "*.mdx" {
  let MDXComponent: (props: any) => JSX.Element;
  export default MDXComponent;
}
