import { thirdPartyList, integryThirdPartyList } from '../Integrations/ThirdPartyList';
import React, { Component } from 'react';
import Integrations from './Integrations';
import { Link } from 'react-router-dom';
    function callbackFunc(data) { 
        //in this method you can perform integration post-save actions 
        //for example you can save bundle instance id returned in your database 
        console.log("callback 1",data); 
    } 
    function callbackFunc_Render_Integration_Row(integration) { 
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
    function callbackFunc_Render_Template_Row(template) {
        console.log("callbackFunc_Render_Template_Row")
        var img = (template.branding_app && template.branding_app.icon_url) ? template.branding_app.icon_url : 'assets/img/integry-icon.png'; 
        
        
        
        // var html = `<th scope="row" class="col-md-6">  
        //         <a class="media align-items-center" href="#"> 
        //             <img alt="Image" src="` + img + `" class="avatar rounded avatar-sm" /> 
        //             <div class="media-body"> 
        //             <span class="h6 mb-0">` + template.name + `</span> 
        //             <span class="text-muted">` + template.description + `</span> 
        //             </div> 
        //         </a> 
        //         </th> 
        //         <td> 
        //         <a href="` + template.link + `" class="btn btn-success">Add</a> 
        //         </td>`;
        let key = template.name.toLowerCase()         
        thirdPartyList[key] = {
            key: key,
            name: template.name,
            logo: img,
            subTitle: template.description,
            integrationType: 0,
            state: key+"Keys",
            // label :<Link to= {template.link} data-key = {key} className="integration-settings">Add</Link>,
            label :<a href= {template.link} data-key = {key} className="integration-settings">Add</a>,
            docsLink: "",
            domain:"",
            instructions:""
            // label :<span href= {template.link} data-key = {key} target="_blank" className="integration-settings">Add</span> 
        }
         window.dispatchEvent(new CustomEvent("kmIntegryInitilized",{detail:{"status": "success","list":thirdPartyList},bubbles: true,cancelable: true}));
        // var row = window.$kmApplozic('<tr class="bg-whiteuuyuy"/>'); 
        // row.append(window.$kmApplozic.parseHTML(html)); 
        // return row;
        return window.$kmApplozic('<tr>'); 

    }
export {callbackFunc_Render_Integration_Row, callbackFunc_Render_Template_Row }