// Load and prepare the TV dataset

function loadTVData() {
    return d3.csv(DATA_PATH, function (row) {
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
        // Keep rows with valid values needed for the charts
        tvData = data.filter(function (d) {
            return Number.isFinite(d.screenSize) &&
                   Number.isFinite(d.energyConsumption) &&
                   d.screenTech !== undefined &&
                   d.screenTech !== "";
        });

        // Build the screen technology filter buttons
        createScreenFilters(tvData);

        // Draw both charts using the loaded dataset
        updateVisualisations();

        console.log("TV data loaded:", tvData.length, "records");
    })
    .catch(function (error) {
        console.error("Error loading TV data:", error);

        const histogram = document.getElementById("histogram");
        const scatterplot = document.getElementById("scatterplot");

        if (histogram) {
            histogram.textContent =
                "Unable to load the TV dataset. Please check the CSV file path.";
        }

        if (scatterplot) {
            scatterplot.textContent =
                "The scatterplot could not be displayed because the data failed to load.";
        }
    });
}

// Return the data currently selected by the screen technology filter
function getFilteredTVData() {
    if (selectedScreenCategory === "All") {
        return tvData;
    }

    return tvData.filter(function (d) {
        return d.screenTech === selectedScreenCategory;
    });
}

// Start loading the dataset after the page has loaded
document.addEventListener("DOMContentLoaded", function () {
    loadTVData();
});