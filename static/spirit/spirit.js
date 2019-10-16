d3.csv("/books.csv").then(bookData => {
  const bookNames = bookData.map(d => d["Oppikirja"]);
  const distinctBooks = [...new Set(bookNames)].map(bookName => ({
    name: bookName
  }));
  const distinctThemes = [...new Set(bookData.map(d => d["Teema"]))];

  // OCCURANCES OF VALUES (themes) IN COLUMN (theme or subtheme)
  function themeOccurancesInSample(sample, column, value) {
    let columnValues = sample.map(d => d[column]);
    let onlyWantedValues = columnValues.filter(d => d == value);
    return onlyWantedValues.length;
  }

  let occurancesOfThemePerBook = [];
  distinctBooks.forEach(distinctBook => {
    distinctThemes.forEach(distinctTheme => {
      let dataOfThisBook = bookData.filter(bookDataRow => {
        return bookDataRow["Oppikirja"] == distinctBook.name;
      });

      occurancesOfThemePerBook.push({
        Book: distinctBook.name,
        Theme: distinctTheme,
        OccurancesCount: themeOccurancesInSample(
          dataOfThisBook,
          "Teema",
          distinctTheme
        )
      });
    });
  });

  let svg = d3.select("svg");
  let height = 600;
  let width = 900;

  var simulation = d3
    .forceSimulation(distinctBooks)
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force(
      "collision",
      d3.forceCollide().radius(d => {
        return getThemeOccuranceCountForBook(d.name);
      })
    )
    .force(
      "x",
      d3.forceX().x(d => {
        return height / 2;
      })
    )
    .force(
      "y",
      d3.forceY().y(d => {
        return width / 2;
      })
    )
    .on("tick", ticked);

  function getColorOfTheme(theme) {
    if (theme == "Moniäänisyys") {
      return "rgb(255, 73, 255)";
    }
    if (theme == "Tiedon konstruointi") {
      return "rgb(255, 220, 15)";
    }
    if (theme == "Voimaannuttaminen") {
      return "rgb(23, 248, 27)";
    }
  }

  function getThemeOccuranceCountForBook(bookName) {
    let a = occurancesOfThemePerBook.filter(obd => {
      return obd.Book == bookName;
    });
    a = a.map(asd => asd.OccurancesCount);
    a = a.reduce((w, e) => w + e, 0);
    return a * 1.5;
  }

  function getColorForBook(bookName) {
    let occurancesInCurrentBook = occurancesOfThemePerBook.filter(bookData => {
      return bookData.Book == bookName;
    });

    let totalInstancesOfThemes = occurancesInCurrentBook.map(
      occurance => occurance.OccurancesCount
    );
    totalInstancesOfThemes = totalInstancesOfThemes.reduce((a, b) => a + b, 0);

    // Calculate % of each theme and then use it to blend the RGB by making that % of each color to r, g and b separately
    getPercentageOfThemeInAllInstances = (themeName, allInstanceCount) => {
      let themeData = occurancesInCurrentBook.filter(
        data => data.Theme == themeName
      );
      return themeData[0].OccurancesCount / allInstanceCount;
    };

    // In this specific book, what % is each theme of all themes?
    let percentageOfMP = getPercentageOfThemeInAllInstances(
      "Moniäänisyys",
      totalInstancesOfThemes
    );
    let percentageOfTK = getPercentageOfThemeInAllInstances(
      "Tiedon konstruointi",
      totalInstancesOfThemes
    );
    let percentageOfVO = getPercentageOfThemeInAllInstances(
      "Voimaannuttaminen",
      totalInstancesOfThemes
    );

    // Tiedon konstr		 Moniääni	         Voimaann
    // rgb(255, 220, 15)     rgb(255, 73, 255)   rgb(23, 248, 27)
    let rValue =
      percentageOfVO * 23 + percentageOfTK * 255 + percentageOfMP * 255;
    let gValue =
      percentageOfVO * 248 + percentageOfTK * 220 + percentageOfMP * 73;
    let bValue =
      percentageOfVO * 27 + percentageOfTK * 15 + percentageOfMP * 255;

    return "rgb(" + rValue + "," + gValue + "," + bValue + ")";
  }

  function ticked() {
    let books = svg.selectAll("circle").data(distinctBooks);

    books
      .enter()
      .append("circle")
      .merge(books)
      .attr("cx", function(d) {
        return d.x;
      })
      .attr("cy", function(d) {
        return d.y;
      })
      .style("stroke", "black")
      .style("stroke-width", 3)
      .attr("fill", d => getColorForBook(d.name))
      .transition()
      .delay(2)
      .attr("r", d => getThemeOccuranceCountForBook(d.name));

    // TODO FIX THIS
    // let bookNames = svg.selectAll("text")
    // 	.data(distinctBooks)

    // bookNames.enter().append("text")
    // 	.merge(bookNames)
    // 	.attr("x", (d) => d.x - (d.name.length*3))
    // 	.attr("y", (d) => d.y)
    // 	.text(d => d.name)

    let themesAndColors = d3
      .select("svg")
      .selectAll("rect")
      .data(distinctThemes);

    themesAndColors
      .enter()
      .append("rect")
      .attr("x", 20)
      .attr("y", (d, i) => height - (i + 1) * 30)
      .attr("width", 15)
      .attr("height", 15)
      .attr("stroke", "black")
      .attr("stroke-width", 2)
      .attr("fill", d => getColorOfTheme(d));

    themesAndColors
      .enter()
      .append("text")
      .attr("x", 40)
      .attr("y", (d, i) => height - (i + 1) * 30 + 15)
      .text(d => "Theme: " + d);

    themesAndColors.exit().remove();
    books.exit().remove();
    //bookNames.exit().remove()
  }
});
