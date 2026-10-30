// ==========================================
// TECHNOLOGY FILTERS
// ==========================================

function createScreenFilters(data) {
    const container = d3.select("#screen-filters");

    const categories = [
        "All",
        ...Array.from(
            new Set(data.map(d => d.screenTech))
        ).sort()
    ];

    container
        .selectAll("button")
        .data(categories)
        .join("button")
        .attr("type", "button")
        .attr("class", category =>
            category === selectedScreenCategory
                ? "filter active"
                : "filter"
        )
        .attr("data-category", category => category)
        .text(category =>
            category === "All" ? "All TVs" : category
        )
        .on("click", function (event, category) {
            selectedScreenCategory = category;

            updateFilterButtonStyles();
            updateVisualisations();
        });
}


// ==========================================
// SCREEN-SIZE FILTERS
// ==========================================

function createSizeFilters(data) {
    const container = d3.select("#size-filters");

    // Required sizes from the assignment example
    const preferredSizes = [24, 32, 55, 65, 98];

    // Keep only sizes that actually exist in the dataset
    const availableSizes = new Set(
        data.map(d => d.screenSize)
    );

    const sizes = [
        "All",
        ...preferredSizes.filter(size => availableSizes.has(size))
    ];

    container
        .selectAll("button")
        .data(sizes)
        .join("button")
        .attr("type", "button")
        .attr("class", size =>
            String(size) === selectedScreenSize
                ? "filter active"
                : "filter"
        )
        .attr("data-size", size => size)
        .text(size =>
            size === "All" ? "All Sizes" : `${size}"`
        )
        .on("click", function (event, size) {
            selectedScreenSize = String(size);

            updateFilterButtonStyles();
            updateVisualisations();
        });
}


// ==========================================
// UPDATE BUTTON STYLES
// ==========================================

function updateFilterButtonStyles() {
    d3.select("#screen-filters")
        .selectAll("button")
        .classed("active", function () {
            return this.dataset.category === selectedScreenCategory;
        });

    d3.select("#size-filters")
        .selectAll("button")
        .classed("active", function () {
            return this.dataset.size === selectedScreenSize;
        });
}


// ==========================================
// REDRAW BOTH CHARTS
// ==========================================

function updateVisualisations() {
    const filteredData = getFilteredTVData();

    if (typeof drawHistogram === "function") {
        drawHistogram(filteredData);
    }

    if (typeof drawScatterplot === "function") {
        drawScatterplot(filteredData);
    }
}