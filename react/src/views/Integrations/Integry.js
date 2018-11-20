import { thirdPartyList, integryThirdPartyList } from '../Integrations/ThirdPartyList';
import React, { Component } from 'react';
import Integrations from './Integrations';
import { Link } from 'react-router-dom';
import CommonUtils from '../../utils/CommonUtils';
import { createIntegrySubscription } from '../../utils/kommunicateClient'
//import {sha256} from 'crypto-js/sha256'
import CryptoJS from 'crypto-js'

const INTEGRY_CONFIG = {
    appKey:"6ab3030f-cbcc-40c0-9e89-7bf33e71a4da", // provided by Integry
    appSecret: "aca6df89-4f9a-4d43-84cf-7199d6665ede", // provided by Integry
    bundleId:"32", // from integry dashboard.

}
function initilizeIntegry(settings) {
    if(typeof settings !='object'){
      return;  
    }    
    window.integryAppSDK.load({
        app_key: INTEGRY_CONFIG.appKey,
        user_id: settings.applicationId,  // customer_Id kommunicate.  use applicationId here to share the integration with all agents within application 
        hash : CryptoJS.HmacSHA256(settings.applicationId,INTEGRY_CONFIG.appSecret),
        bundle_id :INTEGRY_CONFIG.bundleId,
        bundle_instance_id: "",
        callback: integrationSuccessCallback,
        callback_render_integration_row: renderIntegrationRowCallback,
        callback_render_template_row: renderTemplateRowCallback,
        render_templates_container: 'templates',
        render_integrations_container: 'integrations',
        x_integry_configs: {
            view_container: 'intcontainer',
            view_url: '',
            app_auth: {
               // api_key: 'c690bd29-7987-4e02-8c34-09a1547477f8' // Kommunicate API key for customer. this wiil be used to access the kommunicate APIs from integry   
               "api_key":  settings.apiKey|| "OTTHTvrCRR72YW93XlasZxa9UXHd9Mjx"
            }
        },
        x_custom_variables: {
           // "application_id": "23cab6b8b34de229c0aaa6add5dfc4f78"
           "application_id": settings.applicationId
        }
    });
}

function integrationSuccessCallback(data) {
    // callback when integration process is finished. will be called when use click on the save button in template form.
    //in this method you can perform integration post-save actions 
    //for example you can save bundle instance id returned in your database 
   console.log("integration data ",data);
   let subscriptionData = {
       platform:"integry",
       integrationName:"pipedrive",
       eventType:"1", // user created 
       triggerUrl:data.endpoint
   }

   createIntegrySubscription(subscriptionData).then(response => {
    console.log("db updated", response)
   })
   .catch( err => {
       console.log(err)
   })
   closeIntegrationPreview();
}


function renderIntegrationRowCallback (integration) {
    // not sure if it is in use. check it 
     // console.log("callbackFunc_Render_Integration_Row")
        // var status_link = (integration.status === 'ACTIVE') ? integration.disable_link : integration.enable_link; 
        // var status_op = (integration.status === 'ACTIVE') ? 'disable' : 'enable'; 
        // var status_text = (integration.status === 'ACTIVE') ? 'Disable' : 'Enable'; 
        // var html = `<th scope="row" class="col-md-6">  
        //             <a class="media align-items-center" href="#">  
        //             <div class="media-body"> 
        //                 <span class="h6 mb-0">` + integration.name + `</span> 
        //             </div> 
        //             </a> 
        //         </th> 
        //         <td> 
        //             <a href="`+ integration.link + `" class="btn btn-success">Edit</a> 
        //         </td> 
        //         <td> 
        //             <a href="` + status_link + `" data-op="`+ status_op + `" class="btn btn-warning">` + status_text + `</a> 
        //         </td>  
        //         <td>  
        //             <a href="` + integration.delete_link + `" data-op="delete" class="btn btn-danger">Delete</a> 
        //         </td>`; 


        // var row = window.$kmApplozic('<tr class="bg-white"/>'); 
        // row.append(window.$kmApplozic.parseHTML(html)); 
        // return row; 
}   

function renderTemplateRowCallback(template) {
    // it will render the template list(available application list for integration) in the page.  

        var img = (template.branding_app && template.branding_app.icon_url) ? template.branding_app.icon_url : 'assets/img/integry-icon.png'; 
        let key = template.name.toLowerCase()         
        thirdPartyList[key] = {
            key: key,
            name: template.name,
            logo: img,
            subTitle: template.description,
            integrationType: 0,
            state: key+"Keys",
            // label :<Link to= {template.link} data-key = {key} className="integration-settings">Add</Link>,
            
            // label :<span  data-key = {key} className="integration-settings" onClick ={ function(e){addNewIntegration(template.id);e.preventDefault();e.stopPropagation();}}>Add</span>,
            
            label :"Add",
            
            docsLink: "",
            domain:"",
            instructions:["instruction1","instruction 2"],
            source:"integry",
            templateId:template.id,
            // label :<span href= {template.link} data-key = {key} target="_blank" className="integration-settings">Add</span> 
        }
        CommonUtils.triggerCustomEvent("kmIntegryInitilized",{detail:{"status": "success","list":thirdPartyList},bubbles: true,cancelable: true});
        return window.$kmApplozic('<tr>'); 
}
function addNewIntegration(templateId) {
    window.$kmApplozic(".integration-form-preview").show();
    window.integryAppSDK.renderTemplateForm(templateId);
}
function closeIntegrationPreview() {
    window.$kmApplozic(".integration-form-preview").hide(); 
}

export { 
    initilizeIntegry,
    addNewIntegration 
}