import React from 'react';
export const SearchLogo = props => (
  <svg viewBox="0 0 451 451" width={22} height={22} {...props}>
    <path
      d="M447.05 428l-109.6-109.6c29.4-33.8 47.2-77.9 47.2-126.1C384.65 86.2 298.35 0 192.35 0 86.25 0 .05 86.3.05 192.3s86.3 192.3 192.3 192.3c48.2 0 92.3-17.8 126.1-47.2L428.05 447c2.6 2.6 6.1 4 9.5 4s6.9-1.3 9.5-4c5.2-5.2 5.2-13.8 0-19zM26.95 192.3c0-91.2 74.2-165.3 165.3-165.3 91.2 0 165.3 74.2 165.3 165.3s-74.1 165.4-165.3 165.4c-91.1 0-165.3-74.2-165.3-165.4z"
      fill="#858585"
    />
  </svg>
)

export const BookMarkIcon = props => (
  <svg width={23} height={40} {...props}>
    <title>{'Rectangle 30'}</title>
    <defs>
      <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="prefix__a">
        <stop stopColor="#FAD961" offset="0%" />
        <stop stopColor="#F7CB1C" offset="100%" />
      </linearGradient>
    </defs>
    <path
      d="M1122 412h15a4 4 0 0 1 4 4v34.003a2 2 0 0 1-3.5 1.322l-6.5-7.37a2 2 0 0 0-3 0l-6.5 7.37a2 2 0 0 1-3.5-1.322V416a4 4 0 0 1 4-4z"
      transform="translate(-1118 -412)"
      fill="url(#prefix__a)"
      fillRule="evenodd"
    />
  </svg>
)

export const KommunicateLogo = props => (
  <svg data-name="Layer 1" viewBox="0 0 147.735 132.997"  width={26} height={24}  {...props}>
    <path
      d="M147.714 128.428V50.764A50.764 50.764 0 0 0 96.948 0h-46.18a50.766 50.766 0 1 0 0 101.531h50.007a29.136 29.136 0 0 1 6.513 1.137 21.836 21.836 0 0 1 4.951 2.912l30.883 25.428s2.808 2.418 3.8 1.922c1.015-.51.792-4.502.792-4.502zM52.198 61.132a6.614 6.614 0 0 1-13.191 0V39.314a6.614 6.614 0 0 1 13.191 0zm28.262 10.29a6.613 6.613 0 0 1-13.189 0v-42.4a6.613 6.613 0 0 1 13.189 0zm28.266-10.29a6.614 6.614 0 0 1-13.192 0V39.314a6.614 6.614 0 0 1 13.192 0z"
      fill={props.fillcolor ? props.fillcolor : "#5553b7"}
    />
  </svg>
)
