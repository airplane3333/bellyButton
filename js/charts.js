function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("../bellyButton/js/samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("../bellyButton/js/samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
   
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("../bellyButton/js/samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var sampleData = data.samples;
    var metadata = data.metadata;
    // 3. Create a variable that holds the washing frequency.
    
    
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var sampleArray = sampleData.filter(sampleObj => sampleObj.id == sample);
    var metadataArray = metadata.filter(sampleObject => sampleObject.id == sample)
    //  5. Create a variable that holds the first sample in the array.
    var sampleResults = sampleArray[0];
    var metadataResults = metadataArray[0];
    //var PANEL = d3.select("#ChartData")
    //PANEL.html("");
    //console.log(sampleResults);
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    //Object.entries(sampleResults).forEach(([key, value]) => {
    //  PANEL.append("chartData").text(`${key.toUpperCase()}: ${value}`);
    // })  
        
    var weekFreq = metadataResults.wfreq;
    var ids = sampleResults.otu_ids;
    var labels = sampleResults.otu_labels;
    var values = sampleResults.sample_values;
    //console.log("these should be the bactiria names:  ", lables);
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    
    var yticks = ids.map(id => `OTU ${id}`).slice(0,10).reverse();
    //console.log(yticks);
    //console.log(yticks);
    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: values,
      y: yticks,
      type: "bar",
      orientation: "h"
    }];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria found ",
      xaxis: {title:"Bacteria Values"},
      yaxis: {title: "otu_ids"}
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar" , barData , barLayout)

    // Bar and Bubble charts
    // 1. Create the trace for the bubble chart.
    var sizeMarker = values //.slice(0,10);
    var maxMarker = 200
    
    var bubbleData = [{
        x: ids, 
        y: values, 
        text: labels,
        mode: 'markers',
        marker: {
          colorscale: 'Electric',
          type: 'heatmap',
          color: ids, //['rgb(93, 164, 214)', 'rgb(255, 144, 14)',  'rgb(44, 160, 101)', 'rgb(255, 65, 54)'],
          size: sizeMarker,
          text: labels,
          //sizeref: 2.0 * Math.max(sizeMarker) / (maxMarker**2),
          //sizemode: 'area'
          }
        
      }];
       
      // 2. Create the layout for the bubble chart.
      var bubbleLayout = {
        title: "Top 10 Bacteria found ",
        xaxis: {title:"otu_ids"},
        yaxis: {title: "Bacteria Values"},
        hovermode: 'x unified',
      };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble" , bubbleData, bubbleLayout); 

     // 4. Create the trace for the gauge chart.
     var gaugeData = [{
      domain: { x: [0, 1], y: [0, 1] },
      value: weekFreq,
      title: { text: "<b>Belly Button Washing Frequency</b><br><b>Scrubs per Week</b>" },
      type: "indicator",
      mode: "gauge+number",
      delta: {'reference': 10},
      gauge: {'axis': {'range': [0, 10], "tickcolor": "black"},
              "bar" : {"color" : "black"}, 
              'steps' : [{'range': [0, 2], 'color': "red"},
                         {'range': [2, 4], 'color': "orange"},
                         {'range': [4, 6], 'color': "yellow"},
                         {'range': [6, 8], 'color': "lightgreen"},
                         {'range': [8, 10], 'color': "green"},
                        ]}
     }];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 600, height: 500, margin: { t: 0, b: 0 }
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge" , gaugeData , gaugeLayout);
  });
};
