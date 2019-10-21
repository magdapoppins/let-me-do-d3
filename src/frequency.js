import { bookData } from "./data";

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

const themeOccurancesInSample = (sample, column, value) =>
  sample.map(data => data[column]).filter(column => column === value).length;

const themeColors = {
  Moniäänisyys: "orange",
  Voimaannuttaminen: "hotpink",
  "Tiedon konstruointi": "cyan"
};

const getYValue = (index, leftMargin) => {
  const themeCount = Object.keys(themeColors).length;
  const padding = Math.floor(index / themeCount) * 40;
  return index * 30 + padding + leftMargin;
};

const uniqueBooks = [...new Set(bookData.map(d => d["Oppikirja"]))];
const uniqueThemes = [...new Set(bookData.map(d => d["Teema"]))];

const occurancesOfThemePerBook = getThemeOccurancesByBook(
  bookData,
  uniqueBooks,
  uniqueThemes
);

const canvas = d3.select("svg");

const bars = canvas
  .selectAll("rect")
  .data(occurancesOfThemePerBook)
  .enter();

bars
  .append("rect")
  .style("stroke", "black")
  .style("stroke-width", 3)
  .attr("x", 0)
  .attr("y", (data, index) => getYValue(index, 10))
  .attr("height", 20)
  .attr("fill", data => themeColors[data.Theme])
  .attr("width", 0)
  .transition()
  .duration(750)
  .attr("width", data => data.OccurancesCount * 20)
  .attr("class", "bar");

bars
  .append("text")
  .style("font-family", "Comic Sans MS")
  .text(data => "n:" + data.OccurancesCount)
  .attr("y", (data, index) => getYValue(index, 25))
  .attr("x", 0)
  .transition()
  .duration(750)
  .attr("x", data => data.OccurancesCount * 20 + 20);

bars
  .selectAll("rect")
  .append("title")
  .text(data => `${data.Book} - ${data.Theme}`);
