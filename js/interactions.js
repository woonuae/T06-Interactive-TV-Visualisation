// Create filter buttons for each TV screen technology

function createScreenFilters(data) {
    const filterContainer = d3.select("#screen-filters");

    // Clear existing buttons to prevent duplicates
    filterContainer.selectAll("button").remove();

    // Get unique screen technologies from the dataset
    const screenCategories = Array.from(
        new Set(data.map(function (d) {
            return d.screenTech;
        }))
    ).sort();

    // Include the option to display all TVs
    const categories = ["All", ...screenCategories];

    // Create one button for each category
    filterContainer
        .selectAll("button")
        .data(categories)
        .enter()
        .append("button")
        .attr("type", "button")
        .attr("class", function (category) {
            return category === selectedScreenCategory
                ? "filter active"
                : "filter";
        })
        .attr("data-category", function (category) {
            return category;
        })
        .text(function (category) {
            return category === "All" ? "All TVs" : category;
        })
        .on("click", function (event, category) {
            // Update the selected category
            selectedScreenCategory = category;

            // Update the active button appearance
            filterContainer
                .selectAll("button")
                .classed("active", function (buttonCategory) {
                    return buttonCategory === selectedScreenCategory;
                });

            // Redraw both charts with the filtered data
            updateVisualisations();
        });
}

// Refresh both charts using the currently selected filter
function updateVisualisations() {
    const filteredData = getFilteredTVData();

    // Update the histogram if its drawing function is available
    if (typeof drawHistogram === "function") {
        drawHistogram(filteredData);
    }

    // Update the scatterplot if its drawing function is available
    if (typeof drawScatterplot === "function") {
        drawScatterplot(filteredData);
    }
}