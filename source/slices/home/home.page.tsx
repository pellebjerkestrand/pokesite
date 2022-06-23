import React from "react";

import { Title } from "../../components/title";

import type { HomeProps } from "./home-props";

export const Home: React.FC<HomeProps> = ({ list, title }) => (
  <main className="home">
    <Title text={title} />
    {list.length ? (
      <ul>
        {list.map((item) => (
          <li key={item}>
            <a href={`/${item}`}>{item}</a>
          </li>
        ))}
      </ul>
    ) : null}
  </main>
);
