import { LightningElement, api } from "lwc";
import getRecordDetail from "@salesforce/apex/QueryController.getRecordDetail";

export default class RecordTile extends LightningElement {
  @api selectedRecord;
  displayRecord;
  error;

  connectedCallback() {
    console.log(
      "selected record in LWC =" + JSON.stringify(this.selectedRecord)
    );
    this.getRecord(this.selectedRecord.id, this.selectedRecord.type);
  }

  async getRecord(recordId, recordType) {
    try {
      console.log(`recordId = ${recordId} recordType = ${recordType}`);
      const record = await getRecordDetail({
        recordId: recordId,
        type: recordType
      });
      console.log(`Record = ${record}`);
      let fields = [];
      let parsedRecord = JSON.parse(record);
      for (var key in parsedRecord) {
        console.log(`key = ${key} value = ${parsedRecord[key]}`);
        if (key != "attributes") {
          fields.push({ label: key, value: parsedRecord[key] });
        }
      }
      this.displayRecord = {
        fields: fields,
        type: recordType,
        icon: `standard:${recordType.toLowerCase()}`
      };
    } catch (error) {
      this.displayRecord = false;
      this.error = error;
      console.log(`Error => ${error}`);
    }
  }
}
