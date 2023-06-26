const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"


function init() {
    var dropDown = d3.select("#selDataset");

    d3.json(url).then(function (data) {
        var sampleId = data.names;
        sampleId.forEach((sample) => {
            dropDown.append("option").text(sample).property("value", sample)
        });
        var initSample = sampleId[0];
        buildDemo(initSample);
        buildCharts(initSample);
    });
};
function buildCharts(sample) {
    d3.json(url).then(function (data) {

        var allSamples = data.samples;
        var sampleInfo = allSamples.filter(row => row.id == sample);
        var sampleValues = sampleInfo[0].sample_values;
        var sampleValuesSlice = sampleValues.slice(0, 10).reverse();
        var otuIds = sampleInfo[0].otu_ids;
        var otuIdsSlice = otuIds.slice(0, 10).reverse();
        var otuLabels = sampleInfo[0].otu_labels;
        var otuLabelsSlice = otuLabels.slice(0, 10).reverse();
        var metaData = data.metadata;
        var metaDataSample = metaData.filter(row => row.id == sample);
        var wash = metaDataSample[0].wfreq;

        // bar chart 1
        var trace1 = {
            x: sampleValuesSlice,
            y: otuIdsSlice.map(item => `OTU ${item}`),
            type: "bar",
            orientation: "h",
            text: otuLabelsSlice,
        };
        var data = [trace1];
        Plotly.newPlot("bar", data)

        // bubble chart 2 
        var trace2 = {
            x: otuIds,
            y: sampleValues,
            mode: "markers",
            marker: {
                size: sampleValues,
                color: otuIds,
                colorscale: "Earth"
            },
            text: otuIds
        };
        var data2 = [trace2];
        var layout = {
            showlegend: false
        };

        Plotly.newPlot("bubble", data2, layout);

        // //gauge chart 
        // var data3 = [{
        //     title: { text: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week" },
        //     type: "indicator",
        //     mode: "gauge+number",
        //     gauge: {
        //         axis: { range: [null, 9] },
        //         bar: { color: "black" },
        //         steps: [
        //             { range: [0, 1], color: "rgba(54,170,191,0.6)" },
        //             { range: [1, 2], color: "rgba(80,178,194,0.6)" },
        //             { range: [2, 3], color: "rgba(107,187,198,0.5)" },
        //             { range: [3, 4], color: "rgba(134,196,201,0.5)" },
        //             { range: [4, 5], color: "rgba(160,204,205,0.4)" },
        //             { range: [5, 6], color: "rgba(187,213,208,0.4)" },
        //             { range: [6, 7], color: "rgba(213,221,212,0.3)" },
        //             { range: [7, 8], color: "rgba(240,230,215,0.3)" },
        //             { range: [8, 9], color: "rgba(225,225,225,0)" },
        //         ],
        //     }
        // }
        // ];

        // var layout2 = {
        //     width: 600, height: 450,
        //     margin: { t: 0, b: 0 },
        //     shapes: [] 
        // };
        // Plotly.newPlot('gauge', data3, layout2);
    });
};

// build demographic info/metadata for each subject
function buildDemo(sample) {
    var demo = d3.select("#sample-metadata");
    d3.json(url).then(function (data) {
        var metaData = data.metadata;
        var metaDataSample = metaData.filter(row => row.id == sample);
        demo.selectAll("p").remove();
        metaDataSample.forEach((row) => {
            for (const [key, value] of Object.entries(row)) {
                demo.append("p").text(`${key}: ${value}`);
            };
        });
    });
};

// 
function optionChanged(sample) {
    buildDemo(sample);
    buildCharts(sample);
};

// call initialize function to run
init();