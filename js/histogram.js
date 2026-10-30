
// Draw an interactive histogram of TV screen sizes

function drawHistogram(data) {
    const container = d3.select("#histogram");

    // Clear the previous chart before redrawing
    container.selectAll("*").remove();

    // Display a message if there is no data
    if (!data || data.length === 0) {
        container
            .append("p")
            .text("No TV data available for this screen category.");
        return;
    }

    // Chart dimensions
    const width = CHART_WIDTH;
    const height = CHART_HEIGHT;

    const margin = {
        top: 45,
        right: 30,
        bottom: 75,
        left: 75
    };

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Find the minimum and maximum screen sizes
    const minScreenSize = d3.min(data, d => d.screenSize);
    const maxScreenSize = d3.max(data, d => d.screenSize);

    // Create the SVG canvas
    const svg = container
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("preserveAspectRatio", "xMidYMid meet")
        .attr("role", "img")
        .attr(
            "aria-label",
            "Histogram showing the distribution of TV screen sizes"
        );

    // Chart title
    svg.append("text")
        .attr("class", "chart-title")
        .attr("x", width / 2)
        .attr("y", 25)
        .attr("text-anchor", "middle")
        .text("Distribution of TV Screen Sizes");

    // Create the plotting area
    const chart = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // X scale for screen size
    const x = d3.scaleLinear()
        .domain([
            Math.max(0, minScreenSize - 1),
            maxScreenSize + 1
        ])
        .nice()
        .range([0, innerWidth]);

    // Group screen sizes into histogram bins
    const histogram = d3.bin()
        .value(d => d.screenSize)
        .domain(x.domain())
        .thresholds(10);

    const bins = histogram(data);

    // Y scale for the number of TVs in each bin
    const y = d3.scaleLinear()
        .domain([0, d3.max(bins, d => d.length) || 1])
        .nice()
        .range([innerHeight, 0]);

    // Draw horizontal gridlines
    chart.append("g")
        .attr("class", "grid")
        .call(
            d3.axisLeft(y)
                .ticks(6)
                .tickSize(-innerWidth)
                .tickFormat("")
        );

    // Draw histogram bars
    chart.selectAll(".bar")
        .data(bins)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.x0) + 1)
        .attr("y", d => y(d.length))
        .attr("width", d => Math.max(
            0,
            x(d.x1) - x(d.x0) - 2
        ))
        .attr("height", d => innerHeight - y(d.length))
        .append("title")
        .text(d =>
            `TVs: ${d.length}\nScreen size: ${d.x0}–${d.x1} inches`
        );

    // X axis
    chart.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0,${innerHeight})`)
        .call(
            d3.axisBottom(x)
                .ticks(10)
                .tickFormat(d3.format("~g"))
        );

    // Y axis
    chart.append("g")
        .attr("class", "axis")
        .call(
            d3.axisLeft(y)
                .ticks(6)
                .tickFormat(d3.format("d"))
        );

    // X axis label
    chart.append("text")
        .attr("class", "axis-label")
        .attr("x", innerWidth / 2)
        .attr("y", innerHeight + 55)
        .attr("text-anchor", "middle")
        .text("Screen Size (inches)");

    // Y axis label
    chart.append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("x", -innerHeight / 2)
        .attr("y", -50)
        .attr("text-anchor", "middle")
        .text("Number of TVs");
}