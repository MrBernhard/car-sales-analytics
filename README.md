# 🚗 Car sales analytics project (descriptive)
The idea of this project came from a discussion with some friends in which we were trying to understand how the sales of Chinese brands' cars in Mexico were increasing compared to other brands, as well as which was the main driver for the consumer to prefer one brand over another.

From this idea, I split the project into the following stages, to make it easier to work on without losing focus:
- [x] Data aquisition
- [x] Data visualization
- [x] Data analysis

## 📡 Data Aquisition
For this stage, I started looking for already created datasets that I could ingest into a Jupyter notebook, either through API requests or through CSV upload. However, I found some roadblocks like:
- Data not being up to date
- Data blocked behind paywall

However, after performing some extensive research, I found the [MarkLines website](https://www.marklines.com/en/) which provides useful data regarding vehicle sales (2013-2024) under a freemium schema, but only through an HTML table. Therefore, I decided to write some JS code to read the data on the corresponding HTML table and transform it into an array of JSON objects, which then was exported into a CSV with which I could work later.

### Problem resolution proccess
The HTML table had the following structure:

---

<img width="1118" alt="HTML_table_structure" src="https://github.com/user-attachments/assets/1911a235-f6d6-4fba-be5a-b0df8c8ac0b6" />

---

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

---

<img width="1005" alt="CSV_table_structure" src="https://github.com/user-attachments/assets/4657a19b-e700-4e0e-b401-2a9a0ee8b91e" />

---

> [!NOTE]
> To view the full code, please refer to [table_scraper.js](JS_Data_Scraper/table_scraper.js)

## 📊 Data Visualization

Once the CSV file was ready, I decided to follow an alternative path to visualize the data. So, instead of loading it into a Jyputer notebook using Python, I used [Google Looker Studio](https://lookerstudio.google.com/overview), since it is a free, online-based visual analytics platform that allows the user to create data visualizations to get insights.

It is important to highlight that when the data was imported, some calculated fields needed to be added to clean the data and augment the data to provide more complex functionalities. The following list summarizes the calculated fields that where added and how they were programmed:

- `Powertrain_Type`
  - The "Powertrain" column on the dataset had several rows with a value equal to "N/A" for Internal Combustion Vehicles (ICVs), therefore, the following `IF` fomula was used to assign them the adequate value
```
IF(Powertrain = "N/A", "ICE", Powertrain)
```
- `Powertrain_Group`
  - This calculated field was created using both, a `CASE` and a `REGEXP` function, to allow the "Scorecard" chart to correctly sum the total sales of the 2 major powertrain groups (Clean Energy Vehicles (CEVs) and ICVs), in combination of a filter embedded in the chart.
```
CASE
  WHEN REGEXP_CONTAINS(Powertrain_Type, "(?i)HV|EV|FCV") THEN "CEVs"
  ELSE "ICVs"
END
```  
- `Filter_By_Powertrain`
  - This calculated field was created combining a boolean parameter `ONLY Clean Energy Vehicles`, as well as a filter embedded in the desired charts and controls, and both a `CASE` and a `REGEXP` function to allow the dashboard to only display the data corresponding to the CEVs when checking a checkbox control, and display all the data when unchecking it.
```
CASE
  WHEN ONLY Clean Energy Vehicles = FALSE THEN TRUE
  WHEN REGEXP_CONTAINS(Powertrain_Type, "(?i)HV|EV|FCV") THEN TRUE
  ELSE FALSE
END
```
- `Filter_By_Chnese_Brands`
  - This calculated field uses the same approach as `Filter_By_Powertrain`, created combining a boolean parameter `ONLY Chinese Bramds`, as well as a filter embedded in the desired charts and controls, and both a `CASE` and a `REGEXP` function to allow the dashboard to only display the data corresponding to the Chinese brands when checking a checkbox control, and display all the data when unchecking it.
```
CASE
  WHEN ONLY Chinese Brands = FALSE THEN TRUE
  WHEN REGEXP_CONTAINS(Group, "(?i)SAIC|Anhui|Chery|Changan|GWM|BAIC|Jiangling|Yutong|Jiangling|Seres|Geely") THEN TRUE
  ELSE FALSE
END
```
---

![Dashboard_Snapshot_3](https://github.com/user-attachments/assets/050cc7fd-799d-4aa4-9299-5f5b0d41ac77)

---

> [!NOTE]
> To access the full dashboard, please go to https://lookerstudio.google.com/reporting/bb0b17cc-ca68-4481-963b-9c1868d82856

## ⚙️ Data Analysis

After completing the previous dashboard, it was identified that overall the Clean Energy Vehicles' (CEVs) sales were increasing in the past years, and my hypothesis is that these technologies still require more work both, on the vehicles and the public infrastructure, to catch the interest of the buyers in the North America region.

On the other hand, it was identified that the Chinese brands have increased significantly their sales in Mexico with ~435K units, from which 96% correspond to ICVs and the rest to CEVs. In addition, it was identified that the brand "MG" is the current sales leader, followed by "JAC" and "Chery".

---

![Chinese_brands_in_Mexico_snapshot](https://github.com/user-attachments/assets/afda42f8-cc36-46b4-b240-d5040007b675)

---

Finally, it was identified that to fulfill the second project objective, which is:
> [...] identify the main driver for the consumer to prefer one brand over another


More data is required in our dataset, specifically consumer ratings/comments regarding car specifications like features, interior design, exterior design, space, comfort, performance, fuel-economy, price, availability, etc.

## ➡️ Next Steps

To fulfill the second project objective and continue with the development of this project, the planned next steps would be:
- [ ] Find a source that provides data corresponding to consumer ratings/comments regarding car specifications like features, interior design, exterior design, space, comfort, performance, fuel-economy, price, availability, etc.
- [ ] Create a new dashboard page and perform a diagnostic analysis to validate potential relationships exist between the consumer ratings/comments, and the sales volume of the years with available data (2013 - 2024)
- [ ] If a significant relationship exist between the consumer perception of the car and its sales volume in a specific country/region, use the corrresponding data to train an appropiate AI model capable of providing the probability of a new car of being purchased by the customers in this specific country/region.

