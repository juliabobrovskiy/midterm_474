'use strict';

(function() {

  let svgContainer = ""; 

  // load data and make scatter plot after window loads
  window.onload = function() {
    svgContainer = d3.select('body')
      .append('svg')
      .attr('width', 1000)
      .attr('height', 600);

    // d3.csv is basically fetch but it can be be passed a csv file as a parameter
    d3.csv("../data/Seasons_SimpsonsData.csv")
      .then((csvData) => makeHistogram(csvData));
  }

  // Function makes the Histogram
  function makeHistogram(csvData) {
    var data = csvData;
    
    // Setting margins for container.
    var margin = {top: 50, right: 30, bottom: 30, left: 50},
    width = 950 - margin.left - margin.right,
    height = 550 - margin.top - margin.bottom;
    
    var svg = d3.select("svg")
      .append("g")
        .attr("transform","translate(" + margin.left + "," + margin.top + ")");
    var formated = d3.format(".3n")
    var viewsAvg = formated(d3.mean(data, function(d) { return d['Avg. Viewers (mil)']; }));

    //Scale X and make X-axis 
    var x = d3.scaleLinear()
      .domain([d3.min(data, function(d) { return +d['Year'] }), d3.max(data, function(d) { return +d['Year'] }) + 1])    
      .range([0, width + 78]);

    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).ticks(20).tickFormat(d3.format("d")).tickSize(0))
      .selectAll("text")	
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", "1.7em")
      .attr("transform", "rotate(-90)");

    // Scale Y and make Y-Axis
    var y = d3.scaleLinear()
      .domain([0, d3.max(data, function(d) { return +d['Avg. Viewers (mil)'] }) + 5]) 
      .range([height, 0]);

    svg.append("g")
      .call(d3.axisLeft(y).ticks(8));
  
    
    /****** Labels *******/
    // Y-axis 
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -32)
      .attr("x", 0 - (height / 2))
      .attr("font-family", "sans-serif")
      .attr("font-size", "12px")
      .style("text-anchor", "middle")
      .text("Avg. Viewers (in millions)");  

    // // X-axis
    svg.append("text")
      .attr("transform", "translate(" + (width / 2) + " , 525)")
      .attr("font-family", "sans-serif")
      .attr("font-size", "12px")
      .style("text-anchor", "middle")
      .text("Year");
    
    // Title
    let title = svg.append("text") 
      .attr("class", "title")
      .attr("x", 250)
      .attr("y", 30)            
      .attr("transform", "translate(-100,-50)")
      .attr("font-family", "sans-serif")
      .attr("font-size", "20px")
      .attr("fill", "#9e5c17")
      .style("text-anchor", "middle")
      .text("Average Viewership by Season")
  
    
    /**** Attach Bars to Graph as well as Average Trend-Line *****/

  let div = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

  svg.selectAll("rect")
  .data(data)
  .enter()
  .append("rect")
    .attr("fill", function(d) {
      if (d["Year"] == 1999 || d["Year"] == 2000) {
        return "grey";
      } 
      return "#42cef4";
    })
    .attr("x", function(d) { return x(d['Year']) + 2; })
    .attr("width", 30)
    .attr("y", function(d) { return y(d['Avg. Viewers (mil)']); })
    .attr("height", function(d) { return height - y(d['Avg. Viewers (mil)']); })
    .on("mouseover", (d) => {
      div.transition()
        .duration(200)
        .style("opacity", .9);
      div.html(
          "Year: " + d["Year"] + "<br/>" + 
          "Episodes: " + d["Episodes"] + "<br/>" + 
          "Avg Viewers (mill): " + d["Avg. Viewers (mil)"] + "<br/>" + 
          "Most Watched Episode: " + d["Most watched episode"] + "<br/>" +
          "Viewers(mil): " + d["Viewers (mil)"] + "<br/>" 
      )
        .style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY - 28) + "px");
    })
    .on("mouseout", (d) => {
      div.transition()
        .duration(500)
        .style("opacity", 0);
    })
    
    // Trendline
    var line = svg.append("line")
      .attr("x1", 0)
      .attr("y1", y(viewsAvg))
      .attr("x2", width + 100)
      .attr("y2", y(viewsAvg))
      .attr("stroke-width", 2)
      .attr("stroke", "black")
      .style("stroke-dasharray", ("3, 3"))

    // Label
    var meanLabel = svg.append("g")
      .attr("x", 500)
      .attr("y", 500)
      .attr("height", 300)
      .attr("width", 400);
    meanLabel.append("rect")
      .attr("x", 3)
      .attr("y", 255)
      .attr("width", 25)
      .attr("height", 20)
      .attr("opacity", 0.8)
      .style("fill", "grey");

    meanLabel.append("text")
      .attr("x", 3)
      .attr("y", 270)
      .attr("fill", "white")
      .text(viewsAvg);

    //Legend
    var legend = svg.append("g")
      .attr("class", "legend")
      .attr("x", 500)
      .attr("y", 500)
      .attr("height", 200)
      .attr("width", 200);

    legend.append("rect")
      .attr("x", 700)
      .attr("y", 25)
      .attr("width", 10)
      .attr("height", 10)
      .style("fill", "grey");
  
    legend.append("text")
      .attr("x", 720)
      .attr("y", 34)
      .text("Estimated");
    
    legend.append("rect")
      .attr("x", 700)
      .attr("y", 10)
      .attr("width", 10)
      .attr("height", 10)
      .style("fill", "#42cef4");
    
    legend.append("text")
      .attr("x", 720)
      .attr("y", 20)
      .text("Actual");

    legend.append("text")
      .attr("x", 695)
      .attr("y", 2)
      .text("Viewership Data")
      .attr("font-family", "sans-serif")
      .attr("font-size", "15px")
      .attr("fill", "#9e5c17")
      .attr("style", "bold");    
  }

  

})();
