import type { SVGProps } from "react";

export const Logo = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 683 170"
      width="683"
      height="170"
      role="img"
      aria-label="Eshani"
      {...props}
    >
      <title>Eshani</title>

      <path
        transform="translate(40,130.0)"
        fill="#C41E4A"
        d="29.5831640625 -84.0V0.0H14.982773437499999V-84.0ZM61.497421875 -4.691484375 63.440390625 0.0H29.2231640625V-4.691484375Z"
      />

      {/* baqi aapka original path */}
    </svg>
  );
};
