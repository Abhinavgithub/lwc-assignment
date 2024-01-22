/**
 * @description       : To fetch records from objects and pass to LWC
 * @author            : Abhinav Singh
 * @group             : 
 * @last modified on  : 01-21-2024
 * @last modified by  : Abhinav Singh
**/
public with sharing class QueryController {
    @AuraEnabled(cacheable=true)
    public static String getQueryRecords(String keyword){
        try {
            List<List<SObject>> searchList = [
            FIND :keyword
            IN NAME FIELDS
            RETURNING Account(Name,Industry,AccountNumber), Contact(Name,Email,Phone), Lead(Name,Rating,Status)
            ];
        return JSOn.serialize(searchList);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }  
}