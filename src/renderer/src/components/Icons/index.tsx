interface IconProps {
  size?: number;
}

export function EditIcon({ size = 16 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20.1498 7.93997L8.27978 19.81C7.21978 20.88 4.04977 21.3699 3.32977 20.6599C2.60977 19.9499 3.11978 16.78 4.17978 15.71L16.0498 3.84C16.5979 3.31801 17.3283 3.03097 18.0851 3.04019C18.842 3.04942 19.5652 3.35418 20.1004 3.88938C20.6356 4.42457 20.9403 5.14781 20.9496 5.90463C20.9588 6.66146 20.6718 7.39189 20.1498 7.93997V7.93997Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function OptionsIcon({ size = 16 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="24" cy="11" r="5" fill="currentColor" />
      <circle cx="24" cy="24" r="5" fill="currentColor" />
      <circle cx="24" cy="37" r="5" fill="currentColor" />
    </svg>
  );
}

export function ArrowDownIcon({ size = 14 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 4L12 20M12 20L18 14M12 20L6 14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function AlertTriangleIcon({ size = 16 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.29 3.85999L1.82002 18C1.64539 18.3024 1.55299 18.6453 1.55201 18.9945C1.55103 19.3437 1.64149 19.6871 1.81445 19.9905C1.98741 20.2939 2.23712 20.5467 2.53873 20.7235C2.84034 20.9003 3.18282 20.9952 3.53202 21H20.468C20.8172 20.9952 21.1597 20.9003 21.4613 20.7235C21.7629 20.5467 22.0126 20.2939 22.1856 19.9905C22.3586 19.6871 22.449 19.6453 22.448 18.9945C22.4471 18.6453 22.3547 18.3024 22.18 18L13.71 3.85999C13.5318 3.56611 13.2807 3.32312 12.9812 3.15448C12.6817 2.98584 12.3438 2.89725 12 2.89725C11.6563 2.89725 11.3184 2.98584 11.0188 3.15448C10.7193 3.32312 10.4682 3.56611 10.29 3.85999Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 9V13"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 17H12.01"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ViewIcon({ size = 16 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 5C8.5 5 5.3 7.2 3 12C5.3 16.8 8.5 19 12 19C15.5 19 18.7 16.8 21 12C18.7 7.2 15.5 5 12 5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="12"
        cy="12"
        r="3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function DeleteIcon({ size = 16 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M4 2H1V4H15V2H12V0H4V2Z" fill="currentColor" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3 6H13V16H3V6ZM7 9H9V13H7V9Z"
        fill="currentColor"
      />
    </svg>
  );
}
