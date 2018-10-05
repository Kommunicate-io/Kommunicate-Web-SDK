import React from 'react';
import ContentLoader from "react-content-loader"

export const UserSectionLoader = () =>(
<ContentLoader 
    height={160}
    width={420}
    speed={2}
    primaryColor="#f3f3f3"
    secondaryColor="#ecebeb"
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