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
  isLoading = false;
  error;
  zoom = "18";
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
      this.isLoading = true;
      let city, country, postalCode, state, street = null;
      console.log(`recordId = ${recordId}  recordType= ${recordType}`);
      const address = JSON.parse(await getAddress({
        recordId: recordId,
        type: recordType
      }));
      console.log(`address = ${JSON.stringify(address)}`);
      if (address.attributes.type == 'Contact') {
        city = address.MailingAddress.city;
        country = address.MailingAddress.country;
        postalCode = address.MailingAddress.postalCode;
        state = address.MailingAddress.state;
        street = address.MailingAddress.street;
      }
      console.log(`${street} ${city} ${state} ${postalCode} ${country}`);

      var requestOptions = {
        method: 'GET',
      };
      fetch(`https://api.geoapify.com/v1/geocode/search?text=${street} ${city} ${state} ${postalCode} ${country}&apiKey=8c64e7d0ddb446438ff13248172b3dcb`, requestOptions)
        .then(response => response.json())
        .then(result => { console.log(result);          
          this.latitude = result.features[0].properties.lat;
          this.longitude = result.features[0].properties.lon;
          this.mapMarkers = [
            {
                location: {
                    Latitude: this.latitude,
                    Longitude: this.longitude,
                },
            },            
        ];
        this.isLoading = false;        
        this.isMap = true;  
        console.log(`${this.latitude} ${this.longitude}`);
         })
        .catch(error => console.log('error', error));
    } catch (error) {
      this.error = error;
      console.log(`Error => ${error}`);
    }
  }
}