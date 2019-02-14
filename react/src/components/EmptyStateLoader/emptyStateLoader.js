import React from 'react';
import ContentLoader from "react-content-loader"

export const UserSectionLoader = () =>(
<ContentLoader 
    height={160}
    width={420}
    speed={2}
    primaryColor="#f3f3f3"
    secondaryColor="#C3BEC3"
>
    <circle cx="10" cy="18" r="8" /> 
    <rect x="30" y="13" rx="0" ry="0" width="275" height="3.8" /> 
    <rect x="30" y="20" rx="0" ry="0" width="68.75" height="3.8" /> 
    <circle cx="10" cy="41" r="8" /> 
    <rect x="30" y="35" rx="0" ry="0" width="275" height="3.8" /> 
    <rect x="30" y="43" rx="0" ry="0" width="137.5" height="3.8" />
    <circle cx="10" cy="64" r="8" /> 
    <rect x="30" y="59" rx="0" ry="0" width="275" height="3.8" /> 
    <rect x="30" y="66" rx="0" ry="0" width="206.25" height="3.8" /> 
</ContentLoader>
)

export const ALAnalyticsDashboardLoader = (props) =>(
	<ContentLoader 
		height={500}
		width={800}
		speed={2}
		primaryColor="#f3f3f3"
		secondaryColor="#ecebeb"
		{...props}
	>
		<rect x="24" y="23" rx="4" ry="4" width="350" height="20" /> 
		<rect x="8" y="67" rx="5" ry="5" width="120" height="120" /> 
		<rect x="173.55" y="65" rx="5" ry="5" width="120" height="120" /> 
		<rect x="335.55" y="64" rx="5" ry="5" width="120" height="120" /> 
		<rect x="495.55" y="62" rx="5" ry="5" width="120" height="120" /> 
		<rect x="24" y="236" rx="4" ry="4" width="150" height="20" /> 
		<rect x="9" y="280.67" rx="4" ry="4" width="605" height="200" /> 
        <rect x="350" y="234" rx="4" ry="4" width="120" height="25" /> 
		<rect x="495" y="234" rx="4" ry="4" width="120" height="25" />
	</ContentLoader>
)

export const KommunicateContactListLoader = (props) =>(
	<ContentLoader 
		height={400}
		width={400}
		speed={2}
		primaryColor="#f3f3f3"
		secondaryColor="#C3BEC3"
		{...props}
	>
		<circle cx="50" cy="80" r="32" />
		<rect x="90" y="65" rx="4" ry="4" width="90" height="12" /> 
		<rect x="90" y="85" rx="3" ry="3" width="230" height="8" /> 
		<circle cx="50" cy="165" r="32" />
		<rect x="90" y="150" rx="4" ry="4" width="90" height="12" />
		<rect x="90" y="170" rx="4" ry="4" width="120" height="8" />
		<circle cx="50" cy="250" r="32" />	
		<rect x="90" y="235" rx="4" ry="4" width="90" height="12" />
		<rect x="90" y="255" rx="4" ry="4" width="180" height="8" />
		<circle cx="50" cy="335" r="32" />
		<rect x="90" y="320" rx="4" ry="4" width="90" height="12" />
		<rect x="90" y="340" rx="4" ry="4" width="230" height="8" />			 

	</ContentLoader>
)

export const KommunicateUserInfoPanelLoader = (props) => (
	<ContentLoader 
		height={600}
		width={400}
		speed={2}
		primaryColor="#f3f3f3"
		secondaryColor="#C3BEC3"
		{...props}
	>
		<circle cx="200" cy="70" r="40" /> 
		<rect x="67.14" y="118.61" rx="2" ry="2" width="263.58" height="13.5" /> 
		<rect x="109.63" y="139.61" rx="2" ry="2" width="185" height="15" /> 
		<rect x="25" y="257.61" rx="5" ry="5" width="42" height="43.05" /> 
		<rect x="87.63" y="258.61" rx="2" ry="2" width="163" height="17" /> 
		<rect x="86.63" y="287.74" rx="2" ry="2" width="283.55" height="12.8" />
		<rect x="25" y="357.61" rx="5" ry="5" width="42" height="43.05" /> 
		<rect x="87.63" y="358.61" rx="2" ry="2" width="163" height="17" /> 
		<rect x="86.63" y="387.74" rx="2" ry="2" width="283.55" height="12.8" />
		<rect x="25" y="457.61" rx="5" ry="5" width="42" height="43.05" /> 
		<rect x="87.63" y="458.61" rx="2" ry="2" width="163" height="17" /> 
		<rect x="86.63" y="487.74" rx="2" ry="2" width="283.55" height="12.8" />
	</ContentLoader>
)

