function run(){
	// d3.select("body").append("p").text("Kakanoku");

	// d3.select("svg")
 //    .append("circle")
 //    .attr("cx", 25)
 //    .attr("cy", 25)
 //    .attr("r", 25)
 //    .style("fill", "purple");

  circleRadii = [40, 20, 10]
 
 	var svgContainer = d3.select("svg")
 										 	 .attr("width", 600)
                       .attr("height", 600)
                       .style("border", "1px solid black")
 	                     .selectAll("circle")
                       .data(circleRadii)
                       .enter()
                       .append("circle")
                       .attr("cx", function(d) {return 3*d;})
                       .attr("cy", function(d) {return 3*d;})
                       .attr("r", function (d) { return d; })
                       .style("fill", function(d) {
                         var returnColor;
                         if (d === 40) { returnColor = "green";
                           } else if (d === 20) { returnColor = "purple";
                           } else if (d === 10) { returnColor = "red"; }
                           return returnColor;
                         }
                       );
//Array of JSON objects
  var jsonCircles = [
    {
    	"x_axis": 30,
    	"y_axis": 30,
    	"radius": 20,
    	"color" : "green"
    }, {
    	"x_axis": 70,
    	"y_axis": 70,
    	"radius": 20,
    	"color" : "purple"
    }, {
    	"x_axis": 110,
    	"y_axis": 100,
    	"radius": 20,
    	"color" : "red"
    }];                       
}
