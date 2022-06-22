import React from "react";

import { Title } from "../../components/title";

type Home = { title: string };

export const Home: React.FC<Home> = ({ title }) => (
  <main className="home">
    <Title text={title} />
  </main>
);
