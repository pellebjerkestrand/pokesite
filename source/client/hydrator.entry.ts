import { createElement, FC } from "react";
import { hydrateRoot } from "react-dom/client";

// NOTE: This is ignored because support for globbed import syntax
// is provided py a plugin and is not valid TypeScript.
//@ts-ignore
import pageComponentsProxy from "../slices/*/*.page.tsx";
const pageComponents = pageComponentsProxy as Record<string, FC>[];

declare global {
  interface Window {
    // NOTE: Parsing this string is nice for performance.
    // https://twitter.com/mathias/status/1143551692732030979
    __INITIAL_PROPS__: string | undefined;
  }
}

const mountPointAttribute = "data-mount";
const components = Object.fromEntries(
  pageComponents.map((pageComponent) => {
    // NOTE: This works because page components are named exports,
    // and the only named export in their module.
    const name = Object.getOwnPropertyNames(pageComponent)[0];
    if (!name) {
      console.error("No name");
      return [];
    }

    const component = pageComponent[name];
    if (!component) {
      console.error("No component");
      return [];
    }

    return [name, component];
  })
);

const hydrate = () => {
  const mountPoint = document.querySelector(`[${mountPointAttribute}]`);
  if (!mountPoint) {
    console.error("No mount point");
    return;
  }

  const componentName = mountPoint.getAttribute(mountPointAttribute);
  if (!componentName) {
    console.error("No component name");
    return;
  }

  const component = components[componentName];
  if (typeof component !== "function") {
    console.error("Component is not a function");
    return;
  }

  hydrateRoot(
    mountPoint,
    createElement(
      component,
      window.__INITIAL_PROPS__
        ? JSON.parse(window.__INITIAL_PROPS__)
        : undefined
    )
  );
  document.documentElement.setAttribute("data-hydrated", "");
};

hydrate();
