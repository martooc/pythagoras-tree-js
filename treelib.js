//This program generates a Pythagoras tree with a randomly varying 
//branching ratio at each bifurcation point

function rotationMatrix2D(rad) {
  return [[  Math.cos(rad),   Math.sin(rad)],
          [ -Math.sin(rad),   Math.cos(rad)]];
}


function generatePythagorasTree(maxLevel=10, p=0.5, random_p = false, k=100){
  
  function generateTreeRec(level, anchor, angle, base, side, p){
    // baseCube = matrix(c(0,0,1,1,0,1,1,0), 4, 2) * base
    var baseCube = [[0,    0   ],
                    [0,    base],
                    [base, base],
                    [base, 0   ]];

    var R = rotationMatrix2D(angle);

    //Rotate the cube (matrix multiplication R %*% baseCube)
    var rotatedCube = [baseCube.map(row => row[0]*R[0][0] + row[1]*R[0][1]),
                       baseCube.map(row => row[0]*R[1][0] + row[1]*R[1][1])];
    
    var newCube = [ rotatedCube[0].map(x => x + anchor[0]),
                    rotatedCube[1].map(y => y + anchor[1])];
       
    if(level == maxLevel){
      return [{cube: newCube, level: level}];
    }else{
      if(random_p) {
        var p2 = jStat.beta.sample( k * p, k * (1-p) );
      } else{
        var p2 = p
      }
      var angle_left = Math.asin( Math.sqrt(1 - p2) );
      var angle_right = Math.asin( Math.sqrt(p2) );
      var base_left = base * Math.sqrt(p2);
      var base_right = base * Math.sqrt(1 - p2);
      
      return [{cube: newCube, level: level}]
        .concat(generateTreeRec(level + 1, 
                [newCube[0][1 + side], newCube[1][1 + side]], 
                angle + (side === 0 ? -angle_left : Math.PI/2.0 - angle_left), 
                base_left, 
                0, 
                p))
        .concat(generateTreeRec(level + 1, 
                [newCube[0][2 + side], newCube[1][2 + side]], 
                angle + (side === 0 ? -(Math.PI/2.0 - angle_right) : angle_right), 
                base_right, 
                1, 
                p));
                                    
    } 

  }  

  return generateTreeRec(level=0, anchor=[0,0], angle=0, base=1, side=0, p=p);
}

function redraw(cubes){
  var svg = d3.select('svg');
  var items = svg.selectAll('polygon').data(cubes);
  items.enter().append('polygon').call(setEmAll);
  items.exit().remove();
  items.transition().duration(1500).call(setEmAll);
}

function setEmAll(polygons){
  var cubes = d3.selectAll('polygon').data();

  var min_x = d3.min(cubes.map(cbs => d3.min(cbs.cube[0])));
  var max_x = d3.max(cubes.map(cbs => d3.max(cbs.cube[0])));

  var min_y = d3.min(cubes.map(cbs => d3.min(cbs.cube[1])));
  var max_y = d3.max(cubes.map(cbs => d3.max(cbs.cube[1])));

  var xScale = d3.scale.linear().domain([min_x, max_x]).range([0, 1024]);
  // var yScale = d3.scale.linear().domain([min_y, max_x - min_x]).range([600, 0]);
  var yScale = d3.scale.linear().domain([min_y, max_y]).range([600, 0]);

  polygons
      .attr("points", function(d){
      var x = d.cube[0]
      var y = d.cube[1]

      return xScale(x[0]) + "," + yScale(y[0]) + " " +
             xScale(x[1]) + "," + yScale(y[1]) + " " +
             xScale(x[2]) + "," + yScale(y[2]) + " " +
             xScale(x[3]) + "," + yScale(y[3]);
      
    })
    .style("fill", "green")
    .style("opacity", 0.5);
    // .style("stroke", "black")
    // .style("stroke-width", 1)
    

}

function run(){
  var p = document.getElementById("pRange").value / 100.0;
  var k = document.getElementById("kRange").value * 10;
  // console.log(p);

  var cubes = generatePythagorasTree(maxLevel = 11, p=p, random_p = true, k=k);
  cubes.sort(function(a, b) {return a.level - b.level});

  d3.select("svg")
    .attr("width", 1024)
    .attr("height", 1024);
    // .style("border", "1px solid black")

  redraw(cubes);     
}













