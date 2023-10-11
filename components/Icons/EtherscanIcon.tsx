import React from 'react';
export default function EtherscanIcon({
    width = 13,
    height = 12,
    fill
}: {
    width?: number;
    height?: number;
    fill: string
}) {
    return (
        <svg width={width} height={height} viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_522_1329)">
                <path d="M3.01615 5.69912C3.01616 5.63285 3.02926 5.56725 3.05469 5.50606C3.08013 5.44488 3.11739 5.38933 3.16436 5.34259C3.21134 5.29585 3.26706 5.25884 3.32837 5.2337C3.38968 5.20856 3.45535 5.19578 3.52161 5.19609L4.35966 5.19882C4.49327 5.19882 4.62141 5.25191 4.71589 5.34638C4.81038 5.44086 4.86346 5.56901 4.86346 5.70263V8.87141C4.9578 8.84341 5.07897 8.81355 5.21156 8.78233C5.30366 8.76071 5.38574 8.70859 5.44449 8.63443C5.50323 8.56028 5.53519 8.46845 5.53517 8.37385V4.44312C5.53517 4.30949 5.58824 4.18133 5.68272 4.08683C5.7772 3.99234 5.90535 3.93924 6.03897 3.93921H6.87868C7.0123 3.93924 7.14045 3.99234 7.23493 4.08683C7.3294 4.18133 7.38249 4.30949 7.38249 4.44312V8.09121C7.38249 8.09121 7.59273 8.00614 7.79751 7.9197C7.87358 7.88754 7.9385 7.83367 7.98416 7.76484C8.02983 7.69602 8.05421 7.61527 8.05429 7.53268V3.1836C8.05429 3.05 8.10736 2.92187 8.20181 2.82739C8.29627 2.73291 8.42439 2.67983 8.55799 2.6798H9.39771C9.53133 2.6798 9.65946 2.73287 9.75395 2.82736C9.84843 2.92184 9.90151 3.04998 9.90151 3.1836V6.76497C10.6295 6.23736 11.3673 5.60282 11.9527 4.8398C12.0377 4.72905 12.0939 4.59899 12.1163 4.46124C12.1388 4.3235 12.1268 4.18233 12.0814 4.05034C11.8104 3.27061 11.3797 2.55603 10.8166 1.95235C10.2536 1.34867 9.57077 0.86916 8.8118 0.544523C8.05284 0.219887 7.23446 0.0572659 6.40903 0.0670686C5.58361 0.0768712 4.76933 0.258882 4.01829 0.60145C3.26725 0.94402 2.59599 1.4396 2.04747 2.05649C1.49895 2.67337 1.08526 3.39797 0.832858 4.18393C0.580458 4.96987 0.494911 5.79985 0.581692 6.62075C0.668472 7.44166 0.92567 8.23541 1.33682 8.95121C1.40845 9.07469 1.51382 9.17516 1.64056 9.24083C1.76731 9.3065 1.91016 9.33464 2.05234 9.32194C2.21117 9.30799 2.40893 9.28819 2.64405 9.26058C2.7464 9.24896 2.8409 9.20009 2.90953 9.12328C2.97817 9.04647 3.01616 8.9471 3.01624 8.84409L3.01615 5.69912Z" fill={fill} />
                <path d="M2.9978 10.7815C3.88291 11.4254 4.92891 11.812 6.02006 11.8983C7.11122 11.9845 8.20498 11.7674 9.18034 11.2706C10.1557 10.7738 10.9746 10.0169 11.5465 9.08365C12.1183 8.15035 12.4208 7.07703 12.4205 5.98246C12.4205 5.84588 12.4142 5.71076 12.4051 5.57642C10.2374 8.80939 6.23497 10.3208 2.99799 10.781" fill={fill} />
            </g>
            <defs>
                <clipPath id="clip0_522_1329">
                    <rect width="12" height="12" fill="white" transform="translate(0.5)" />
                </clipPath>
            </defs>
        </svg>
    );
}