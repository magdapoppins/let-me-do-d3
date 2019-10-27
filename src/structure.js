import {
  select,
  forceSimulation,
  forceManyBody,
  forceCenter,
  forceLink
} from "d3";

const width = 900,
  height = 500;

const themes = [
  { name: "Monikulttuuriset sisällöt n=200" },
  { name: "Tiedon konstruointi n=108" },
  { name: "Moniperspektiivisyys n=44" },
  { name: "Voimaannuttaminen n=48" },
  { name: "Oppilaan oman historian tutkiminen n=4" },
  { name: "Erilaiset tulkinnat n=11" },
  { name: "Alkuperäiskansojen historia n=1" },
  { name: "Mahdin tai saavutusten kuvailu n=21" },
  { name: "Moniperspektiivisyys lähteissä n=7" },
  { name: "Kirjan metateksti n=3" },
  { name: "Mitä historia on n=14" },
  { name: "Oppilaan oma tulkinta n=11" },
  { name: "Tarinat kerronnan muotona n=37" },
  { name: "Vaikutus nykyaikaan n=26" },
  { name: "Lähteet n=65" }
];

const links = [
  { source: 0, target: 1 },
  { source: 0, target: 2 },
  { source: 0, target: 3 },
  { source: 1, target: 5 },
  { source: 1, target: 4 },
  { source: 1, target: 9 },
  { source: 1, target: 10 },
  { source: 1, target: 11 },
  { source: 1, target: 14 },
  { source: 3, target: 7 },
  { source: 3, target: 6 },
  { source: 3, target: 13 },
  { source: 2, target: 8 },
  { source: 2, target: 12 }
];

const ticked = () => {
  updateLinks();
  updateNodes();
  updateThemesAndColors();
};

const themeColors = {
  "Monikulttuuriset sisällöt n=200": "limegreen",
  "Moniperspektiivisyys n=44": "orange",
  "Voimaannuttaminen n=48": "hotpink",
  "Tiedon konstruointi n=108": "cyan"
};

const updateThemesAndColors = () => {
  let themesAndColors = select("svg")
    .selectAll("rect")
    .data(Object.keys(themeColors));

  themesAndColors
    .enter()
    .append("rect")
    .attr("x", 20)
    .attr("y", (data, index) => height - (index + 1) * 30)
    .attr("width", 15)
    .attr("height", 15)
    .attr("stroke", "black")
    .attr("stroke-width", 2)
    .attr("fill", data => themeColors[data]);

  themesAndColors
    .enter()
    .append("text")
    .attr("x", 40)
    .attr("y", (data, index) => height - (index + 1) * 30 + 15)
    .text(data => data);

  themesAndColors.exit().remove();
};

const updateNodes = () => {
  const themeNodes = select(".nodes")
    .selectAll("circle")
    .data(themes);

  themeNodes
    .enter()
    .append("circle")
    .merge(themeNodes)
    .attr("cx", data => data.x)
    .attr("cy", data => data.y)
    .style("stroke", "black")
    .style("fill", data => themeColors[data.name])
    .style("stroke-width", 3)
    .attr("r", data => {
      if (Object.keys(themeColors).includes(data.name)) {
        return 20;
      }
      return 5;
    })
    .append("title")
    .text(data => data.name);

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
    .attr("stroke", "black")
    .attr("x1", data => data.source.x)
    .attr("y1", data => data.source.y)
    .attr("x2", data => data.target.x)
    .attr("y2", data => data.target.y);

  themeLinks.exit().remove();
};

forceSimulation(themes)
  .force("charge", forceManyBody().strength(-500))
  .force("center", forceCenter(width / 2, height / 2))
  .force("link", forceLink().links(links))
  .on("tick", ticked);
