
// Shared constants for the TV visualisation

const DATA_PATH = "data/Ex6_TVdata.csv";

// Chart dimensions
const CHART_WIDTH = 800;
const CHART_HEIGHT = 450;

const CHART_MARGIN = {
    top: 50,
    right: 30,
    bottom: 70,
    left: 75
};

// Inner chart dimensions
const INNER_WIDTH =
    CHART_WIDTH - CHART_MARGIN.left - CHART_MARGIN.right;

const INNER_HEIGHT =
    CHART_HEIGHT - CHART_MARGIN.top - CHART_MARGIN.bottom;

// Colours
const CHART_COLOURS = {
    primary: "#a99aff",
    primaryHover: "#7764e8",
    pink: "#f18bc8",
    text: "#30265f",
    grid: "#e5def8",
    background: "#ffffff"
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
let selectedScreenSize = "All";
