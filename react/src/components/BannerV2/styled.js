import styled, { css } from 'styled-components';

const Content = styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    border-radius: 3px;
    padding: 12px 20px;
`;
const Icon = styled.div`
    display: flex;
    align-items: flex-start;
    margin-right: 10px;
    & svg {
        width: 18px;
        height: auto;
        & g {
            display: none;
            & path {
                fill: #4a4a4a;
            }
        }
    }
`;
const Heading = styled.div`
    margin: 0;
    font-size: 16px;
    letter-spacing: 0.2px;
    line-height: 18px;
`;
const Description = styled.div`
    font-size: 14px;
    line-height: 1.29;
    letter-spacing: 0.2px;
    margin-top: 5px;
`;
const Text = styled.div``;
const defaultBanner = css`
	${Content} {
        background-color: #cce7f8;
        border: 1px solid #A5CFEA;
        color: #2e2d2d;
    } 
    ${Icon} {
        & svg g.km-info-icon-svg {
            display: inline;
        }
    }
    ${Description} {
        color: #716e6e;
    }
`;
const errorBanner = css`
	${Content} {
        background-color: #ed222a; 
        border: 1px solid #bb0007;
        color: #FFF;
    } 
    ${Icon} {
        & svg g.km-error-icon-svg {
            display: inline;
            & path {
                fill: #ffffff;
            }
        }
    }
`;
const successBanner = css`
	${Content} {
        background-color: #2dd35c; 
        border: 1px solid #0fa53a;
        color: #2e2d2d;
    } 
    ${Icon} {
        & svg g.km-success-icon-svg {
            display: inline;
        }
    }
`;
const warningBanner = css`
	${Content} {
        background-color: #f4d480; 
        border: 1px solid #deb752;
        color: #2e2d2d;
    } 
    ${Icon} {
        & svg g.km-warning-icon-svg {
            display: inline;
        }
    }
    ${Description} {
        color: #716e6e;
    }
`;

const BannerContainer = styled.div`
    ${({appearance}) => appearanceClasses[appearance]}
`;

const appearanceClasses = {
    'info': defaultBanner,
    'error': errorBanner,
	'success': successBanner,
	'warning': warningBanner
};

module.exports = {
    Content,
    Icon,
    Heading,
    Description,
    Text,
    BannerContainer
}