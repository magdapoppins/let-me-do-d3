import {
  select,
  forceSimulation,
  forceCollide,
  forceManyBody,
  forceCenter,
  forceX,
  forceY
} from "d3";
import { bookData } from "./data";

const pageHeight = 500,
  pageWidth = 800;

const themeOccurancesInSample = (sample, column, value) =>
  sample.map(data => data[column]).filter(column => column === value).length;

const getThemeOccurancesByBook = (bookData, uniqueBooks, uniqueThemes) =>
  uniqueBooks.reduce((acc, book) => {
    const dataByBook = bookData.filter(bd => bd["Oppikirja"] === book);

    const occurancesByBook = uniqueThemes.map(theme => ({
      Book: book,
      Theme: theme,
      OccurancesCount: themeOccurancesInSample(dataByBook, "Teema", theme)
    }));

    return [...acc, ...occurancesByBook];
  }, []);

const xCenter = {
  "Forum 5": 100,
  "Ritari 5": 300,
  "Tutki ja tulkitse 1": 500,
  "Mennyt 1": 700
};

const yCenterTheme = {
  "Tiedon konstruointi": 50,
  Voimaannuttaminen: 80,
  Moniäänisyys: 110
};

const themeColors = {
  Moniäänisyys: "orange",
  Voimaannuttaminen: "hotpink",
  "Tiedon konstruointi": "cyan"
};

const ticked = occurancesOfThemePerBook => {
  const themeNodes = select("svg")
    .selectAll("circle")
    .data(occurancesOfThemePerBook);

  const themesAndColors = select("svg")
    .selectAll("rect")
    .data(occurancesOfThemePerBook);

  themesAndColors
    .enter()
    .append("rect")
    .attr("x", 20)
    .attr("y", data => pageHeight - yCenterTheme[data.Theme])
    .attr("width", 15)
    .attr("height", 15)
    .attr("stroke", "black")
    .attr("stroke-width", 2)
    .attr("fill", data => themeColors[data.Theme]);

  themesAndColors
    .enter()
    .append("text")
    .attr("x", 40)
    .attr("y", data => pageHeight - yCenterTheme[data.Theme] + 13)
    .text(data => "Theme: " + data.Theme);

  themeNodes
    .enter()
    .append("circle")
    .merge(themeNodes)
    .attr("fill", data => themeColors[data.Theme])
    .attr("cx", data => data.x)
    .attr("cy", data => data.y)
    .attr("r", 10)
    .attr("stroke", "black")
    .attr("stroke-width", 3)
    .transition()
    .duration(100)
    .attr("r", data => data.OccurancesCount * 2);

  themeNodes
    .append("svg:title")
    .text(data => "Theme: " + data.Theme + " Book: " + data.Book);

  themeNodes.exit().remove();
};

const uniqueBooks = [...new Set(bookData.map(data => data["Oppikirja"]))];
const uniqueThemes = [...new Set(bookData.map(data => data["Teema"]))];

const occurancesOfThemePerBook = getThemeOccurancesByBook(
  bookData,
  uniqueBooks,
  uniqueThemes
);

forceSimulation(occurancesOfThemePerBook)
  .force("charge", forceManyBody())
  .force("center", forceCenter(pageWidth / 2, pageHeight / 2))
  .force("x", forceX().x(data => xCenter[data.Book]))
  .force("y", forceY().y(() => pageWidth / 2))
  .force("collision", forceCollide().radius(data => data.OccurancesCount * 2))
  .on("tick", () => ticked(occurancesOfThemePerBook));
