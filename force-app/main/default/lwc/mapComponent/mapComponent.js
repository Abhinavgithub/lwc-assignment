import { LightningElement, wire } from "lwc";
import {
  subscribe,
  unsubscribe,
  APPLICATION_SCOPE,
  MessageContext
} from "lightning/messageService";
import msgService from "@salesforce/messageChannel/messageChannelName__c";

export default class MapComponent extends LightningElement {
  recordId;
  recordType;
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
  }
}
