import React from "react";

import { Title } from "../../components/title";

type Home = { list: string[]; title: string };

export const Home: React.FC<Home> = ({ list, title }) => (
  <main className="home">
    <Title text={title} />
    {list.length ? (
      <div>
        {list.map((item) => (
          <div key={item}>{item}</div>
        ))}
      </div>
    ) : null}
  </main>
);
