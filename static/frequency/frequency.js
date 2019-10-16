d3.csv("/books.csv").then(bookData => {
  let canvasHeight = 500;
  let canvasWidth = 1000;

  // Get out the stuff that interests us in the data
  let books = bookData.map(d => d["Oppikirja"]);
  distinctBooks = [...new Set(books)];

  let themes = bookData.map(d => d["Teema"]);
  distinctThemes = [...new Set(themes)];

  let subThemes = bookData.map(d => d["Alateema"]);
  distinctSubThemes = [...new Set(subThemes)];

  function themeOccurancesInSample(sample, column, value) {
    let columnValues = sample.map(d => d[column]);
    let onlyWantedValues = columnValues.filter(d => d == value);
    return onlyWantedValues.length;
  }

  let occurancesOfThemePerBook = [];
  distinctBooks.forEach(b => {
    distinctThemes.forEach(t => {
      let dataOfThisBook = bookData.filter(bd => {
        return bd["Oppikirja"] == b;
      });

      occurancesOfThemePerBook.push({
        Book: b,
        Theme: t,
        OccurancesCount: themeOccurancesInSample(dataOfThisBook, "Teema", t)
      });
    });
  });

  console.log("Occurances of theme per book", occurancesOfThemePerBook);

  let canvas = d3.select("#canvas");
  canvas.style("border", "3px solid black");
  canvas.style("background-color", "hotpink");

  let svg = canvas
    .append("svg")
    .attr("width", canvasWidth)
    .attr("height", canvasHeight);

  let bars = svg
    .selectAll("rect")
    .data(occurancesOfThemePerBook)
    .enter();

  function getColorOfTheme(theme) {
    if (theme == "Moniäänisyys") {
      return "orange";
    }
    if (theme == "Tiedon konstruointi") {
      return "cyan";
    }
    if (theme == "Voimaannuttaminen") {
      return "limegreen";
    }
  }

  bars
    .append("rect")
    .style("stroke", "black")
    .style("stroke-width", 3)
    .attr("x", 0)
    .attr("y", (d, i) => {
      let padding = Math.floor(i / 3) * 20;
      return i * 30 + padding + 10;
    })
    .attr("height", 20)
    .attr("fill", d => getColorOfTheme(d.Theme))
    .attr("width", 0)
    .transition()
    .duration(750)
    .attr("width", (d, i) => d.OccurancesCount * 20)
    .attr("class", "bar");

  bars
    .append("text")
    .style("font-family", "Comic Sans MS")
    .text(d => "n:" + d.OccurancesCount)
    .attr("y", (d, i) => {
      let padding = Math.floor(i / 3) * 20;
      return i * 30 + padding + 25;
    })
    .attr("x", 0)
    .transition()
    .duration(750)
    .attr("x", (d, i) => d.OccurancesCount * 20 + 20);

  bars
    .selectAll("rect")
    .append("title")
    .text(d => d.Book + " - " + d.Theme);
});
