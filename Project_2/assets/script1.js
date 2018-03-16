// Generating Plots using D3.js

// Data sourced from http://darksky.net
// Daily Forecast (Cambridge, MA): https://api.darksky.net/forecast/c6b293fcd2092b65cfb7313424b2f7ff/42.361145,-71.057083/[latitude],[longitude],[time]

// Generate Plots
var margin1 = {t: 60, r: 60, b: 60, l: 60}; //this is an object
var width1 = d3.select('#viz1').node().clientWidth - margin1.r - margin1.l,
    height1 = d3.select('#viz1').node().clientHeight - margin1.t - margin1.b;

var plot1 = d3.select('#plot1') // if we select a html id #name, if we select a class .name
    .append('svg')
    .attr('width', width1 + margin1.r + margin1.l)
    .attr('height', height1 + margin1.t + margin1.b);

// Specify Color Scale
var tempColorScale = d3.scaleQuantize()
    .domain([32, 80])
    .range(["#E6F5FD", "#8ed6f6", "#E6F598",
    "#FFFFBF", "#FEE08B", "#FDAE61", "#F46D43", "#D53E4F", "#9E0142"]);

d3.json("data/cambridge_weather.json",drawPlot1);

// Draws the Weather Visualization 1 onto the DOM
// @param [obj] error - Error report related to drawing visualization
// @param [obj] data - Today's Weather
function drawPlot1(error,data){
    console.log(data);

    // Get Hourly Weather Forecast for Week
    var weekWeatherHourly = data.hourly.data;
    var weekWeatherDaily = data.daily.data;

    // 2 UNDERSTAND THE DATA
    // 2.1 how do you want to show the information?
    // By Day of the Week (axis X)

    var extentWeek = [
        new Date(weekWeatherHourly[0][0].time * 1000),
        new Date(weekWeatherHourly[6][23].time * 1000)
    ];


    // 2.2 how do you want to show the information?
    // By Temperature at Time of Day (axis Y)
    // What are the Min, Maximum and Mean Temperatures each Day?
    var tempExtent =[Infinity, 0];
    var maxDayTemps = [];
    var minDayTemps = [];

    // Get Min and Max Temperatures
    for (var i = 0; i < 7; i++) {
        var maxDayTemp = d3.max(weekWeatherHourly[i],function(d) {
            return d.temperature;
        });
        var maxDay = weekWeatherHourly[i].filter(function(d) {
          return d.temperature == maxDayTemp;
        });
        maxDayTemps.push(maxDay[0]);

        if (maxDayTemp.temperature > tempExtent[1].temperature) {
            tempExtent[1] = maxDay;
        }

        var minDayTemp = d3.min(weekWeatherHourly[i],function(d) {
            return d.temperature;
        });
        var minDay = weekWeatherHourly[i].filter(function(d) {
          return d.temperature == minDayTemp;
        });
        minDayTemps.push(minDay[0]);

        if (tempExtent[0].temperature > minDay.temperature) {
            tempExtent[0] = minDay;
        }
    }

    // Aggregate into one array
    var calcExtentDayTemps = function(minTemps, maxTemps) {
        var extentArray = [];
        for (var i = 0; i < 7; i++) {
            extentArray.push({
                    time: weekWeatherHourly[i][0].time,
                    temps: [minTemps[i], maxTemps[i]]
                });
        }
        return extentArray;
    };

    var extentDayTemps = calcExtentDayTemps(minDayTemps, maxDayTemps);

    // Calculate Mean Temperatures
    var calcMeanDayTemps = function(extentTemps) {
        var meanArray = [];
        for (var i = 0; i < 7; i++) {
            var meanDayTemp = d3.mean(extentTemps[i].temps, function(d) {
                return d.temperature;
            });
            meanArray.push(meanDayTemp);
        }
        return meanArray;
    };

    var meanDayTemps = calcMeanDayTemps(extentDayTemps);

    // 2.3 Create Scales to put the data in the dom element
    var yOffset = 5*3600*1000;
    var scaleX1 = d3.scaleTime().domain(extentWeek).range([0,width1]);
    var scaleY1 = d3.scaleTime().domain([0 + yOffset, 24*3600*1000 + yOffset]).range([height1, 0]);


    // 2.4 Create Groups to put the Content inside them
    plot1
        .append('g')
        .attr('transform', 'translate(' + margin1.l + ',' + margin1.t + ')')
        .attr('class', 'axis axis-y');

    plot1
        .append('g')
        .attr('transform', 'translate(' + margin1.l + ',' + (margin1.t+height1) + ')')
        .attr('class', 'axis axis-x');

    plot1
        .append('g')
        .attr('transform', 'translate(' + margin1.l + ',' + margin1.t + ')')
        .attr('class', 'week-weather');

    plot1
        .append('g')
        .attr('transform', 'translate(' + margin1.l + ',' + margin1.t + ')')
        .attr('class', 'keys');

    var plotGrid = plot1.select('.week-weather')
        .append("g")
        .attr("class","lines");

    var plotGradientBlock = plot1.select('.key')
        .append("g")
        .attr("class","gradient-block");

    var plotBlock = plot1.select('.week-weather')
        .append("g")
        .attr("class","day-block");

    var plotMaxTime = plot1.select('.week-weather')
        .append("g")
        .attr("class","max-lines");

    var plotMinTime = plot1.select('.week-weather')
        .append("g")
        .attr("class","min-lines");

    var plotGradientKey = plot1.select('.keys')
        .append("g")
        .attr("class","key");

    var currentDay = d3.selectAll("rect")
                        .filter(function(d, i) {
                            return i == 0;
                        })
                        .attr("id","current-day");

    var formatWeek = d3.timeFormat("%a");
    var formatDayTime = d3.timeFormat("%H");

    var axisWeekX = d3.axisBottom().scale(scaleX1).ticks(7).tickFormat(formatWeek),
    axisWeekY = d3.axisLeft().scale(scaleY1).ticks(d3.timeHour.every(3)).tickFormat(formatDayTime);

    plot1.select(".axis-x").call(axisWeekX);
    plot1.select(".axis-y").call(axisWeekY);

    // Add the text label for the Y axis
    plot1.append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("y", 12)
        .attr("x",0 - (margin1.b + height1 / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Time During Day");

    // Add the text label for the x axis
    plot1.append("text")
        .attr("class", "axis-label")
        .attr("transform", "translate(" + (margin1.l + width1 / 2) + " ," + (height1 + margin1.t + 42) + ")")
        .style("text-anchor", "middle")
        .text("Day of Week");

    plotGradientBlock
        .select(".gradient-rect")
        .append("rect")
        .attr("class", "gradient-rect") // this is the same class that we have selected before
        .attr("y",margin1.b)
        .attr("height", scaleY1(36000*1000))
        .attr("x",margin1.l)
        .attr("width",scaleX1(new Date (extentWeek[0].getTime() + 24*3600*1000)));

    plotGrid
        .selectAll(".vert-grid-lines")
        .data(Array.apply(null, Array(24)).map(function (_, i) {return i;})) //select the data
        .enter()
        .append("line")
        .attr("class", "vert-grid-lines") // this is the same class that we have selected before
        .attr("x1",function(d) {
            return scaleX1(extentWeek[0]);
        })
        .attr("x2",function(d) {
            return scaleX1(extentWeek[1]);
        })
        .attr("y1",function(d, i) {
            return scaleY1(i*3600*1000 + yOffset);
        })
        .attr("y2",function(d, i) {
            return scaleY1(i*3600*1000 + yOffset);
        });

    plotBlock
        .selectAll(".min-temp")
        .data(weekWeatherDaily) //select the data
        .enter()
        .append("rect")
        .attr("class", "day-temp") // this is the same class that we have selected before
        .attr("y",function(d) {
            var date = new Date(d.sunsetTime * 1000);
            var hours = date.getHours();
            var minutes = date.getMinutes();
            return scaleY1(hours*3600*1000 + minutes*60*1000 + yOffset);
        })
        .attr("height",function(d) {
            var dayTime = d.sunsetTime - d.sunriseTime;
            return scaleY1(dayTime*1000 + yOffset);
        })
        .attr("x",function(d) {
            return scaleX1(new Date (d.time*1000));
        })
        .attr("width",function(d) {
            return scaleX1(new Date (extentWeek[0].getTime() + 24*3600*1000));
        })
        .attr("fill", function(d, i) {
            return tempColorScale(meanDayTemps[i]);
        })
        .attr("fill-opacity","0.5");

    plotMaxTime
        .selectAll(".max-temp")
        .data(extentDayTemps) //select the data
        .enter()
        .append("line")
        .attr("class", "max-temp") // this is the same class that we have selected before
        .attr("x1",function(d) {
            return scaleX1(new Date (d.time*1000));
        })
        .attr("x2",function(d) {
            return scaleX1(new Date ((d.time + 24*3600) * 1000));
        })
        .attr("y1",function(d) {
            var date = new Date(d.temps[1].time * 1000);
            var hours = date.getHours();
            var minutes = date.getMinutes();
            return scaleY1(hours*3600*1000 + minutes*60*1000 + yOffset);
        })
        .attr("y2",function(d) {
            var date = new Date(d.temps[1].time * 1000);
            var hours = date.getHours();
            var minutes = date.getMinutes();
            return scaleY1(hours*3600*1000 + minutes*60*1000 + yOffset);
        });

    plotMinTime
        .selectAll(".min-temp")
        .data(extentDayTemps) //select the data
        .enter()
        .append("line")
        .attr("class", "min-temp") // this is the same class that we have selected before
        .attr("x1",function(d) {
            return scaleX1(new Date (d.time*1000));
        })
        .attr("x2",function(d) {
            return scaleX1(new Date ((d.time + 24*3600) * 1000));
        })
        .attr("y1",function(d) {
            var date = new Date(d.temps[0].time*1000);
            var hours = date.getHours();
            var minutes = date.getMinutes();
            return scaleY1(hours*3600*1000 + minutes*60*1000 + yOffset);
        })
        .attr("y2",function(d) {
            var date = new Date(d.temps[0].time*1000);
            var hours = date.getHours();
            var minutes = date.getMinutes();
            return scaleY1(hours*3600*1000 + minutes*60*1000 + yOffset);
        });

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

    plot1
        .append('rect')
        .classed('filled', true)
        .attr('transform', "translate(" + (width1 - 10) +  "," + (20) + ")")
        .attr('width', 70)
        .attr('height', 15);

    plot1
        .append("line")
        .attr("class", "key-line red")
        .attr("x1",function(d) {
            return margin1.l;
        })
        .attr("x2",function(d) {
            return margin1.l + 20;
        })
        .attr("y1",function(d) {
            return 20;
        })
        .attr("y2",function(d) {
            return 20;
        });

    plot1
        .append("line")
        .attr("class", "key-line blue")
        .attr("x1",function(d) {
            return margin1.l;
        })
        .attr("x2",function(d) {
            return margin1.l + 20;
        })
        .attr("y1",function(d) {
            return 40;
        })
        .attr("y2",function(d) {
            return 40;
        });

    plot1
        .append("text")
        .attr("class", "viz-key-text")
        .attr('transform', "translate(" + (margin1.l + 40) +  "," + (25) + ")")
        .style("text-anchor", "middle")
        .text("HIGH");

    plot1
        .append("text")
        .attr("class", "viz-key-text")
        .attr('transform', "translate(" + (margin1.l + 40) +  "," + (45) + ")")
        .style("text-anchor", "middle")
        .text("LOW");

    plot1
        .append("text")
        .attr("class", "viz-key-text")
        .attr('transform', "translate(" + (width1 - 20) +  "," + (32) + ")")
        .style("text-anchor", "middle")
        .text("0");

    plot1
        .append("text")
        .attr("class", "viz-key-text")
        .attr('transform', "translate(" + (width1 + 70 + 5) +  "," + (32) + ")")
        .style("text-anchor", "middle")
        .text("140F");
}
