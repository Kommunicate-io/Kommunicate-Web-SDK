import React from "react";
import LocationIcon from "./Icons/location.png";
import DomainIcon from "./Icons/web-icon.png";
import FacebookIcon from "./Icons/facebook-icon.png";
import CrunchbaseIcon from "./Icons/crunchbaseIcon-icon.png";
import TwitterIcon from "./Icons/twitter-icon.png";
import LinkedinIcon from "./Icons/linkedin-icon.png";

function ClearBitInfo(props) {
    const userDetail = props.userDetail;
    const userInfo = {
        fullName: userDetail.person.name ? userDetail.person.name : "",
        bio: userDetail.person.bio ? userDetail.person.bio : "",
        location: userDetail.person.location ? userDetail.person.location : "",
    }
    const companyInfo = {
        domain: userDetail.company.domain ? userDetail.company.domain : "",
        industry: userDetail.company.category ? (userDetail.company.category.industry ? userDetail.company.category.industry : "" ):"",
        foundedYear: userDetail.company.foundedYear ? userDetail.company.foundedYear : "",
        description: userDetail.company.description ? userDetail.company.description : ""
    }
    return (
        <div>
            <div id="km-clearbit-title-panel" className="km-clearbit-title-panel">Clearbit</div>
            <div className="km-tab-cell">
                <div className="km-user-info-inner">
                    <div id="km-user-info-list" className="km-user-info-list">
                        <h4
                            id="full-name"
                            className="km-clearbit-field km-clearbit-user-full-name"
                        >
                            {userInfo.fullName}
                        </h4>
                        <p id="bio" className="km-clearbit-field km-clearbit-user-bio">
                            {userInfo.bio}
                        </p>
                        <div className="km-clearbit-user-domain-location-wrapper">
                            <div id="location-icon" className="km-clearbit-logo-wrapper">
                                <img src={LocationIcon} className="km-clearbit-location-icon" />
                                <p
                                    id="location"
                                    className="km-clearbit-field km-clearbit-user-data"
                                >
                                    {userInfo.location}
                                </p>
                            </div>
                            {userDetail.company.domain ?
                                <div id="domain-icon" className="km-clearbit-logo-wrapper">
                                    <img src={DomainIcon} className="km-clearbit-domain-icon" />
                                    <a
                                        id="domain-link"
                                        className="km-clearbit-link"
                                        href={'http://www.' + userDetail.company.domain}
                                        target="_blank"
                                    >
                                        <p
                                            id="domain"
                                            className="km-clearbit-field km-clearbit-user-domain"
                                        >
                                            {'http://www.' + userDetail.company.domain}
                                        </p>
                                    </a>
                                </div> : null
                            }
                        </div>
                        {/**company detail */}
                        <div id="divider-1" className="km-clearbit-divider" />
                        <div
                            id="industry"
                            className="km-clearbit-field km-clearbit-user-industry"
                        >
                            <span className="clearbit-industry-details">Industry</span>
                            {companyInfo.industry}
                        </div>

                        <div
                            id="foundedYear"
                            className="km-clearbit-field km-clearbit-user-industry"
                        >
                            <span className="clearbit-industry-details">Founded</span>
                            {companyInfo.foundedYear}
                        </div>

                        <div className="km-clearbit-company-description-wrapper">
                            <p
                                id="description"
                                className="km-clearbit-field km-clearbit-user-data"
                            >
                                {companyInfo.description.substr(0, 100) + '...'}
                            </p>
                        </div>
                        {/* social info */}
                        <div id="divider-2" className="km-clearbit-divider" />
                        <div className="km-clearbit-user-social-info-wrapper">
                            {userDetail.person.linkedin &&
                                userDetail.person.linkedin.handle ? (
                                    <div id="km-cl-ln-icon-box" className="km-cl-icon-wrapper">
                                        <a
                                            id="linkedin"
                                            className="km-cl-icon km-clearbit-link"
                                            href={
                                                "https://linkedin.com/" +
                                                userDetail.person.linkedin.handle
                                            }
                                            target="_blank"
                                        >
                                            <img
                                                src={LinkedinIcon}
                                                className="km-clearbit-social-icon "
                                            />
                                        </a>
                                    </div>
                                ) : null}
                            {//facebook detail
                                userDetail.person.facebook &&
                                    userDetail.person.facebook.handle ? (
                                        <div id="km-cl-fb-icon-box" className="km-cl-icon-wrapper">
                                            <a
                                                id="facebook"
                                                className="km-cl-icon km-clearbit-link"
                                                href={
                                                    "https://facebook.com/" +
                                                    userDetail.person.facebook.handle
                                                }
                                                target="_blank"
                                            >
                                                <img
                                                    src={FacebookIcon}
                                                    className="km-clearbit-social-icon "
                                                />
                                            </a>
                                        </div>
                                    ) : null}
                            {//twiter detail
                                userDetail.person.twitter && userDetail.person.twitter.handle ? (
                                    <div id="km-cl-tw-icon-box" className="km-cl-icon-wrapper ">
                                        <a
                                            id="twitter"
                                            className="km-cl-icon km-clearbit-link"
                                            href={
                                                "https://twitter.com/" + userDetail.person.twitter.handle
                                            }
                                            target="_blank"
                                        >
                                            <img
                                                src={TwitterIcon}
                                                className="km-clearbit-social-icon"
                                            />
                                        </a>
                                    </div>
                                ) : null}
                            {//crunchbase info
                                userDetail.company.crunchbase &&
                                    userDetail.company.crunchbase.handle ? (
                                        <div id="km-cl-cb-icon-box" className="km-cl-icon-wrapper">
                                            <a
                                                id="crunchbase"
                                                className="km-cl-icon km-clearbit-link"
                                                href={
                                                    "https://crunchbase.com/" +
                                                    userDetail.company.crunchbase.handle
                                                }
                                                target="_blank"
                                            >
                                                <img
                                                    src={CrunchbaseIcon}
                                                    className="km-clearbit-social-icon"
                                                />
                                            </a>
                                        </div>
                                    ) : null}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default ClearBitInfo;
