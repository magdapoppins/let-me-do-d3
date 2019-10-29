import {
  select,
  forceSimulation,
  forceManyBody,
  forceCenter,
  forceCollide,
  forceX,
  forceY
} from "d3";
import { bookData } from "./data";

const height = 500,
  width = 900;

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

const colorMP = [74, 74, 247];
const colorVO = [0, 0, 0];
const colorTK = [255, 255, 255];

const themeColors = {
  Moniäänisyys: `rgb(${colorMP[0]}, ${colorMP[1]}, ${colorMP[2]})`,
  Voimaannuttaminen: `rgb(${colorVO[0]}, ${colorVO[1]}, ${colorVO[2]})`,
  "Tiedon konstruointi": `rgb(${colorTK[0]}, ${colorTK[1]}, ${colorTK[2]})`
};

const getPercentageOfThemeInAllInstances = (
  themeName,
  allInstanceCount,
  occurancesInCurrentBook
) => {
  const themeData = occurancesInCurrentBook.filter(
    data => data.Theme == themeName
  );
  return themeData[0].OccurancesCount / allInstanceCount;
};

const getColorForBook = (bookName, occurancesOfThemePerBook) => {
  const occurancesInCurrentBook = occurancesOfThemePerBook.filter(
    bookData => bookData.Book == bookName
  );

  let totalInstancesOfThemes = occurancesInCurrentBook.map(
    occurance => occurance.OccurancesCount
  );

  totalInstancesOfThemes = totalInstancesOfThemes.reduce(
    (acc, instances) => acc + instances,
    0
  );

  // In this specific book, what % is each theme of all themes?
  const percentageOfMP = getPercentageOfThemeInAllInstances(
    "Moniäänisyys",
    totalInstancesOfThemes,
    occurancesInCurrentBook
  );
  const percentageOfTK = getPercentageOfThemeInAllInstances(
    "Tiedon konstruointi",
    totalInstancesOfThemes,
    occurancesInCurrentBook
  );
  const percentageOfVO = getPercentageOfThemeInAllInstances(
    "Voimaannuttaminen",
    totalInstancesOfThemes,
    occurancesInCurrentBook
  );

  const rValue =
    percentageOfVO * colorVO[0] +
    percentageOfTK * colorTK[0] +
    percentageOfMP * colorMP[0];
  const gValue =
    percentageOfVO * colorVO[1] +
    percentageOfTK * colorTK[1] +
    percentageOfMP * colorMP[1];
  const bValue =
    percentageOfVO * colorVO[2] +
    percentageOfTK * colorTK[2] +
    percentageOfMP * colorMP[2];

  return "rgb(" + rValue + "," + gValue + "," + bValue + ")";
};

const ticked = (uniqueBooks, uniqueThemes, occurancesOfThemePerBook) => {
  let svg = select("svg");

  const books = svg.selectAll("circle").data(uniqueBooks);

  books
    .enter()
    .append("circle")
    .merge(books)
    .attr("cx", d => d.x)
    .attr("cy", d => d.y)
    .style("stroke", "black")
    .style("stroke-width", 3)
    .attr("fill", data => getColorForBook(data.name, occurancesOfThemePerBook))
    .attr("r", 70)
    .append("title")
    .text(data => data.name);

  books.exit().remove();

  let themesAndColors = select("svg")
    .selectAll("rect")
    .data(uniqueThemes);

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
    .text(data => "Theme: " + data);

  themesAndColors.exit().remove();
};

const uniqueBooks = [...new Set(bookData.map(data => data["Oppikirja"]))].map(
  bookName => ({ name: bookName })
);
const uniqueThemes = [...new Set(bookData.map(data => data["Teema"]))];

const occurancesOfThemePerBook = getThemeOccurancesByBook(
  bookData,
  uniqueBooks.map(book => book.name),
  uniqueThemes
);

forceSimulation(uniqueBooks)
  .force("charge", forceManyBody().strength(-600))
  .force("center", forceCenter(width / 2, height / 2))
  .force("collision", forceCollide().radius(84))
  .force("x", forceX().x(width / 2))
  .force("y", forceY().y(height / 2))
  .on("tick", () =>
    ticked(uniqueBooks, uniqueThemes, occurancesOfThemePerBook)
  );
