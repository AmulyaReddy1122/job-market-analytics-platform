const paths = {
  briefcase:
    "M3 7h3V6a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v1h3v13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7Zm2 2v10h14V9H5Zm5-5a1 1 0 0 0-1 1v1h6V5a1 1 0 0 0-1-1h-4Z",
  rupee:
    "M7 5h10v2H9.5c.6.6 1.5 1.2 2.5 1.2 1.4 0 2.5-.7 3.1-1.4l1.7 1.1C16.1 9.3 14.5 10 12.9 10c-.9 0-1.7-.3-2.3-.7-.3 2.1-1 3.3-3.1 5l5.1.1v2l-.1 1H5v-2l5.2-5.2c1.2-.8 1.7-1.9 1.8-3.2H5.2L4.2 7c1 0 2.4 0 2.8-1V5Z",
  building:
    "M4 3h11a1 1 0 0 1 1 1v17H7v-4H4V3Zm10 2H6v3h8V5Zm0 4H6v3h8V9Zm0 4H6v3h8v-3ZM9 5h1v3H9V5Zm0 4h1v3H9V9Zm0 4h1v3H9v-3Z",
  sparkles:
    "M12 2l1.9 4.2L18 8l-4.1 1.8L12 14l-1.9-4.2L6 8l4.1-1.8L12 2Zm6 10l1.1 2.4L21.5 16l-2.4 1.6L18 20l-1.1-2.4L14.5 16l2.4-1.6L18 12Zm-12 5l1 2.2L9 20l-2 1.4L6 23.5 5 21.4 3 20l2-1.3L6 17Z",
  chart:
    "M4 4h2v16h14v2H4V4Zm4 12h2V11H8v5Zm4 0h2V7h-2v9Zm4 0h2v-7h-2v7Z",
  menu:
    "M4 6h16v2H4V6Zm0 5h16v2H4v-2Zm0 5h16v2H4v-2Z",
  chevronRight:
    "M9 6l6 6-6 6-1.4-1.4L12.2 12 7.6 7.4 9 6Z",
  location:
    "M12 2a7 7 0 0 1 7 7c0 5-7 13-7 13S5 14 5 9a7 7 0 0 1 7-7Zm0 5a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z",
  external:
    "M14 3h7v7h-2V6.4l-8.3 8.3-1.4-1.4L17.6 5H14V3ZM5 5h6v2H5v12h12v-6h2v8H5V5Z",
  dashboard:
    "M3 3h8v8H3V3Zm10 0h8v4h-8V3Zm0 6h8v8h-8V9ZM3 13h8v8H3v-8Zm2-8v4h4V5H5Zm10 2v0h4v0h-4Zm0 8v4h4v-4h-4ZM5 15v4h4v-4H5Z",
  users:
    "M7 6a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm10 0a3 3 0 1 1 0 6 3 3 0 0 1 0-6ZM1 20c0-3.3 2.7-6 6-6s6 2.7 6 6v1H1v-1Zm10-3.2c2-.4 3.9 1 4.5 3H22v1h-6.4c-.1-1.5-.9-2.8-2.1-3.6-.2-.1-.3-.3-.5-.4Z",
  bolt:
    "M13 2L3 15h7l-1 7 10-13h-7l1-7Z",
  calculator:
    "M6 2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm0 2v16h12V4H6Zm2 3h8v2H8V7Zm0 4h2v2H8v-2Zm4 0h2v2h-2v-2Zm4 0h2v2h-2v-2Zm-8 4h2v2H8v-2Zm4 0h2v2h-2v-2Zm4 0h2v2h-2v-2Z",
  chat:
    "M21 3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h16ZM6 9h12v2H6V9Zm0 4h8v2H6v-2Z",
  search:
    "M10 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16Zm0 2a6 6 0 1 0 0 12 6 6 0 0 0 0-12Zm9.3 14l2.5 2.5-1.4 1.4L17.9 19l1.4-1Z",
};

export default function Icon({ name, size = 20, stroke = "currentColor", strokeWidth = 0 }) {
  const path = paths[name] || paths.chart;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={stroke}
      stroke={strokeWidth ? stroke : "none"}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={path} />
    </svg>
  );
}
