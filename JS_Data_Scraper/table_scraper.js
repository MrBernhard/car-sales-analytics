/**
      ____ 
     /___/\_ 
    _\   \/_/\__ 
  __\       \/_/\ 
  \   __    __ \ \ 
 __\  \_\   \_\ \ \ 
/_/\\   __   __  \ \_/_/\ 
\_\/_\__\/\__\/\__\/_\_\/ 
   \_\/_/\       /_\_\/ 
      \_\/       \_\/ 

* Reusable Function definition
*/

/** JSON array >> CSV converter and exporter */
function exportToCSV(data, filename) {
    if (!data.length) return;
  
    let headers = ["Country", "Group", "Brand", "Type", "Segment", "Model", "Powertrain", "Year", "Sales"];
  
    let csvContent = [
      headers.join(","), // CSV header
      ...data.map(row =>
        headers.map(field => {
          let value = row[field] ?? "";
          // Escape quotes and wrap value
          let escaped = String(value).replace(/"/g, '""');
          return `"${escaped}"`;
        }).join(",")
      )
    ].join("\n");
  
    let blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    let url = URL.createObjectURL(blob);
    let link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  
/**
      ____ 
     /___/\_ 
    _\   \/_/\__ 
  __\       \/_/\ 
  \   __    __ \ \ 
 __\  \_\   \_\ \ \ 
/_/\\   __   __  \ \_/_/\ 
\_\/_\__\/\__\/\__\/_\_\/ 
   \_\/_/\       /_\_\/ 
      \_\/       \_\/ 

* Main routine
*/

/** Declare output variable */
let results = [];

/** Declare aggregation fields */
let currentCountry = "";
let currentGroup = "";
let currentBrand = "";
let currentType = "";
let currentSegment = "";
let currentModel = "";

/** Retrieve all rows based on <<powertrain>> fields, since it appears on every row without aggregation */
let rows = Array.from(document.querySelectorAll("tr")).filter(tr =>
  tr.querySelector("th.aggregate_row_header")
);

/** For each row, select all the <<th>> tags which contain data for all columns, except sales numbers */
rows.forEach(tr => {
  let ths = tr.querySelectorAll("th");

  /** Update current aggregation fields */ 
  ths.forEach(th => {
    if (th.classList.contains("level-0")) currentCountry = th.textContent.trim();
    if (th.classList.contains("level-1")) currentGroup = th.textContent.trim();
    if (th.classList.contains("level-2")) currentBrand = th.textContent.trim();
    if (th.classList.contains("level-3")) currentType = th.textContent.trim();
    if (th.classList.contains("level-4")) currentSegment = th.textContent.trim();
    if (th.classList.contains("level-5")) currentModel = th.textContent.trim();
  });

  let powertrain = tr.querySelector("th.aggregate_row_header");
  let salesCols = tr.querySelectorAll("td.aggregate_column");

  if (!powertrain || salesCols.length === 0) return;

  let baseData = {
    Country: currentCountry,
    Group: currentGroup,
    Brand: currentBrand,
    Type: currentType,
    Segment: currentSegment,
    Model: currentModel,
    Powertrain: powertrain.textContent.trim()
  };

  /** Normalize each year's sales into its own record */
  let years = Array.from({ length: 12 }, (_, i) => 2013 + i);

  years.forEach((year, index) => {
    let raw = salesCols[index]?.textContent.trim().replace(/,/g, "") || "";
    let sales = parseFloat(raw);
    results.push({
      ...baseData,
      Year: year.toString(),
      Sales: isNaN(sales) ? 0 : sales
    });
  });
});

/** Run the corresponding function to export the array of JSON as a CSV file */

exportToCSV(results,"all_vehicle_sales.csv");
