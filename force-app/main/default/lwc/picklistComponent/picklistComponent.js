import { LightningElement } from "lwc";
import getQueryRecords from "@salesforce/apex/QueryController.getQueryRecords";
export default class PicklistComponent extends LightningElement {
  searchTerm = "";
  results = [];
  isLoading = "false";
  showPicklist = "false";

  handleChange(event) {
    let searchTerm = event.target.value;
    console.log(searchTerm);
    if (searchTerm && searchTerm.length > 2) {
      this.searchTerm = searchTerm;
      console.log("searchTerm: " + this.searchTerm);
      this.handleSearch(this.searchTerm);
    } else {
      this.results = undefined;
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
          queryRecord["details"] = record.Industry + " " + record.AccountNumber;
        } else if (record.attributes.type.toLowerCase() === "contact") {
          queryRecord["details"] = record.Email + " " + record.Phone;
        } else if (record.attributes.type.toLowerCase() === "lead") {
          queryRecord["details"] = record.Rating + " " + record.Status;
        }
        console.log("searched Record =" + JSON.stringify(queryRecord));
        results.push(queryRecord);
      });
      this.results = results;
      this.isLoading = false;
      this.showPicklist = true;
    } catch (error) {
      this.results = undefined;
      this.error = error;
      this.isLoading = false;
      console.log("error: " + JSON.stringify(error));
    }
  }
}
