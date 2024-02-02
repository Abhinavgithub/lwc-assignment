import { LightningElement, api, wire } from "lwc";
import getRecordDetail from "@salesforce/apex/QueryController.getRecordDetail";

// Import message service features required for publishing and the message channel
import { publish, MessageContext } from "lightning/messageService";
import msgService from "@salesforce/messageChannel/messageChannelName__c";
export default class RecordTile extends LightningElement {
  @api selectedRecord;
  displayRecord;
  error;

  @wire(MessageContext)
  messageContext;

  connectedCallback() {
    console.log(
      "selected record in LWC =" + JSON.stringify(this.selectedRecord)
    );
    this.getRecord(this.selectedRecord.id, this.selectedRecord.type);
  }

  handleSelectedData(event) {
    const payload = {
      recordId: this.selectedRecord.id,
      recordType: this.selectedRecord.type
    };
    publish(this.messageContext, msgService, payload);
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
