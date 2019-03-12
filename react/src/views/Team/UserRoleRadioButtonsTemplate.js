import './team.css';
import { ROLE_TYPE, ROLE_NAME } from '../../utils/Constant';
import RadioButton from '../../components/RadioButton/RadioButton';
import CommonUtils from '../../utils/CommonUtils';
import React from "react"

const RoleContainer = props => (
    <div className="row">
        <div className="col-radio-btn col-md-2 col-lg-2"></div>
        <div className="radion-btn-agent-wrapper col-md-9 col-lg-9">
            <h5 className="radio-btn-agent-title">{ROLE_NAME[props.role].name}</h5>
            <p className="radio-btn-agent-description">{ROLE_NAME[props.role].description}</p>
        </div>
    </div>

);

const UserRoleRadioButtonsTemplate = props => (
        <div className="km-teammates-user-role-container">
            <h5 className="teammates-add-member-modal-role">Role</h5>
            <div className="teammates-add-member-modal-radio-btn-wrapper">
                <RadioButton cssClass="product product-kommunicate" idRadioButton={'teammates-admin-radio'} handleOnChange={props.handleOnChange} dataValue={ROLE_TYPE.AGENT} checked={props.selectedRole == ROLE_TYPE.AGENT} label={<RoleContainer role={ROLE_TYPE.AGENT} />} />

                <RadioButton idRadioButton={'teammates-agent-radio'} handleOnChange={props.handleOnChange} dataValue={ROLE_TYPE.ADMIN} checked={props.selectedRole == ROLE_TYPE.ADMIN} label={<RoleContainer role={ROLE_TYPE.ADMIN} />} />

                {CommonUtils.hasApplozicAccess() &&
                    <RadioButton idRadioButton={'teammates-developer-radio'} handleOnChange={props.handleOnChange} dataValue={ROLE_TYPE.DEVELOPER} checked={props.selectedRole == ROLE_TYPE.DEVELOPER} label={<RoleContainer role={ROLE_TYPE.DEVELOPER} />} />
                }

            </div>
        </div>
)
export default UserRoleRadioButtonsTemplate;