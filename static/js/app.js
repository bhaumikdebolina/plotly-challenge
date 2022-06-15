
// // URL containing data
url = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json';

function init() {
   // Fetch dropdown select element
   let dropdown = d3.select("#selDataset");
 
   // Use the list of sample names to populate the select options
   d3.json(url).then((data) => {
     let sampleNames = data.names;
 
     sampleNames.forEach((sample) => {
       dropdown
         .append("option")
         .text(sample)
         .property("value", sample);
     });
 
     // Use the first sample from the list to build the initial plots
     let first_id = "940";
     createCharts(first_id);
     createSummary(first_id);
   });
 }
 
 function optionChanged(newID) {
   // Fetch new data each time a new sample is selected
     createCharts(newID);
     createSummary(newID);
 };

function createSummary(sample) {
   d3.json(url).then((data) => {
     let metadata = data.metadata;
     // Filter the data for the object with the desired sample number
     let resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
     let result = resultArray[0];
     // Use d3 to select the panel with id of `#sample-metadata`
     let dropdown = d3.select("#sample-metadata");
 
     // Use `.html("") to clear any existing metadata
     dropdown.html("");
 
     // Use `Object.entries` to add each key and value pair to the panel
     // Hint: Inside the loop, you will need to use d3 to append new
     // tags for each key-value in the metadata.
     Object.entries(result).forEach(([key, value]) => {
       dropdown.append("h6").text(`${key.toUpperCase()}: ${value}`);
     });
 
     
   });
 }
 
 function createCharts(sample) {
   d3.json(url).then((data) => {
     let samples = data.samples;
     let resultArray = samples.filter(sampleObj => sampleObj.id == sample);
     let result = resultArray[0];
 
     let otu_ids = result.otu_ids;
     let otu_labels = result.otu_labels;
     let sample_values = result.sample_values;
 
     // Build a Bubble Chart
     let bubbleLayout = {
       title: "Belly Button Samples",
       xaxis: { title: "OTU IDs" },
       yaxis: { title: "Sample Values" }
     };
     let bubbleData = [
       {
         x: otu_ids,
         y: sample_values,
         text: otu_labels,
         mode: "markers",
         marker: {
           size: sample_values,
           color: otu_ids,
           
         }
       }
     ];
 
     Plotly.newPlot("bubble", bubbleData, bubbleLayout);
 
     let yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
     let barData = [
       {
         y: yticks,
         x: sample_values.slice(0, 10).reverse(),
         text: otu_labels.slice(0, 10).reverse(),
         type: "bar",
         orientation: "h",
       }
     ];
 
     let barLayout = {
       title: "Top 10 Microbial Species in Belly Buttons",
       xaxis: { title: "Bacteria Sample Values" },
       yaxis: { title: "OTU IDs" }
     };
 
     Plotly.newPlot("bar", barData, barLayout);
   });
 }
 
 
 
 // Initialize the dashboard
 init();