import React from 'react';
import ContentLoader from "react-content-loader"

export const UserSectionLoader = () =>(
<ContentLoader 
	className='km-user-section-loader'
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
		<rect x="90" y="35" rx="4" ry="4" width="90" height="12" /> 
		<rect x="90" y="55" rx="3" ry="3" width="200" height="7" /> 
		<rect x="90" y="120" rx="4" ry="4" width="90" height="12" />
		<rect x="90" y="140" rx="4" ry="4" width="200" height="7" />	
		<rect x="90" y="205" rx="4" ry="4" width="90" height="12" />
		<rect x="90" y="225" rx="4" ry="4" width="200" height="7" />
		<rect x="90" y="290" rx="4" ry="4" width="90" height="12" />
		<rect x="90" y="310" rx="4" ry="4" width="200" height="7" />			 
		<circle cx="50" cy="50" r="32" />
		<circle cx="50" cy="135" r="32" />
		<circle cx="50" cy="220" r="32" />
		<circle cx="50" cy="305" r="32" />

	</ContentLoader>
)