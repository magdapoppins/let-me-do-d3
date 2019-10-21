import { bookData } from "./data";

const height = 600,
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
  let svg = d3.select("svg");

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
    .transition()
    .delay(2)
    .attr("r", 80);

  books.exit().remove();

  // TODO FIX THIS
  let bookNames = svg.selectAll("text").data(uniqueBooks);

  bookNames
    .enter()
    .append("text")
    .merge(bookNames)
    .attr("x", d => d.x - (5 + d.name.length * 3))
    .attr("y", d => d.y)
    .text(d => d.name);

  let themesAndColors = d3
    .select("svg")
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

d3.forceSimulation(uniqueBooks)
  .force("charge", d3.forceManyBody())
  .force("center", d3.forceCenter(width / 2, height / 2))
  .force("collision", d3.forceCollide().radius(80))
  .force("x", d3.forceX().x(height / 2))
  .force("y", d3.forceY().y(width / 2))
  .on("tick", () =>
    ticked(uniqueBooks, uniqueThemes, occurancesOfThemePerBook)
  );
