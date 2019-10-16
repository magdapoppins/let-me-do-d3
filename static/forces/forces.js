d3.csv("/books.csv").then(bookData => {
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

  var width = 800,
    height = 600;

  xCenter = {
    "Forum 5": 100,
    "Ritari 5": 300,
    "Tutki ja tulkitse 1": 500,
    "Mennyt 1": 700
  };

  yCenterTheme = {
    "Tiedon konstruointi": 50,
    Voimaannuttaminen: 80,
    Moniäänisyys: 110
  };

  console.log(occurancesOfThemePerBook);

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

  const simulation = d3
    .forceSimulation(occurancesOfThemePerBook)
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force(
      "x",
      d3.forceX().x(d => {
        return xCenter[d.Book];
      })
    )
    .force(
      "y",
      d3.forceY().y(d => {
        return width / 2;
      })
    )
    .force("collision", d3.forceCollide().radius(d => d.OccurancesCount * 2))
    .on("tick", ticked);

  function ticked() {
    let themeNodes = d3
      .select("svg")
      .selectAll("circle")
      .data(occurancesOfThemePerBook);

    let bookNames = d3
      .select("svg")
      .selectAll("g")
      .data(distinctBooks);

    let themesAndColors = d3
      .select("svg")
      .selectAll("rect")
      .data(occurancesOfThemePerBook);

    themesAndColors
      .enter()
      .append("rect")
      .attr("x", 20)
      .attr("y", d => height - yCenterTheme[d.Theme])
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", d => getColorOfTheme(d.Theme));

    themesAndColors
      .enter()
      .append("text")
      .attr("x", 40)
      .attr("y", d => height - yCenterTheme[d.Theme] + 13)
      .text(d => "Theme: " + d.Theme);

    bookNames
      .enter()
      .append("text")
      .style("font-family", "Comic Sans MS")
      .attr("x", d => xCenter[d] - d.length * 4)
      .attr("y", 160)
      .attr("font-size", "20px")
      .text(d => d);

    themeNodes
      .enter()
      .append("circle")
      .merge(themeNodes)
      .attr("fill", d => getColorOfTheme(d.Theme))
      .attr("cx", function(d) {
        // console.log("cx: ", d.x)
        return d.x;
      })
      .attr("cy", function(d) {
        return d.y;
      })
      .attr("r", 10)
      .transition()
      .duration(750)
      .attr("r", d => d.OccurancesCount * 2);

    themeNodes
      .append("svg:title")
      .text(d => "Theme: " + d.Theme + " Book: " + d.Book);

    themeNodes.exit().remove();
    bookNames.exit().remove();
  }
});
