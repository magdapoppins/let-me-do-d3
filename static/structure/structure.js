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
  const themeNodes = d3
    .select(".nodes")
    .selectAll("text")
    .data(themes);

  themeNodes
    .enter()
    .append("text")
    .text(function(d) {
      return d.name;
    })
    .merge(themeNodes)
    .attr("x", function(d) {
      return d.x;
    })
    .attr("y", function(d) {
      return d.y;
    })
    .attr("dy", function(d) {
      return 5;
    });

  themeNodes.exit().remove();
};

const updateLinks = () => {
  themeLinks = d3
    .select(".links")
    .selectAll("line")
    .data(links);

  themeLinks
    .enter()
    .append("line")
    .merge(themeLinks)
    .attr("stroke", "hotpink")
    .attr("x1", function(d) {
      return d.source.x;
    })
    .attr("y1", function(d) {
      return d.source.y;
    })
    .attr("x2", function(d) {
      return d.target.x;
    })
    .attr("y2", function(d) {
      return d.target.y;
    });

  themeLinks.exit().remove();
};

d3.csv("/books.csv").then(bookData => {
  d3.forceSimulation(themes)
    .force("charge", d3.forceManyBody().strength(-800))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("link", d3.forceLink().links(links))
    .on("tick", ticked);
});
