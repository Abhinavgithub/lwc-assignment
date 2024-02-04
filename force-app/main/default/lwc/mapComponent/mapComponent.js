import { LightningElement, wire } from "lwc";
import {
  subscribe,
  APPLICATION_SCOPE,
  MessageContext
} from "lightning/messageService";
import msgService from "@salesforce/messageChannel/messageChannelName__c";
import getAddress from "@salesforce/apex/QueryController.getAddress";

export default class MapComponent extends LightningElement {
  recordId;
  recordType;
  latitude;
  longitude;
  mapMarkers;
  isMap = false;
  error;
  @wire(MessageContext)
  messageContext;

  subscribeToMessageChannel() {
    if (!this.subscription) {
      this.subscription = subscribe(
        this.messageContext,
        msgService,
        (message) => this.handleMessage(message),
        { scope: APPLICATION_SCOPE }
      );
    }
  }

  connectedCallback() {
    this.subscribeToMessageChannel();
  }

  handleMessage(message) {
    this.recordId = message.recordId;
    this.recordType = message.recordType;
    this.getMapAddress(this.recordId, this.recordType);
  }

  async getMapAddress(recordId, recordType) {
    try {
      console.log(`recordId = ${recordId}  recordType= ${recordType}`);
      const address = await getAddress({
        recordId: recordId,
        type: recordType
      });
      console.log(`address = ${address}`);
    } catch (error) {
      this.error = error;
      console.log(`Error => ${error}`);
    }
  }
}
