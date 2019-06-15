import * as d3 from 'd3';

export default function RadarChart(element, data, allAxis, options) {
    let cfg = {
        w: 600,                  //Width of the circle
        h: 600,                  //Height of the circle
        margin: { top: 20, right: 20, bottom: 20, left: 20 }, //The margins of the SVG
        levels: 3,               //How many levels or inner circles should there be drawn
        maxValue: 0,             //What is the value that the biggest circle will represent
        labelFactor: 1.25,       //How much farther than the radius of the outer circle should the labels be placed
        wrapWidth: 60,           //The number of pixels after which a label needs to be given a new line
        opacityArea: 0.35,       //The opacity of the area of the blob
        dotRadius: 4,            //The size of the colored circles of each blog
        opacityCircles: 0.1,     //The opacity of the circles of each blob
        strokeWidth: 2,          //The width of the stroke around each blob
        roundStrokes: false,     //If true the area and stroke will follow a round path (cardinal-closed)
        color: d3.scaleOrdinal(d3.schemeCategory10)    //Color function
    };

    //Put all of the options into a variable called cfg
    if ('undefined' !== typeof options) {
        for (let i in options) {
            if ('undefined' !== typeof options[i]) { 
                cfg[i] = options[i]; 
            }
        }
    }

    //If the supplied maxValue is smaller than the actual one, replace by the max in the data
    let maxValue = cfg.maxValue;

    let total = allAxis.length,                    //The number of different axes
        radius = Math.min(cfg.w / 2, cfg.h / 2),   //Radius of the outermost circle
        angleSlice = Math.PI * 2 / total;          //The width in radians of each "slice"

    //Scale for the radius
    let rScale = d3.scaleLinear()
        .range([0, radius])
        .domain([0, maxValue]);

    /////////////////////////////////////////////////////////
    //////////// Create the container SVG and g /////////////
    /////////////////////////////////////////////////////////

    //Remove whatever chart with the same id/class was present before
    d3.select(element).select("svg").remove();

    //Initiate the radar chart SVG
    let svg = d3.select(element).append("svg")
        .attr("width", cfg.w + cfg.margin.left + cfg.margin.right)
        .attr("height", cfg.h + cfg.margin.top + cfg.margin.bottom)
        .attr("class", "radar");
    //Append a g element        
    let g = svg.append("g")
        .attr("transform", "translate(" + (cfg.w / 2 + cfg.margin.left) + "," + (cfg.h / 2 + cfg.margin.top) + ")");

    /////////////////////////////////////////////////////////
    /////////////// Draw the Circular grid //////////////////
    /////////////////////////////////////////////////////////

    //Wrapper for the grid & axes
    let axisWrapper = g.append("g").attr("class", "axisWrapper");

    //Draw the background circles
    axisWrapper.selectAll()
        .data(d3.range(1, (cfg.levels + 1)).reverse())
        .enter()
        .append("circle")
        .attr("class", "gridCircle")
        .attr("r", function (d, i) { return radius / cfg.levels * d; })
        .style("fill", "#CDCDCD")
        .style("stroke", "#CDCDCD")
        .style("fill-opacity", cfg.opacityCircles);

    /////////////////////////////////////////////////////////
    //////////////////// Draw the axes //////////////////////
    /////////////////////////////////////////////////////////

    //Create the straight lines radiating outward from the center
    let axis = axisWrapper.selectAll()
        .data(allAxis)
        .enter()
        .append("g")
        .attr("class", "axis");
    //Append the lines
    axis.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", function (d, i) { return rScale(maxValue * 1.1) * Math.cos(angleSlice * i); })
        .attr("y2", function (d, i) { return rScale(maxValue * 1.1) * Math.sin(angleSlice * i); })
        .attr("class", "line")
        .style("stroke", "white")
        .style("stroke-width", "2px");

    //Append the labels at each axis
    axis.append("text")
        .attr("class", "legend")
        .style("font-size", "11px")
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .attr("x", function (d, i) { return rScale(maxValue * cfg.labelFactor) * Math.cos(angleSlice * i); })
        .attr("y", function (d, i) { return rScale(maxValue * cfg.labelFactor) * Math.sin(angleSlice * i); })
        .text(d => d);

    /////////////////////////////////////////////////////////
    ///////////// Draw the radar chart blobs ////////////////
    /////////////////////////////////////////////////////////
    function mapAngle(a) {
        return Math.PI / 2 - a;
    }
    //The radial line function
    let radarLine = d3.radialLine()
        .curve(d3.curveLinearClosed)
        .radius(d => rScale(d.value))
        .angle(d => mapAngle(d.angle));

    if (cfg.roundStrokes) {
        radarLine.curve(d3.curveCardinalClosed);
    }

    //Create a wrapper for the blobs    
    let blobWrapper = g.selectAll()
        .data(data)
        .enter()
        .append("g")
        .attr("class", "radarWrapper");

    //Append the backgrounds    
    blobWrapper
        .append("path")
        .attr("class", "radarArea")
        .attr("d", function (d, i) { return radarLine(d); })
        .style("fill", function (d, i) { return cfg.color(i); })
        .style("fill-opacity", cfg.opacityArea);   
}