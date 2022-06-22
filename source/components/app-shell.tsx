import React from "react";
import serialize from "serialize-javascript";

export type AppShell = {
  componentName: string;
  css: string[];
  js: string[];
  props: Record<string, unknown>;
  title: string;
};

export const AppShell: React.FC<React.PropsWithChildren<AppShell>> = ({
  children,
  componentName,
  css,
  js,
  props,
  title,
}) => (
  <html className="app-shell">
    <head>
      <meta charSet="utf-8" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, shrink-to-fit=no"
      />
      <title>{title}</title>
      {css.map((file) => (
        <link href={file} key={file} rel="stylesheet" />
      ))}
    </head>
    <body className="app-shell__body">
      <div data-mount={componentName}>{children}</div>
      <script
        dangerouslySetInnerHTML={{
          __html: `window.__INITIAL_PROPS__ = '${serialize(props, {
            isJSON: true,
          })}';`,
        }}
      />
      {js.map((file) => (
        <script src={file} key={file} />
      ))}
    </body>
  </html>
);
