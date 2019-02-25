import ZendeskLogo from '../../views/Integrations/images/zendesk.png';
import AgilecrmLogo from '../../views/Integrations/images/agilecrm.png';
import {integration_type} from '../../views/Integrations/ThirdPartyList'
export let thirdPartyList = [
    {
        name: "Zendesk",
        logo: ZendeskLogo,
        type:integration_type.ZENDESK
    },
    {
        name: "Agile CRM",
        logo: AgilecrmLogo,
        type: integration_type.AGILE_CRM
    }
]