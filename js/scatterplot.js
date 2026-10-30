// ==========================================
// INTERACTIVE SCATTERPLOT
// ==========================================

function drawScatterplot(data) {
    const container = d3.select("#scatterplot");

    container.selectAll("*").remove();

    if (!data || data.length === 0) {
        container
            .append("div")
            .attr("class", "chart-message")
            .text("No TVs match the selected filters.");

        return;
    }

    const margin = CHART_MARGIN;
    const width = CHART_WIDTH;
    const height = CHART_HEIGHT;

    const innerWidth =
        width - margin.left - margin.right;

    const innerHeight =
        height - margin.top - margin.bottom;

    const svg = container
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("preserveAspectRatio", "xMidYMid meet")
        .attr("role", "img")
        .attr(
            "aria-label",
            "Scatterplot of TV screen size against energy consumption"
        );

    // Chart title
    svg.append("text")
        .attr("class", "chart-title")
        .attr("x", width / 2)
        .attr("y", 25)
        .attr("text-anchor", "middle")
        .text("TV Screen Size vs Energy Consumption");

    // Plot area
    const chart = svg.append("g")
        .attr(
            "transform",
            `translate(${margin.left},${margin.top})`
        );

    // X scale: screen size
    const x = d3.scaleLinear()
        .domain([
            Math.floor(d3.min(data, d => d.screenSize) / 5) * 5,
            Math.ceil(d3.max(data, d => d.screenSize) / 5) * 5
        ])
        .nice()
        .range([0, innerWidth]);

    // Y scale: energy consumption
    const y = d3.scaleLinear()
        .domain([
            0,
            d3.max(data, d => d.energyConsumption) * 1.1
        ])
        .nice()
        .range([innerHeight, 0]);

    // Gridlines
    chart.append("g")
        .attr("class", "grid")
        .call(
            d3.axisLeft(y)
                .ticks(6)
                .tickSize(-innerWidth)
                .tickFormat("")
        );

    // X axis
    chart.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0,${innerHeight})`)
        .call(d3.axisBottom(x));

    // Y axis
    chart.append("g")
        .attr("class", "axis")
        .call(
            d3.axisLeft(y)
                .ticks(6)
                .tickFormat(d3.format(","))
        );

    // X axis label
    chart.append("text")
        .attr("class", "axis-label")
        .attr("x", innerWidth / 2)
        .attr("y", innerHeight + 48)
        .attr("text-anchor", "middle")
        .text("Screen Size (inches)");

    // Y axis label
    chart.append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("x", -innerHeight / 2)
        .attr("y", -50)
        .attr("text-anchor", "middle")
        .text("Energy Consumption");

    // Scatterplot points
    chart.selectAll(".dot")
        .data(data)
        .join("circle")
        .attr("class", "dot")
        .attr("cx", d => x(d.screenSize))
        .attr("cy", d => y(d.energyConsumption))
        .attr("r", 5)
        .attr("tabindex", 0)
        .attr("role", "button")
        .attr("aria-label", d =>
            `${d.brand} ${d.model}, ${d.screenSize} inches, ` +
            `${d.energyConsumption} energy consumption`
        )
        .on("mouseenter", function (event, d) {
            d3.select(this)
                .attr("r", 8)
                .attr("fill", "#8c78f5");

            showScatterTooltip(d);
        })
        .on("mouseleave", function () {
            d3.select(this)
                .attr("r", 5)
                .attr("fill", null);

            hideScatterTooltip();
        })
        .on("focus", function (event, d) {
            d3.select(this)
                .attr("r", 8);

            showScatterTooltip(d);
        })
        .on("blur", function () {
            d3.select(this)
                .attr("r", 5);

            hideScatterTooltip();
        });
}


// Show information for the selected TV
function showScatterTooltip(d) {
    const tooltip = d3.select("#scatter-tooltip");

    tooltip
        .classed("visible", true)
        .html(
            `<strong>Brand:</strong> ${escapeHTML(d.brand)}<br>` +
            `<strong>Model:</strong> ${escapeHTML(d.model)}<br>` +
            `<strong>Screen size:</strong> ${d.screenSize} inches<br>` +
            `<strong>Screen technology:</strong> ${escapeHTML(d.screenTech)}<br>` +
            `<strong>Energy consumption:</strong> ${d.energyConsumption.toLocaleString()}<br>` +
            `<strong>Star rating:</strong> ${
                Number.isFinite(d.star) ? d.star : "Not available"
            }`
        );
}


// Hide the tooltip
function hideScatterTooltip() {
    d3.select("#scatter-tooltip")
        .classed("visible", false);
}


// Escape text from the CSV before inserting it into HTML
function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, function (character) {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return entities[character];
    });
}