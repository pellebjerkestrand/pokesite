import React from "react";
import { renderToString } from "react-dom/server";

import { AppShell } from "../components/app-shell";
import { hydratorUrl, styleUrls } from "./client-manifest";

export enum RenderHtmlOutcome {
  Failure = "failure",
  Success = "success",
}

export const renderHtml = <T extends Record<string, unknown>>(
  component: React.FC<T>,
  title: string,
  props: T
):
  | { outcome: RenderHtmlOutcome.Failure }
  | { outcome: RenderHtmlOutcome.Success; value: string } => {
  let html: string | undefined;

  try {
    html = `<!doctype html>${renderToString(
      React.createElement(
        AppShell,
        {
          componentName: component.name,
          css: styleUrls,
          js: [hydratorUrl],
          props,
          title,
        },
        React.createElement(component, props)
      )
    )}`;
  } catch {
    // NOTE: We should probably return some nice error page HTML
    return { outcome: RenderHtmlOutcome.Failure };
  }

  return { outcome: RenderHtmlOutcome.Success, value: html };
};
