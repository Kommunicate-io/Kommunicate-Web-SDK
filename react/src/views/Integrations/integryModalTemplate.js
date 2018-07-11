export const integryModalHtmlContent =`<div id="intcontainer" class="hidden"> 
<div class="wrapper"> 
<a id="integrations-wrapper"></a> 
<p> 
    <%= template.template_description %> 
</p> 
<div class="steps"> 
    <div class="hide"> 
    <%= integration_name_field %> 
    </div> 
    <% for(var i = 0; i < steps.length; i++) { 
        %> 
    <div> 
        <%= steps[i].content %> 
    </div> 
    <% } %> 
</div> 
<div class="footer"> 
    <%= footer %> 
</div> 
</div> 
</div>`

