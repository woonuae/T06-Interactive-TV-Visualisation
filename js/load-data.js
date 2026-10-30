// Load and prepare the TV dataset

function loadTVData() {
    d3.csv(DATA_PATH, function (row) {
        return {
            brand: row[DATA_COLUMNS.brand],
            model: row[DATA_COLUMNS.model],
            screenSize: +row[DATA_COLUMNS.screenSize],
            screenTech: row[DATA_COLUMNS.screenTech],
            energyConsumption: +row[DATA_COLUMNS.energyConsumption],
            star: +row[DATA_COLUMNS.star]
        };
    })
    .then(function (data) {
        // Keep rows with valid chart values
        tvData = data.filter(function (d) {
            return Number.isFinite(d.screenSize) &&
                   Number.isFinite(d.energyConsumption) &&
                   d.screenTech !== undefined &&
                   d.screenTech !== "";
        });

        // Create both filter groups
        createScreenFilters(tvData);
        createSizeFilters(tvData);

        // Draw charts
        updateVisualisations();

        console.log("TV data loaded:", tvData.length, "records");
    })
    .catch(function (error) {
        console.error("Error loading TV data:", error);

        d3.select("#histogram")
            .text("Unable to load the TV dataset. Check the CSV file path.");

        d3.select("#scatterplot")
            .text("The scatterplot could not be displayed because the data failed to load.");
    });
}


// Apply both filters simultaneously
function getFilteredTVData() {
    return tvData.filter(function (d) {
        const matchesCategory =
            selectedScreenCategory === "All" ||
            d.screenTech === selectedScreenCategory;

        const matchesSize =
            selectedScreenSize === "All" ||
            d.screenSize === Number(selectedScreenSize);

        return matchesCategory && matchesSize;
    });
}


// Start loading after the page has loaded
document.addEventListener("DOMContentLoaded", loadTVData);