import React, { Component } from 'react';
import { ROLE_TYPE } from '../../utils/Constant';
import StatusIcon from '../../components/StatusIcon/StatusIcon'
class invitedUsersList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      index: this.props.index,
      modalIsOpen: false,
    };
    this.onOpenModal = this.onOpenModal.bind(this);
    this.onCloseModal = this.onCloseModal.bind(this);
  }

  onOpenModal = (e) => {
    this.setState({
      modalIsOpen: true
    });
  };

  onCloseModal = () => {
    this.setState({ modalIsOpen: false });
  };
  render() {
    var index = this.props.index;
    var loggedInUserRoleType = this.props.loggedInUserRoleType;
    var deleteRef = "delete" + index;
    let roleType = this.props.user.roleType;
    var emailId = this.props.user.userId;
    let status = this.props.user.status
    return (
      <tr className="team-data-allign team-invite" >
        <td>
          <StatusIcon label={"Invitaton sent"} indicator={"done"} />
        </td>
        <td>
          <div className="km-truncate">{emailId}</div>
          <div className="small text-muted">
          </div>
        </td>
        <td>
          {roleType == ROLE_TYPE.ADMIN &&
            <div className="teammates-user-role tm-invite-user-role">Admin</div>
          }
          {roleType == ROLE_TYPE.AGENT &&
            <div className="teammates-user-role tm-invite-user-role">Agent</div>
          }
        </td>
        <td>
          <span className="tm-invite-status-havent-signed-up">Haven't signed up</span>
        </td>

        <td className="teammates-delete-icon team-invite-list-delete"  >
          <span onClick={this.onOpenModal} data-index={deleteRef} className="teammates-delete-wrapper n-vis">
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="12" viewBox="0 0 10 12">
              <g fill="#8B8888" fillRule="nonzero">
                <path d="M.357 2.5a.357.357 0 0 1 0-.714h9.286a.357.357 0 1 1 0 .714H.357zM5.357 8.929a.357.357 0 1 1-.714 0v-5a.357.357 0 0 1 .714 0v5zM3.928 8.903a.357.357 0 1 1-.713.051l-.357-5a.357.357 0 0 1 .713-.05l.357 5zM6.785 8.954a.357.357 0 1 1-.713-.05l.357-5a.357.357 0 1 1 .713.05l-.357 5z" />
                <path d="M3.214 2.143a.357.357 0 1 1-.714 0v-.714C2.5.837 2.98.357 3.571.357H6.43C7.02.357 7.5.837 7.5 1.43v.714a.357.357 0 1 1-.714 0v-.714a.357.357 0 0 0-.357-.358H3.57a.357.357 0 0 0-.357.358v.714z" />
                <path d="M.716 2.173a.357.357 0 0 1 .355-.387H8.93c.209 0 .373.178.355.387l-.66 7.916c-.046.555-.51.982-1.067.982H2.443a1.071 1.071 0 0 1-1.068-.982l-.66-7.916zm.744.327l.627 7.53c.015.185.17.327.356.327h5.114c.186 0 .34-.142.356-.327L8.54 2.5H1.46z" />
              </g>
            </svg>
            Delete
                        </span>
        </td>
      </tr>
    );
  }
}


export default invitedUsersList;
