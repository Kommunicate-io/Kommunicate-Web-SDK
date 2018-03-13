module.exports={
    zendeskConfig:{
        createTicketUrl:'https://[subdomain].zendesk.com/api/v2/tickets.json',
        updateTicketUrl:"https://[subdomain].zendesk.com/api/v2/tickets/[id].json",
        password:'password',
        email:'anand@applozic.com',
        clientKey:'fSJyPncjwRpIuWSrWNPcZBqR4tspSHbUjMAWKQg9'
    },
    status:{
        open:'open', pending:'pending', hold:'hold', solved:'solved', closed:'closed'
    },
    type:{problem:'problem', incident:'incident', question:'question',task:'task'},
    priority:{urgent:'urgent', high:'high', normal:'normal', low:'low'}
}