export const KommunicateConversationLoader = (props) => (
	<ContentLoader 
		height={500}
		width={500}
		speed={2}
		primaryColor="#e0e0e0"
		secondaryColor="#ecebeb"
		{...props}
	>
		<circle cx="30" cy="40" r="17"/> 
		<rect x="55" y="25" rx="4" ry="4" width="250" height="90" />
		<rect className="km-hide-bottom-box-on-max-height" x="230" y="140" rx="4" ry="4" width="250" height="90" />
	</ContentLoader>
)

export const KommunicateConversationDataLoader = (props) => (
	<ContentLoader 
		className='km-conversation-section-data-loader'
		height={500}
		width={500}
		speed={2}
		primaryColor="#bababa"
		secondaryColor="#dedede"
		{...props}
	>
		<rect x="30" y="30" rx="2" ry="2" width="200" height="5" /> 
		<rect x="30" y="45" rx="2" ry="2" width="200" height="5" /> 
		<rect x="30" y="60" rx="2" ry="2" width="130" height="5" /> 
		<rect className="km-hide-bottom-box-on-max-height" x="230" y="145" rx="2" ry="2" width="200" height="5" /> 
		<rect className="km-hide-bottom-box-on-max-height" x="230" y="160" rx="2" ry="2" width="200" height="5" /> 
		<rect className="km-hide-bottom-box-on-max-height" x="300" y="175" rx="2" ry="2" width="130" height="5" />
	</ContentLoader>
)

export const ApplozicMessageLogsLoader = props => (
	<ContentLoader 
		height={2800}
		width={4220}
		speed={2}
		primaryColor="#f3f3f3"
		secondaryColor="#ecebeb"
		{...props}
	>
		<rect x="102.41" y="30.67" rx="4" ry="4" width="370" height="33.49" />  
		<circle cx="57.67" cy="45.64" r="27.97" />
		<rect x="102.41" y="30.67" rx="4" ry="4" width="370" height="33.49" />
		<circle cx="57.67" cy="45.64" r="27.97" />

	</ContentLoader>
)

const Loader = props => {
	const random = Math.random() * (1 - 0.7) + 0.7
	return (
	  <ContentLoader
		height={50}
		width={1060}
		speed={2}
		primaryColor="#d9d9d9"
		secondaryColor="#ecebeb"
		{...props}
	  >
		<rect x="0" y="4" rx="35" ry="35" width="35" height="35" />
		<rect x="40" y="8" rx="6" ry="6" width={300 * random} height="10" />
		<rect x="40" y="26" rx="6" ry="6" width={150 * random} height="8" />
		<rect x="630" y="17" rx="6" ry="6" width={117 * random} height="10" />
		<rect x="800" y="8" rx="6" ry="6" width={180 * random} height="10" />
		<rect x="800" y="26" rx="6" ry="6" width={80 * random} height="8" />
  
		<rect x="0" y="48" rx="6" ry="6" width="1060" height=".3" />
	  </ContentLoader>
	)
}
  
export const MyLoader = () => (
	<React.Fragment>
	  {Array(10)
		.fill("")
		.map((e, i) => (
		  <Loader key={i} style={{ opacity: Number(2 / i).toFixed(1) }} />
		))}
	</React.Fragment>
)

export const MessageLogsDetailsLoader = props => (
	<ContentLoader 
		height={500}
		width={700}
		speed={2}
		primaryColor="#f3f3f3"
		secondaryColor="#ecebeb"
		{...props}
	>
		<circle cx="159.15" cy="50.23" r="31.56" /> 
		<rect x="46.69" y="94.67" rx="0" ry="0" width="242.95" height="20.02" /> 
		<rect x="48.23" y="159.67" rx="0" ry="0" width="82.14" height="18" /> 
		<rect x="161.23" y="158.67" rx="0" ry="0" width="129" height="19" /> 
		<rect x="48.23" y="197.67" rx="0" ry="0" width="82.14" height="18" /> 
		<rect x="47.23" y="237.67" rx="0" ry="0" width="82.14" height="18" /> 
		<rect x="160.23" y="200.67" rx="0" ry="0" width="129" height="19" /> 
		<rect x="159.23" y="237.67" rx="0" ry="0" width="129" height="19" /> 
		<circle cx="370.73" cy="40.17" r="21.5" /> 
		<rect x="402.23" y="18.67" rx="0" ry="0" width="270" height="106" /> 
		<circle cx="374.73" cy="182.17" r="21.5" /> 
		<rect x="405.23" y="161.67" rx="0" ry="0" width="270" height="60.42" />
	</ContentLoader>
)