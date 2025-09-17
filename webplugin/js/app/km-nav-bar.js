function KmNavBar(mckMsgLayout) {
    var _this = this;
    var appOptions = appOptionSession.getPropertyDataFromSession('appOptions') || applozic._globals;

    // Handle UI visibility based on conversation assignment
    _this.hideAndShowTalkToHumanBtn = function (conversationAssignedToHuman) {
        try {
            // if conversationAssignedToHuman is undefined need to check conversation is transferred to bot
            if (typeof conversationAssignedToHuman !== 'boolean') {
                conversationAssignedToHuman = !KommunicateUtils.isCurrentAssigneeBot();
            }
            _this.updateHeaderCTAVisibility();
            mckMsgLayout.loadDropdownOptions(conversationAssignedToHuman);

            if (!appOptions.talkToHuman) return;

            _this.modifyTalkToHumanVisibility(conversationAssignedToHuman);
        } catch (error) {
            console.error('Error =>', error);
        }
    };

    _this.updateHeaderCTAVisibility = function () {
        const shouldShowHeaderCTA =
            !KommunicateUI.isFAQPrimaryCTA() && !KommunicateUI.isShowRestartConversation();

        if (shouldShowHeaderCTA) {
            kommunicateCommons.show('.km-header-cta');
        }
    };

    _this.modifyTalkToHumanVisibility = function (isAssignedToHuman) {
        if (isAssignedToHuman) {
            const talkToHumanButton = document.getElementById('km-talk-to-human');
            if (talkToHumanButton) {
                talkToHumanButton.disabled = false;
            }
            kommunicateCommons.show('#km-talk-to-human', '.km-option-talk-to-human');
        } else if (HEADER_CTA.TALK_TO_HUMAN === appOptions.primaryCTA) {
            kommunicateCommons.hide('#km-talk-to-human');
        }
    };
}
