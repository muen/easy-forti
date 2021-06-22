import * as React from 'react';

function SvgEmpty(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlnsXlink="http://www.w3.org/1999/xlink"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 400 400"
      clipRule="evenodd"
      strokeLinecap="round"
      strokeLinejoin="round"
      width="1em"
      height="1em"
      {...props}
    >
      <defs>
        <path
          d="M27.002 39.333h349.84v349.65H27.002V39.333z"
          id="empty_svg__a"
        />
      </defs>
      <g id="Layer 1">
        <g mask="#Mask">
          <clipPath id="empty_svg__b">
            <use xlinkHref="#empty_svg__a" fill="none" overflow="visible" />
          </clipPath>
          <g clipPath="url(#empty_svg__b)">
            <path
              d="M201.908 39.292c-5.609 0-10.334 2.018-14.256 5.94-3.926 3.925-5.94 8.65-5.94 14.256 0 2.806.613 5.565 1.737 8.224-26.633 3.924-48.209 15.064-64.608 33.355-16.4 18.29-24.582 38.094-24.582 59.399 0 19.482-1.378 37.689-4.112 54.647-2.734 16.959-6.234 31.404-10.509 43.315-4.276 11.916-9.46 22.962-15.627 33.263-6.17 10.303-12.165 18.685-17.91 25.131a184.826 184.826 0 01-19.1 18.55c0 7.29 2.624 13.592 7.95 18.917 5.326 5.329 11.716 7.95 19.008 7.95h110.939c6.039 15.629 21.17 26.775 38.929 26.775 17.76 0 32.981-11.146 39.021-26.775h107.1c7.287 0 13.588-2.621 18.916-7.95 5.327-5.325 7.951-11.627 7.951-18.917a183.954 183.954 0 01-19.099-18.55c-5.749-6.446-11.747-14.828-17.911-25.131-6.172-10.301-11.353-21.348-15.627-33.263-4.275-11.911-7.775-26.356-10.509-43.315-2.733-16.958-4.112-35.165-4.112-54.647 0-21.305-8.183-41.109-24.582-59.399-16.399-18.291-37.889-29.43-64.516-33.355a21.054 21.054 0 001.645-8.224c0-5.605-1.926-10.33-5.849-14.256-3.924-3.922-8.743-5.94-14.347-5.94zm0 53.825c13.035 0 24.918 2.256 35.639 6.67 10.723 4.416 19.281 10.039 25.588 16.906 6.309 6.868 11.074 14.089 14.438 21.658 3.364 7.569 5.118 14.966 5.117 22.115 0 74.565 18.644 132.859 55.927 174.906H65.291c37.282-42.047 55.926-100.341 55.926-174.906 0-7.149 1.662-14.546 5.026-22.115 3.364-7.569 8.222-14.79 14.53-21.658 6.307-6.867 14.773-12.49 25.496-16.905 10.722-4.415 22.603-6.671 35.639-6.671z"
              fill="#e1e0e1"
            />
          </g>
        </g>
        <path
          d="M261.134 198.14l-2.331-1.369-1.061 2.487-.855 2.003c-3.392 7.966-10.138 12.913-17.603 12.913-7.466 0-14.21-4.947-17.603-12.912l-.853-2.003-1.06-2.488-2.332 1.369-7.233 4.245-1.804 1.06.819 1.925.853 2.002c5.529 12.987 16.723 21.054 29.213 21.054 12.489 0 23.683-8.067 29.213-21.054l.853-2.001.822-1.926-1.806-1.06-7.232-4.245zM196.091 205.37l.82-1.925-1.804-1.059-7.234-4.247-2.331-1.368-1.061 2.486-.854 2.004c-3.393 7.966-10.137 12.914-17.603 12.914-7.465 0-14.21-4.948-17.602-12.913l-.854-2.003-1.06-2.489-2.333 1.369-7.232 4.247-1.805 1.059.82 1.925.854 2.002c5.528 12.986 16.722 21.055 29.212 21.055 12.489 0 23.682-8.069 29.213-21.056l.854-2.001zM203.845 269.829c-6.256 0-11.327 5.072-11.327 11.326 0 6.256 5.071 11.327 11.327 11.327 6.254 0 11.325-5.071 11.325-11.327 0-6.254-5.071-11.326-11.325-11.326M362.273 98.305h-30.952v8.005h17.81l-18.277 21.612v6.269h32.016v-8.003h-18.874l18.277-21.612v-6.27zM291.649 71.772l54.183-.023-.006-13.545-31.942.012 30.917-36.589-.004-10.61-52.381.021.004 13.546 30.142-.013-30.916 36.59.003 10.61z"
          fill="#9b9b9b"
        />
      </g>
    </svg>
  );
}

export default SvgEmpty;
