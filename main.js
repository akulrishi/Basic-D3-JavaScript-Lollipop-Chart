// Hint: This is a good place to declare your global variables
let female_data;
let male_data;

var select;
var val;
var data;
var val;
var svg;
var size;
var max_fem;
var max_male;
// This function is called once the HTML page is fully loaded by the browser
document.addEventListener('DOMContentLoaded', function () {
   // Hint: create or set your svg element inside this function
   // This will load your two CSV files and store them into two arrays.
   Promise.all([d3.csv('data/females_data.csv'),d3.csv('data/males_data.csv')])
        .then(function (values) {
            console.log('loaded females_data.csv and males_data.csv');
            female_data = values[0];
            male_data = values[1];
            select = document.getElementById('country1');
            val = select.options[select.selectedIndex].value;
            drawLolliPopChart();

    });
});

// Use this function to draw the lollipop chart.
function drawLolliPopChart() {
    console.log('trace:drawLollipopChart()');
    
    select = document.getElementById('country1');
    val = select.options[select.selectedIndex].value;
    max_fem=d3.max(female_data, function (data){ return data[val] });
    max_male=d3.max(male_data, function (data){ return data[val] });
    String(val)
    d3.selectAll("svg > *").remove();
    //width and height remain same as the barchart dimensions in the index.html
    var width = 1000;
    var height = 600;
    var data = Math.max(max_fem,max_male);
    var margin = {
      top: 20,
      right: 20,
      bottom: 85,
      left: 20
    }

    //Set the width and height of the svg
    var svg = d3.select("#lolli_barchart").append("svg").attr("width", width).attr("height", height);
    var scale_x = d3.scaleTime().domain([new Date(1990,0), new Date(2023,0)]).range([0, width - 100]);
    var scale_y = d3.scaleLinear().domain([0, data]).range([height-30, 0]);
    var x_axis = d3.axisBottom().scale(scale_x);
    var y_axis = d3.axisLeft().scale(scale_y);

    //transition added to svg
    svg.append("g").attr("transform", "translate(50, 10)").call(y_axis).transition().duration(2000);
    svg.append("g").attr("transform", "translate(50, " + height/1.034  +")").text("Date").call(x_axis).transition().duration(2000);

    var val_xscale=scale_x;
    var val_yscale=scale_y;

    //Legend
    size=20;
    //Legend blocks
    svg.append("rect").attr("x",750).attr("y",5).attr("width", size).attr("height", size).style("fill", "#FF5733")
    svg.append("rect").attr("x",750).attr("y",30).attr("width", size).attr("height", size).style("fill", "#3383FF")
    //Legend labels
    svg.append("text").attr("x", 780).attr("y", 20).text("Employment Rate: Female").style("font-size", "15px")
    svg.append("text").attr("x", 780).attr("y", 40).text("Employment Rate: Male").style("font-size", "15px").attr("alignment-baseline","middle")

    //Labels
    //x-axis 
    svg.append("text").text("YEAR").attr("x", width/2.5 ).attr("y",  height).style("text-anchor", "middle").transition().duration(2000);
    //y-axis 
    svg.append("text").text("EMPLOYMENT RATE").attr("transform", "rotate(-90)").attr("y", 0).attr("x",0 - (height / 2)-10).attr("dy", "1em").style("text-anchor", "middle").transition().duration(2000);

    // Lines with transition 
    //Female lines
    svg.selectAll("female_lines").data(female_data).enter().append("line").attr("x1", function(d) {return val_xscale(new Date(d.Year)); }).attr("x2", function(d) { return val_xscale(new Date(d.Year)); }).attr("y1", function(d) { return val_yscale(d[val]); })
    .attr("y2", val_yscale(0)).attr("stroke", "#FF5733").transition().duration(2000).attr("transform", "translate(55,9.6)")
    //Male lines
    svg.selectAll("male_lines").data(male_data).enter().append("line").attr("x1", function(d) {return val_xscale(new Date(d.Year)); }).attr("x2", function(d) { return val_xscale(new Date(d.Year)); }).attr("y1", function(d) { return val_yscale(d[val]); })
    .attr("y2", val_yscale(0)).attr("stroke", "#3383FF").transition().duration(2000).attr("transform", "translate(45,9.6)")

    // Circles with transition
    //Female circles
    svg.selectAll("female_circles").data(female_data).enter().append("circle").attr("cx", function(d) { return val_xscale(new Date(d.Year)); }).attr("cy", function(d) { return val_yscale(d[val]); }).attr("r", "4")
    .style("fill", "#FF5733").transition().duration(2000).attr("transform", "translate(55,9.6)")
    //Male circles
    svg.selectAll("male_circles").data(male_data).enter().append("circle").attr("cx", function(d) { return val_xscale(new Date(d.Year)); }).attr("cy", function(d) { return val_yscale(d[val]); }).attr("r", "4")
    .style("fill", "#3383FF").transition().duration(2000).attr("transform", "translate(45,9.6)")
}
