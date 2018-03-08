// Generating Plots using D3.js

// Data sourced from http://darksky.net
// Daily Forecast (Cambridge, MA): https://api.darksky.net/forecast/c6b293fcd2092b65cfb7313424b2f7ff/42.361145,-71.057083/[latitude],[longitude],[time]

// Generate Plots
var margin2 = {t: 60, r: 60, b: 60, l: 60}; //this is an object
var width2 = d3.select('#viz2').node().clientWidth - margin2.r - margin2.l,
    height2 = d3.select('#viz2').node().clientHeight - margin2.t - margin2.b;

var plot2 = d3.select('#plot2') // if we select a html id #name, if we select a class .name
    .append('svg')
    .attr('width', width2 + margin2.r + margin2.l)
    .attr('height', height2 + margin2.t + margin2.b);

// Specify Color Scale
var speedColorScale = d3.scaleQuantize()
    .domain([0, 75])
    .range(["#E6F5FD", "#8ed6f6", "#E6F598",
        "#FFFFBF", "#FEE08B", "#FDAE61", "#F46D43", "#D53E4F", "#9E0142"]);

d3.json("data/cambridge_weather.json",drawPlot2);

// Draws the Weather Visualization 2 onto the DOM
// @param [obj] error - Error report related to drawing visualization
// @param [obj] data - Today's Weather
function drawPlot2(error,data){
    console.log(data);

    // Get Hourly Weather Forecast for Week
    var weekWeatherHourly = data.hourly.data;

    // 2 UNDERSTAND THE DATA
    // 2.1 how do you want to show the information?



    // 2.2 how do you want to show the information?


    // 2.3 Create Scales to put the data in the dom element
    var scaleTime = d3.scaleTime().domain([0, 24*3600*1000]).range([0, width2]);
    var scalePointDist = d3.scaleTime().domain([0, 24*3600*1000]).range([0, width2/2]);
    var scalePoint = d3.scaleLinear().domain([0, 75]).range([0, 100]);

    // 2.4 Create Groups to put the Content inside them
    plot2
        .append('g')
        .attr('transform', "translate(" + ((margin2.l + width2 + margin2.r)/2) + "," + ((margin2.t + height2 + margin2.b)/2) + ")")
        .attr('class', 'visualization');

    var plotCircGrid = plot2.select('.visualization')
        .append("g")
        .attr("class","grid-lines");

    var plotWindPoints = plot2.select('.visualization')
        .append("g")
        .attr("class","wind-points");

    plotCircGrid
        .selectAll('.grid-circles')
        .data(Array.apply(null, Array(5)).map(function (_, i) {return i;}))
        .enter()
        .append('circle')
        .attr("class", "grid-circles")
        .attr('r', function(i) {
            return scaleTime(3.5*i*3600*1000);
        });

    // Horizontal Hours
    plotCircGrid
        .selectAll('.inner-hor-circ-grid-lines')
        .data([0,2])
        .enter()
        .append("line")
        .attr("transform", function(i) {
            return "rotate(" + 90*i + ")";
        })
        .attr("class", "inner-hor-circ-grid-lines") // this is the same class that we have selected before
        .attr("x1",function(d) {
            return scaleTime(2 * 3600*1000);
        })
        .attr("x2",function(d) {
            return scaleTime(5 * 3600*1000);
        })
        .attr("y1",function(d, i) {
            return scaleTime(0);
        })
        .attr("y2",function(d, i) {
            return scaleTime(0);
        });

    plotCircGrid
        .selectAll('.outer-hor-circ-grid-lines')
        .data([0,2])
        .enter()
        .append("line")
        .attr("transform", function(i) {
            return "rotate(" + 90*i + ")";
        })
        .attr("class", "outer-hor-circ-grid-lines") // this is the same class that we have selected before
        .attr("x1",function(d) {
            return scaleTime(9 * 3600*1000);
        })
        .attr("x2",function(d) {
            return scaleTime(12 * 3600*1000);
        })
        .attr("y1",function(d, i) {
            return scaleTime(0);
        })
        .attr("y2",function(d, i) {
            return scaleTime(0);
        });

    // Vertical Axis
    plotCircGrid
        .selectAll('.inner-vert-circ-grid-lines')
        .data([1,3])
        .enter()
        .append("line")
        .attr("transform", function(i) {
            return "rotate(" + 90*i + ")";
        })
        .attr("class", "inner-vert-circ-grid-lines") // this is the same class that we have selected before
        .attr("x1",function(d) {
            return scaleTime(2 * 3600*1000);
        })
        .attr("x2",function(d) {
            return scaleTime(6 * 3600*1000);
        })
        .attr("y1",function(d, i) {
            return scaleTime(0);
        })
        .attr("y2",function(d, i) {
            return scaleTime(0);
        });

    plotCircGrid
        .selectAll('.outer-vert-circ-grid-lines')
        .data([1,3])
        .enter()
        .append("line")
        .attr("transform", function(i) {
            return "rotate(" + 90*i + ")";
        })
        .attr("class", "outer-vert-circ-grid-lines") // this is the same class that we have selected before
        .attr("x1",function(d) {
            return scaleTime(8 * 3600*1000);
        })
        .attr("x2",function(d) {
            return scaleTime(13 * 3600*1000);
        })
        .attr("y1",function(d, i) {
            return scaleTime(0);
        })
        .attr("y2",function(d, i) {
            return scaleTime(0);
        });

    // Add Text
    // N
    plotCircGrid
        .append("text")
        .attr("class", "directions")
        .attr("y", function(d) {
            return scaleTime(-15 * 3600*1000);
        })
        .style("text-anchor", "middle")
        .text("N");

    // E
    plotCircGrid
        .append("text")
        .attr("class", "directions")
        .attr("x", function(d) {
            return scaleTime(16 * 3600*1000);
        })
        .attr("y", function(d) {
            return scaleTime(0.2 * 3600*1000);
        })
        .style("text-anchor", "middle")
        .text("E");

    // S
    plotCircGrid
        .append("text")
        .attr("class", "directions")
        .attr("y", function(d) {
            return scaleTime(16 * 3600*1000);
        })
        .style("text-anchor", "middle")
        .text("S");

    // W
    plotCircGrid
        .append("text")
        .attr("class", "directions")
        .attr("x", function(d) {
            return scaleTime(-16 * 3600*1000);
        })
        .attr("y", function(d) {
            return scaleTime(0.2 * 3600*1000);
        })
        .style("text-anchor", "middle")
        .text("W");

    // 00:00
    plotCircGrid
        .append("text")
        .attr("class", "circ-axis")
        .attr("y", function(d) {
            return scaleTime(0.3 * 3600*1000);
        })
        .style("text-anchor", "middle")
        .text("00:00");

    // 12:00
    plotCircGrid
        .append("text")
        .attr("class", "circ-axis")
        .attr("x", function(d) {
            return scaleTime(7 * 3600*1000);
        })
        .attr("y", function(d) {
            return scaleTime(0.3 * 3600*1000);
        })
        .style("text-anchor", "middle")
        .text("12:00");

    plotCircGrid
        .append("text")
        .attr("class", "circ-axis")
        .attr("x", function(d) {
            return scaleTime(-7 * 3600*1000);
        })
        .attr("y", function(d) {
            return scaleTime(0.3 * 3600*1000);
        })
        .style("text-anchor", "middle")
        .text("12:00");

    plotCircGrid
        .append("text")
        .attr("class", "circ-axis")
        .attr("y", function(d) {
            return scaleTime(7.3 * 3600*1000);
        })
        .style("text-anchor", "middle")
        .text("12:00");

    plotCircGrid
        .append("text")
        .attr("class", "circ-axis")
        .attr("y", function(d) {
            return scaleTime(-6.7 * 3600*1000);
        })
        .style("text-anchor", "middle")
        .text("12:00");

    // 23:59
    plotCircGrid
        .append("text")
        .attr("class", "circ-axis")
        .attr("x", function(d) {
            return scaleTime(14 * 3600*1000);
        })
        .attr("y", function(d) {
            return scaleTime(0.3 * 3600*1000);
        })
        .style("text-anchor", "middle")
        .text("23:59");

    plotCircGrid
        .append("text")
        .attr("class", "circ-axis")
        .attr("x", function(d) {
            return scaleTime(-14 * 3600*1000);
        })
        .attr("y", function(d) {
            return scaleTime(0.3 * 3600*1000);
        })
        .style("text-anchor", "middle")
        .text("23:59");

    plotCircGrid
        .append("text")
        .attr("class", "circ-axis")
        .attr("y", function(d) {
            return scaleTime(14.3 * 3600*1000);
        })
        .style("text-anchor", "middle")
        .text("23:59");

    plotCircGrid
        .append("text")
        .attr("class", "circ-axis")
        .attr("y", function(d) {
            return scaleTime(-13.7 * 3600*1000);
        })
        .style("text-anchor", "middle")
        .text("23:59");

    // Place Dots
    plotWindPoints
        .selectAll(".wind-point")
        .data(weekWeatherHourly[0]) // select the data
        .enter()
        .append("circle")
        .attr("class", "wind-point") // this is the same class that we have selected before
        .attr("transform", function(d) {
            return "rotate(" + d.windBearing + ")";
        })
        .attr("cx", function(d) {
            var date = new Date (d.time*1000);
            var hours = date.getHours();
            var time = scalePointDist(hours*3600*1000);
            var angle = d.windBearing * (Math.PI/180);
            var x = time * Math.cos(angle);
            return x;
        })
        .attr("cy", function(d) {
            var date = new Date (d.time*1000);
            var hours = date.getHours();
            var time = scalePointDist(hours*3600*1000);
            var angle = d.windBearing * (Math.PI/180);
            var y = time * Math.sin(angle);
            return y;
        })
        .attr('r', function(d) {
            return scalePoint(d.windSpeed);
        })
        .style("fill", function(d) {
            return speedColorScale(d.windSpeed);
        })
        .attr("fill-opacity","0.7");

        // Key Text
        plot2
            .append("text")
            .attr("class", "viz-heading")
            .attr("y", function(d) {
                return 30;
            })
            .attr('transform', "translate(" + ((margin2.l + width2 + margin2.r)/2) + "," + 10 + ")")
            .style("text-anchor", "middle")
            .text("Wind Speed and Wind Bearing Over Time");

        plot2
            .append("text")
            .attr("class", "viz-key-heading")
            .attr("y", function(d) {
                return 30;
            })
            .attr('transform', "translate(" + ((margin2.l + width2 + margin2.r)/2) +  "," + (height2 - 40) + ")")
            .style("text-anchor", "middle")
            .text("KEY");


        plot2
            .append("image")
            .attr("xlink:href", "assets/images/angle.png")
            .attr('transform', "translate(" + ((margin2.l + width2 + margin2.r)/2 - 50) +  "," + (height2 + 15) + ")")
            .attr('width', 15)
            .attr('height', 15);

        plot2
            .append("text")
            .attr("class", "viz-key-text")
            .attr("y", function(d) {
                return 13;
            })
            .attr('transform', "translate(" + ((margin2.l + width2 + margin2.r)/2) +  "," + (height2 + 15) + ")")
            .style("text-anchor", "middle")
            .text("BEARING");

        plot2
            .append("image")
            .attr("xlink:href", "assets/images/radius.png")
            .attr('transform', "translate(" + ((margin2.l + width2 + margin2.r)/2 - 50) +  "," + (height2 + 40) + ")")
            .attr('width', 15)
            .attr('height', 15);

        plot2
            .append("text")
            .attr("class", "viz-key-text")
            .attr("y", function(d) {
                return 13;
            })
            .attr('transform', "translate(" + ((margin2.l + width2 + margin2.r)/2) +  "," + (height2 + 40) + ")")
            .style("text-anchor", "middle")
            .text("TIME");

        // Create the svg:defs element and the main gradient definition.
        var svgDefs = plot2.append('defs');

        var mainGradient = svgDefs.append('linearGradient')
            .attr('id', 'mainGradient');

        // Create the stops of the main gradient. Each stop will be assigned
        // a class to style the stop using CSS.
        mainGradient.append('stop')
            .attr('class', 'stop-left')
            .attr('offset', '0');

        mainGradient.append('stop')
            .attr('class', 'stop-mid-left')
            .attr('offset', '0.33');

        mainGradient.append('stop')
            .attr('class', 'stop-mid-right')
            .attr('offset', '0.66');

        mainGradient.append('stop')
            .attr('class', 'stop-right')
            .attr('offset', '1');

        plot2
            .append('rect')
            .classed('filled', true)
            .attr('transform', "translate(" + ((margin2.l + width2 + margin2.r)/2 - 35) +  "," + (height2 + 67) + ")")
            .attr('width', 70)
            .attr('height', 15);

        plot2
            .append("text")
            .attr("class", "viz-key-text")
            .attr("y", function(d) {
                return 13;
            })
            .attr('transform', "translate(" + ((margin2.l + width2 + margin2.r)/2 - 45) +  "," + (height2 + 67) + ")")
            .style("text-anchor", "middle")
            .text("0");
        plot2
            .append("text")
            .attr("class", "viz-key-text")
            .attr("y", function(d) {
                return 13;
            })
            .attr('transform', "translate(" + ((margin2.l + width2 + margin2.r)/2 + 47) +  "," + (height2 + 67) + ")")
            .style("text-anchor", "middle")
            .text("75");
        plot2
            .append("text")
            .attr("class", "viz-key-text")
            .attr("y", function(d) {
                return 13;
            })
            .attr('transform', "translate(" + ((margin2.l + width2 + margin2.r)/2) +  "," + (height2 + 87) + ")")
            .style("text-anchor", "middle")
            .text("MPH");
}
