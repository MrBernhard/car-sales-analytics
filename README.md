# 🚗 Car sales analytics project (descriptive)
The idea of this project came from a discussion with some friends in which we were trying to understand how the sales of Chinese brands' cars in Mexico were increasing compared to other brands, as well as which was the main driver for the consumer to prefer one brand over another.

From this idea, I split the project into the following stages, to make it easier to work on without losing focus:
- [x] Data aquisition
- [x] Data visualization
- [ ] Data analysis

## 📡 Data Aquisition
For this stage, I started looking for already created datasets that I could ingest into a Jupyter notebook, either through API requests or through CSV upload. However, I found some roadblocks like:
- Data not being up to date
- Data blocked behind paywall

However, after performing some extensive research, I found the [MarkLines website](https://www.marklines.com/en/) which provides useful data regarding vehicle sales (2013-2024) under a freemium schema, but only through an HTML table. Therefore, I decided to write some JS code to read the data on the corresponding HTML table and transform it into an array of JSON objects, which then was exported into a CSV with which I could work later.

### Problem resolution proccess
The HTML table had the following structure:

<img width="1118" alt="HTML_table_structure" src="https://github.com/user-attachments/assets/1911a235-f6d6-4fba-be5a-b0df8c8ac0b6" />


Which was not adequate to copy-paste on an Excel document to save it as CSV. Therefore, the corresponding HTML structure was analyzed and it was identified that each data row was organized in `<tr>` tags, within which the values for the columns "Country","Group","Brand","Type","Segment","Model","Powertrain" were stored in `<th>` tags, and the sales values for each year (2013 - 2024) were stored in `<td>` tags.

However, only the first rows for each aggregation group had the name/value corresponding to the group, and the rest of the rows only had the names/values for the "Powertrain" and the sales per year. Therefore, it was determined that variables should be used to store these aggregation groups' names to be used on each row iteration, and they should be updated as soon as new aggregation group names were available.

Finally, since the sales per year data was stored in columns, it was transformed into one row per year to facilitate the further analysis, resulting in the following data structure:

```
[
  {
    "Country": "Country_1",
    "Group": "Group_1",
    "Brand": "Brand_1",
    "Type": "Type_1",
    "Segment": "Segment_1",
    "Model": "Model_1",
    "Powertrain": "Powertrain_1",
    "Year": "2013",
    "Sales": 12345
  },
  {
    "Country": "Country_1",
    "Group": "Group_1",
    "Brand": "Brand_1",
    "Type": "Type_1",
    "Segment": "Segment_1",
    "Model": "Model_1",
    "Powertrain": "Powertrain_1",
    "Year": "2014",
    "Sales": 67890
  }
]
```
Which was then converted into a comma-saparated format by iterating over each object, and exported as a CSV file with the following structure:


<img width="1005" alt="CSV_table_structure" src="https://github.com/user-attachments/assets/4657a19b-e700-4e0e-b401-2a9a0ee8b91e" />


> [!NOTE]
> To view the full code, please refer to [table_scraper.js](JS_Data_Scraper/table_scraper.js)

## 📊 Data Visualization

Once the CSV file was ready, I decided to follow an alternative path to visualize the data. So, instead of loading it into a Jyputer notebook using Python, I used [Google Looker Studio](https://lookerstudio.google.com/overview), since it is a free, online-based visual analytics platform that allows the user to create data visualizations to get insights.


![Dashboard_Snapshot](https://github.com/user-attachments/assets/3a5080c9-807b-4cce-acbe-5fcd088a3104)


> [!NOTE]
> To access the full dashboard, please go to https://lookerstudio.google.com/reporting/bb0b17cc-ca68-4481-963b-9c1868d82856

## ⚙️ Data Analysis
