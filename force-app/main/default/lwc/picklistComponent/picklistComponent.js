import { LightningElement } from "lwc";
import getQueryRecords from "@salesforce/apex/QueryController.getQueryRecords";
export default class PicklistComponent extends LightningElement {
  searchTerm = "";
  results = [];
  selectedRecords = [];
  isLoading = false;
  showPicklist = false;
  showNorecords = false;

  handleClick(event) {
    console.log(
      "Selected Record = " + JSON.stringify(event.currentTarget.dataset)
    );
    this.selectedRecords = [
      ...this.selectedRecords,
      event.currentTarget.dataset
    ];
    //hiding the result on selecting record
    this.showPicklist = false;
    console.log(this.selectedRecords);
  }

  handleChange(event) {
    let searchTerm = event.target.value;
    console.log(searchTerm);
    if (searchTerm && searchTerm.length > 2) {
      this.searchTerm = searchTerm;
      console.log("searchTerm: " + this.searchTerm);
      this.handleSearch(this.searchTerm);
    } else {
      this.results = undefined;
      this.showPicklist = false;
      this.showNorecords = false;
      this.isLoading = false;
    }
  }
  async handleSearch(searchKey) {
    try {
      this.isLoading = true;
      let results = [];
      const getQueryResults = JSON.parse(
        await getQueryRecords({ keyword: searchKey })
      ).flat();
      getQueryResults.forEach((record) => {
        console.log("record ->" + record);
        let queryRecord = {};
        queryRecord["name"] = record.Name;
        queryRecord["id"] = record.Id;
        queryRecord["type"] = record.attributes.type;
        queryRecord[
          "icon"
        ] = `standard:${record.attributes.type.toLowerCase()}`;
        if (record.attributes.type.toLowerCase() === "account") {
          queryRecord["details"] = record.Website + " " + record.TickerSymbol;
        } else if (record.attributes.type.toLowerCase() === "contact") {
          queryRecord["details"] = record.Email + " " + record.Phone;
        } else if (record.attributes.type.toLowerCase() === "lead") {
          queryRecord["details"] = record.Title + " " + record.Company;
        }
        console.log("searched Record =" + JSON.stringify(queryRecord));
        results.push(queryRecord);
      });
      this.results = results;
      this.isLoading = false;
      console.log(`Number of records = ${results.length}`);
      if (results.length !== 0) {
        this.showPicklist = true;
        this.showNorecords = false;
      } else {
        this.showNorecords = true;
        this.showPicklist = false;
      }
      console.log(
        `showNorecords = ${this.showNorecords} ; showPicklist = ${this.showPicklist} `
      );
    } catch (error) {
      this.results = undefined;
      this.error = error;
      this.isLoading = false;
      console.log("error: " + JSON.stringify(error));
    }
  }
}