ko.bindingHandlers.locationBlock = {
  init: function (element, valueAccessor) {
    var svg = d3.select(element)
                .append("svg")
                .classed("block", true);

    svg.append("rect")
       .classed("background", true)
       .attr("height", 180)
       .attr("width", 800)
       .attr("fill", "#9A5E33");

    svg.append("g")
      .classed("cityscape", true)
      .attr("transform", "scale(.9) translate(100 10)");

    svg.append("g")
        .classed("car", true);

    var car = svg.select(".car");
    car.append("ellipse").attr("fill", "#73B9F3").attr("cx", 0).attr("cy", 7).attr("rx", 26).attr("ry", 6)
    car.append("circle").attr("fill", "#73B9F3").attr("cx", 0).attr("cy", 0).attr("r", 13);
    car.append("circle").attr("fill", "#7f7f7f").attr("stroke", "#191919").attr("stroke-width", 4).attr("cx", 10).attr("cy", 13).attr("r", 5.2);
    car.append("circle").attr("fill", "#7f7f7f").attr("stroke", "#101010").attr("stroke-width", 4).attr("cx", -12).attr("cy", 13).attr("r", 5.2);
    car.attr("transform", "translate(560 140)");

    svg.append("text")
       .classed("description-percentage", true)
       .style("font-size", 80)
       .style("fill", "#73B9F3")
       .attr("x", 270)
       .attr("y", 94);

    svg.append("text")
       .classed("description", true)
       .style("font-size", 20)
       .style("fill", "#73B9F3")
       .attr("x", 310)
       .attr("y", 110);

  },
  update: function (element, valueAccessor) {
    var value = ko.unwrap(valueAccessor());
    var message = "";
    var calculateDistance = function(diff) {
      return value.populationBMean + diff;
    };

    var diff = Math.round(value.populationAMean - value.populationBMean);
    var absDiff = Math.abs(diff);
    var distance = (value.populationBMean + diff) /1000 * 560;

    var svg = d3.select(element).select("svg");

    if (diff <= 0 ) { message = "lives closer to the city than average"; }
    else { message = "lives further away from the city than average"; }

    svg.select(".description-percentage")
                  .text(absDiff + "km");
    svg.select(".description")
                  .text(message);

    var roadPath = function(d) {
      var point = (d < 0) ? d : -d;
      return "m640 145 " + point + " 0";
    }

    var updater = svg.selectAll(".road")
      .data([distance]);

    updater.enter()
      .append("g")
        .each(function(d, i) {
        var road = d3.select(this);
        road.append("path")
          .attr("d", roadPath(d) )
          .attr("stroke-dasharray", "30, 15")
          .attr("stroke-width", 12)
          .attr("stroke", "#73B9F3")
          .classed("road", true);
        var car = svg.select(".car");
        car.transition()
          .duration(5000)
          .attr("transform", "translate(560 140)");
    });

    updater
      .transition()
      .each(function(d) {
        var road = d3.select(".road");
        road.transition()
          .duration(5000)
          .attr("d", roadPath(d));
        var car = svg.select(".car");
        car.transition()
          .duration(5000)
          .attr("transform", "translate(" + (610 - d) +" 140)");
      });

    updater.exit()
        .transition()
          .duration(5000)
          .attr("d", function(d) {return roadPath(d); })
          .remove();

    var buildings = [{stroke: "#7f7f7f", fill: "#7f7f7f",
                      path: "m710,162 l14,4 l27,-70 l-30,-11 l-11,77z"},
                     {stroke: "#999999", fill: "#999999",
                      path: "m697,165 l23,1 l30,-144 l-49,-2 l-4,145z"},
                     {stroke: "#999999", fill: "#999999",
                      path: "m679,166 l-25,0 l-36,-120 l52,-4 l9,123z"},
                     {stroke: "#cccccc", fill: "#cccccc",
                      path: "m673,167 l-26,-158 l68,0 l-13,158 l-28,0z"}];

    var cityscape = svg.select(".cityscape");

    cityscape.selectAll(".buildings")
        .data(buildings)
        .enter()
          .append("path")
            .attr("d", function(d) { return d.path; })
            .attr("stroke", function(d) { return d.stroke; })
            .attr("stroke-width", 5)
            .attr("fill", function(d) { return d.fill; })
            .classed("buildings", true);

  }
};
