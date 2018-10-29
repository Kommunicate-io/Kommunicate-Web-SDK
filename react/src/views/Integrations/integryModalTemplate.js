export const integryModalHtmlContent =
`<div class="animated fadeIn dashboard-card integration-form-preview" style="border: none; display: none;">
<h2>Setup integration <a style="float: right;" href="#" onclick="cancelAddNewIntegration();" class="btn btn-primary">Cancel</a></h2>
<div id="intcontainer" class="hidden">
    <div class="wrapper">
        <a id="integrations-wrapper"></a>
        <p><%= template.template_description %></p>

        <div class="steps">
            <div class="hide"><%= integration_name_field %></div>
            <% for(var i = 0; i < steps.length; i++) {
            %>
            <div><%= steps[i].content %></div>
            <% } %>

        </div>
        <div class="footer">
            <%= footer %>
        </div>
    </div>
</div>
</div>`;

/*


`<div id="intcontainer" class="hidden"> 
<div class="wrapper"> 
<a id="integrations-wrapper-1"></a> 
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

*/ 
