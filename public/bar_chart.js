
const w = 960;
const h = 500;
const padding = [80, 40];
const Q = [,"Q1",,,"Q2",,,"Q3",,,"Q4"];

const svg = d3.select(".bar_chart_container").append("svg").attr("width", w).attr("height", h);
var tooltip = d3.select('.bar_chart_container').append('div').attr('id', 'tooltip')
                .style('opacity', 0).style('left', '35%').style('top', '44%');

d3.json(
  'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json'
).then(data => {
  let GDP = data.data.map (p => p[1]);
  let barWidth = (w -padding[0]*2) / GDP.length;

  var xScale = d3
    .scaleTime()
    .domain([new Date(data.data[0][0]), new Date(data.data[data.data.length-1][0])])
    .range([padding[0], w-padding[0]/2]);

  var xAxis = d3.axisBottom().scale(xScale);

  svg.append('g')
    .attr("transform", "translate(0," + (h - padding[1]) + ")")
    .attr('id', 'x-axis')
    .call(xAxis)

  var yAxisScale = d3.scaleLinear().domain([0, d3.max(GDP)]).range([h-padding[1], padding[1]]);

  var yAxis = d3.axisLeft(yAxisScale);

  svg.append('g')
    .call(yAxis)
    .attr('id', 'y-axis')
    .attr('transform', 'translate('+ padding[0] +', 0)');

  var linearScale = d3.scaleLinear().domain([0, d3.max(GDP)]).range([padding[1], h-padding[1]]);

  svg.selectAll("rect")
    .data(GDP)
    .enter()
    .append("rect")
    .attr('data-date', (d, i) => data.data[i][0])
    .attr('data-gdp', d => d)
    .attr("x", (d, i) => xScale (new Date(data.data[i][0])))
    .attr("y", (d, i) => h - linearScale(d))
    .attr("width", barWidth - 0.5)
    .attr("height", (d, i) => linearScale(d)-padding[1])
    .attr("fill", "#33adff")
    .attr("class", "bar")
    .attr('index', (d, i) => i)
    .on('mouseover', function (event, d) {
      var i = this.getAttribute('index');
      var d = this.getAttribute('data-date').split("-");
      var quartal = d[0] + " " + Q[parseInt (d[1])];
      tooltip.transition().duration(200).style('opacity', 0.9);
      tooltip
        .html(
          quartal + "<br>$" + GDP[i] + " Billion"
        )
        .attr('data-date', data.data[i][0])

    })
    .on('mouseout', () => {
      tooltip.transition().duration(200).style('opacity', 0);
    });

    svg.append('text')
       .attr('transform', 'rotate(-90)')
       .attr('x', -210)
       .attr('y', 100)
       .text('Gross Domestic Product')
       .attr('class', 'svg-text');

    svg.append('a')
      .attr('href', 'http://www.bea.gov/national/pdf/nipaguid.pdf')
      .append('text')
      .attr('x', w / 2 + 120)
      .attr('y', h)
      .attr('text-anchor', 'end')
      .text(data.source_name)
      .attr('class', 'svg-text');

}).catch(e => console.log(e));
