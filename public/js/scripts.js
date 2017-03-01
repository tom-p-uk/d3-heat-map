function renderHeatMap(dataRaw) {

  // set up function to pad month data containing single digit with additional zero
  function zeroPad(n) {
    if (n < 10)
      return '0' + n;
    else
      return n;
  }

  // functions to parse/format month and year props in data
  const parseMonth = d3.timeParse('%m');
  const parseYear = d3.timeParse('%Y');
  const formatMonth = d3.timeFormat('%B');
  const formatYear = d3.timeFormat('%Y');

  // map data array to d3-friendly format
  const data = dataRaw.monthlyVariance.map((element) => {
    const baseTemperature = 8.66;

    return {
      year: parseYear(element.year),
      month: parseMonth(element.month),
      temperature: baseTemperature - element.variance,
      variance: element.variance,
    };
  });

  console.log(data);

  // calculate min and max data values
  const yearMin = d3.min(data, (d) => d.year);
  const yearMax = d3.max(data, (d) => d.year);
  const monthMin = d3.min(data, (d) => d.month);
  const monthMax = d3.max(data, (d) => d.month);

  // set up svg element dimensions
  const width = 800;
  const height = 500;
  const margin = { top: 40, right: 20, bottom: 80, left: 80 };

  // append svg to DOM
  const svg = d3.select('.svg-container')
    .append('svg')
    .attr('width', width)
    .attr('height', height)

  // set up scales
  const xScale = d3.scaleTime()
    .domain([yearMin, yearMax])
    .range([margin.left, width - margin.right])

  const yScale = d3.scaleTime()
    .domain([monthMin, monthMax])
    .range([height - margin.bottom, margin.top])

  // set up x and y axes
  const xAxis = d3.axisBottom(xScale)
    .tickFormat(formatYear)

  const yAxis = d3.axisLeft(yScale)
    .tickFormat(formatMonth)

  // append axes to svg
  svg.append('g')
    .attr('id', 'x-axis')
    .attr('transform', `translate(0, ${height - margin.bottom})`)
    .call(xAxis)

  svg.append('g')
    .call(yAxis)
    .attr('transform', `translate(${margin.left}, 0)`)
    .attr('id', 'y-axis')

  // calculate x and y positions for axis labels
  const xLabelPosition = width / 2 + margin.left + margin.right;
  const yLabelPosition = height / 2 - margin.bottom;

  // append labels to svg
  svg.append('text')
    .text('Month')
    .attr('class', 'label')
    .attr('transform', 'rotate(-90)')
    .attr('dx', '-7.5em')
    .attr('dy', '1.5em')
    .attr('x', `${-yLabelPosition}`)

  svg.append('text')
    .text('Year')
    .attr('class', 'label')
    .attr('dx', '-7.5em')
    .attr('dy', '1.5em')
    .attr('transform', `translate(${xLabelPosition}, ${height - (margin.bottom / 1.5)})`)

  // append tooltip div to body
  const tooltip = d3.select('body').append('div')
    .attr('id', 'tooltip')
    .style('position', 'absolute')
    .style('opacity', 0)
}

$.getJSON('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json', (data) => renderHeatMap(data))
