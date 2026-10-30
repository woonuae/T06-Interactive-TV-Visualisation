// ==========================================
// INTERACTIVE HISTOGRAM
// ==========================================

function drawHistogram(data) {
    const container = d3.select("#histogram");

    // Clear the previous chart and tooltip
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

    // Create tooltip
    const tooltip = container
        .append("div")
        .attr("class", "histogram-tooltip")
        .attr("role", "status");

    // Create SVG
    const svg = container
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("preserveAspectRatio", "xMidYMid meet")
        .attr("role", "img")
        .attr("aria-label", "Histogram showing TV screen-size distribution");

    // Chart title
    svg.append("text")
        .attr("class", "chart-title")
        .attr("x", width / 2)
        .attr("y", 25)
        .attr("text-anchor", "middle")
        .text("Distribution of TV Screen Sizes");

    // Chart drawing area
    const chart = svg.append("g")
        .attr(
            "transform",
            `translate(${margin.left},${margin.top})`
        );

    // Calculate screen-size range
    const minSize = d3.min(data, d => d.screenSize);
    const maxSize = d3.max(data, d => d.screenSize);

    let xMin = Math.floor(minSize / 5) * 5;
    let xMax = Math.ceil(maxSize / 5) * 5;

    if (xMin === xMax) {
        xMin -= 5;
        xMax += 5;
    }

    // X scale
    const x = d3.scaleLinear()
        .domain([xMin, xMax])
        .range([0, innerWidth]);

    // Create histogram bins
    const binGenerator = d3.bin()
        .value(d => d.screenSize)
        .domain(x.domain())
        .thresholds(d3.range(xMin + 5, xMax, 5));

    const bins = binGenerator(data);

    // Y scale
    const maxCount = d3.max(bins, bin => bin.length) || 1;

    const y = d3.scaleLinear()
        .domain([0, maxCount * 1.12])
        .nice()
        .range([innerHeight, 0]);

    // Horizontal gridlines
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
        .call(
            d3.axisBottom(x)
                .ticks(Math.min(12, Math.ceil((xMax - xMin) / 5)))
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
        .text("Number of TVs");

    // Draw histogram bars
    chart.selectAll(".bar")
        .data(bins)
        .join("rect")
        .attr("class", "bar")
        .attr("x", bin => x(bin.x0) + 1)
        .attr("y", bin => y(bin.length))
        .attr("width", bin =>
            Math.max(0, x(bin.x1) - x(bin.x0) - 2)
        )
        .attr("height", bin =>
            Math.max(0, innerHeight - y(bin.length))
        )
        .attr("tabindex", 0)
        .attr("role", "img")
        .attr("aria-label", bin =>
            `${bin.x0} to ${bin.x1} inches: ${bin.length} TVs`
        )
        .on("mouseenter", function (event, bin) {
            d3.select(this).attr("fill", "#7764e8");

            tooltip
                .classed("visible", true)
                .html(
                    `<strong>Screen-size range:</strong> ` +
                    `${bin.x0}–${bin.x1} inches<br>` +
                    `<strong>Number of TVs:</strong> ${bin.length}`
                );

            positionHistogramTooltip(event, tooltip);
        })
        .on("mousemove", function (event) {
            positionHistogramTooltip(event, tooltip);
        })
        .on("mouseleave", function () {
            d3.select(this).attr("fill", null);
            tooltip.classed("visible", false);
        })
        .on("focus", function (event, bin) {
            tooltip
                .classed("visible", true)
                .html(
                    `<strong>Screen-size range:</strong> ` +
                    `${bin.x0}–${bin.x1} inches<br>` +
                    `<strong>Number of TVs:</strong> ${bin.length}`
                );
        })
        .on("blur", function () {
            tooltip.classed("visible", false);
        });
}


// Position the histogram tooltip near the mouse
function positionHistogramTooltip(event, tooltip) {
    const containerNode =
        document.getElementById("histogram");

    const bounds = containerNode.getBoundingClientRect();

    const x = event.clientX - bounds.left + 12;
    const y = event.clientY - bounds.top + 12;

    tooltip
        .style("left", `${Math.max(0, x)}px`)
        .style("top", `${Math.max(0, y)}px`);
}