import {
  select,
  forceSimulation,
  forceManyBody,
  forceCenter,
  forceLink
} from "d3";

const width = 900,
  height = 800;

const themes = [
  { name: "Monikulttuuriset sisällöt" },
  { name: "Tiedon konstruointi" },
  { name: "Moniäänisyys" },
  { name: "Voimaannuttaminen" },
  { name: "Oman historian tutkiminen" },
  { name: "Erilaiset tulkinnat" },
  { name: "Alkuperäiskansojen historia" },
  { name: "Mahti" }
];

const links = [
  { source: 0, target: 1 },
  { source: 0, target: 2 },
  { source: 0, target: 3 },
  { source: 1, target: 5 },
  { source: 1, target: 4 },
  { source: 3, target: 7 },
  { source: 3, target: 6 }
];

const ticked = () => {
  updateLinks();
  updateNodes();
};

const updateNodes = () => {
  const themeNodes = select(".nodes")
    .selectAll("text")
    .data(themes);

  themeNodes
    .enter()
    .append("text")
    .text(data => data.name)
    .merge(themeNodes)
    .attr("x", data => data.x)
    .attr("y", data => data.y)
    .attr("dy", 5);

  themeNodes.exit().remove();
};

const updateLinks = () => {
  const themeLinks = select(".links")
    .selectAll("line")
    .data(links);

  themeLinks
    .enter()
    .append("line")
    .merge(themeLinks)
    .attr("stroke", "hotpink")
    .attr("x1", data => data.source.x)
    .attr("y1", data => data.source.y)
    .attr("x2", data => data.target.x)
    .attr("y2", data => data.target.y);

  themeLinks.exit().remove();
};

forceSimulation(themes)
  .force("charge", forceManyBody().strength(-800))
  .force("center", forceCenter(width / 2, height / 2))
  .force("link", forceLink().links(links))
  .on("tick", ticked);
