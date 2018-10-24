exports.KOMMUNICATE_SUBSCRIPTION = {
    STARTUP:'startup',
    
    PER_AGENT_YEARLY :'per_agent_yearly',
    PER_AGENT_MONTHLY:'per_agent_monthly',

    ENTERPRISE_YEARLY:'enterprise_yearly',
    ENTERPRISE_MONTHLY:'enterprise_monthly',
    
    EARLY_BIRD_MONTHLY:'early_bird_monthly',
    EARLY_BIRD_YEARLY:'early_bird_yearly',
    
    GROWTH_MONTHLEY: 'growth_monthly'
    
}


exports.getApplozicPackage = (kommunicateSubscription)=>{
    switch(kommunicateSubscription){
        case this.KOMMUNICATE_SUBSCRIPTION.STARTUP:
            return 101;

        case this.KOMMUNICATE_SUBSCRIPTION.PER_AGENT_MONTHLY:
            return 102;
        case this.KOMMUNICATE_SUBSCRIPTION.PER_AGENT_YEARLY:
            return 103
        case this.KOMMUNICATE_SUBSCRIPTION.GROWTH_MONTHLEY:
            return 104;
        case this.KOMMUNICATE_SUBSCRIPTION.ENTERPRISE_MONTHLY:    
            return 105;
        case this.KOMMUNICATE_SUBSCRIPTION.ENTERPRISE_YEARLY:
            return 106;
        case this.KOMMUNICATE_SUBSCRIPTION.EARLY_BIRD_MONTHLY:
            return 107;
        case this.KOMMUNICATE_SUBSCRIPTION.EARLY_BIRD_YEARLY:
            return 108;
        default:
            return "";
    }

}






