
// Draw a scatterplot of TV screen size against energy consumption

function drawScatterplot(data) {
    const container = d3.select("#scatterplot");
    const tooltip = d3.select("#scatter-tooltip");

    // Clear the previous chart before redrawing
    container.selectAll("*").remove();
    tooltip.classed("visible", false).text("");

    // Display a message if no data is available
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
        left: 85
    };

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Create the SVG canvas
    const svg = container
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("preserveAspectRatio", "xMidYMid meet")
        .attr("role", "img")
        .attr(
            "aria-label",
            "Scatterplot showing TV screen size and energy consumption"
        );

    // Chart title
    svg.append("text")
        .attr("class", "chart-title")
        .attr("x", width / 2)
        .attr("y", 25)
        .attr("text-anchor", "middle")
        .text("TV Screen Size vs Energy Consumption");

    // Create the plotting area
    const chart = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // X scale: TV screen size
    const x = d3.scaleLinear()
        .domain(d3.extent(data, d => d.screenSize))
        .nice()
        .range([0, innerWidth]);

    // Y scale: energy consumption
    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.energyConsumption) || 1])
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

    // Draw X axis
    chart.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0,${innerHeight})`)
        .call(d3.axisBottom(x).ticks(10));

    // Draw Y axis
    chart.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(y).ticks(6));

    // Draw one circle for each TV
    chart.selectAll(".dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("cx", d => x(d.screenSize))
        .attr("cy", d => y(d.energyConsumption))
        .attr("r", 5)
        .on("mouseenter", function (event, d) {
            d3.select(this)
                .attr("r", 8)
                .attr("fill", CHART_COLOURS.primaryHover);

            tooltip
                .classed("visible", true)
                .text(
                    `Brand: ${d.brand} | ` +
                    `Model: ${d.model} | ` +
                    `Screen size: ${d.screenSize} inches | ` +
                    `Energy consumption: ${d.energyConsumption} | ` +
                    `Screen technology: ${d.screenTech} | ` +
                    `Star rating: ${d.star}`
                );
        })
        .on("mousemove", function (event) {
            // Keep the tooltip visible while the pointer moves
            tooltip.classed("visible", true);
        })
        .on("mouseleave", function () {
            d3.select(this)
                .attr("r", 5)
                .attr("fill", CHART_COLOURS.primary);

            tooltip
                .classed("visible", false)
                .text("");
        })
        .append("title")
        .text(d =>
            `${d.brand} ${d.model}: ` +
            `${d.screenSize} inches, ` +
            `${d.energyConsumption} energy consumption`
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
        .attr("y", -58)
        .attr("text-anchor", "middle")
        .text("Energy Consumption");
}
