/**
 * @description       : To fetch records from objects and pass to LWC
 * @author            : Abhinav Singh
 * @group             : 
 * @last modified on  : 01-28-2024
 * @last modified by  : Abhinav Singh
**/
public with sharing class QueryController {
    @AuraEnabled(cacheable=true)
    public static String getQueryRecords(String keyword){
        try {
            List<List<SObject>> searchList = [
            FIND :keyword
            IN NAME FIELDS
            RETURNING Account(Name,Website,TickerSymbol), Contact(Name,Email,Phone), Lead(Name,Company,Title)
            ];
        return JSOn.serialize(searchList);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    
    @AuraEnabled(cacheable=true)
    public static string getRecordDetail(String recordId, String type){
        SObject record;
        try {
            switch on type {
                when  'Account'{
                    record = [SELECT Id, Name, Website, TickerSymbol FROM Account WHERE Id = :recordId with USER_MODE];
                }
                when  'Contact'{
                    record = [SELECT Id, Name, Email, Phone FROM Contact WHERE Id = :recordId with USER_MODE];
                }
                when  'Lead'{
                    record = [SELECT Id, Name, Company, Title FROM Lead WHERE Id = :recordId with USER_MODE];
                }
                when else {
                    System.debug('No records found');
                }
            }
            return JSON.serialize(record);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}