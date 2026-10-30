// Shared constants used by the TV visualisation charts

const DATA_PATH = "data/Ex6_TVdata.csv";

// Shared chart dimensions
const CHART_WIDTH = 800;
const CHART_HEIGHT = 450;

const CHART_MARGIN = {
    top: 30,
    right: 30,
    bottom: 65,
    left: 75
};

// Inner chart dimensions
const INNER_WIDTH =
    CHART_WIDTH - CHART_MARGIN.left - CHART_MARGIN.right;

const INNER_HEIGHT =
    CHART_HEIGHT - CHART_MARGIN.top - CHART_MARGIN.bottom;

// Shared colours
const CHART_COLOURS = {
    primary: "#d97736",
    primaryHover: "#a94f24",
    text: "#4b3024",
    grid: "#e7d8c9",
    background: "#fff8ef"
};

// CSV column names
const DATA_COLUMNS = {
    brand: "brand",
    model: "model",
    screenSize: "screenSize",
    screenTech: "screenTech",
    energyConsumption: "energyConsumption",
    star: "star"
};

// Shared data and filter state
let tvData = [];
let selectedScreenCategory = "All";