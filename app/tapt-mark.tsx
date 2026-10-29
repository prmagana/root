// tapt's six-point star, same path as public/tapt.svg but on currentColor so it takes the text color.
// outline draws a fixed-pixel stroke under the fill, so it only shows past the edges.
export default function TaptMark({ className = "", outline }: { className?: string; outline?: string }) {
  return (
    <svg viewBox="0 0 866 867" fill="currentColor" fillRule="evenodd" aria-label="tapt" role="img" className={className}>
      <path
        d="M 433.00 0.00 L 291.00 318.00 L 0.00 203.00 L 268.00 431.00 L 4.00 678.00 L 288.00 542.00 L 433.00 866.00 L 578.00 542.00 L 862.00 678.00 L 598.00 432.00 L 865.00 203.00 L 575.00 318.00 Z M 432.00 448.00 L 512.00 493.00 L 433.00 677.00 L 355.00 493.00 Z M 433.00 193.00 L 509.00 365.00 L 507.00 370.00 L 434.00 411.00 L 356.00 367.00 Z"
        stroke={outline}
        strokeWidth={outline ? 2 : 0}
        strokeLinejoin="miter"
        strokeMiterlimit={10}
        vectorEffect="non-scaling-stroke"
        paintOrder="stroke"
      />
    </svg>
  );
}
