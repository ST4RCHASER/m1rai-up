const Arrow = (props: { color: string }) => {
  return (
    <svg
      version="1.2"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 156 156"
      width="100%"
      height="100%"
    >
      <path
        style={{ fill: props.color }}
        class="a"
        d="m153.5 77h-44.3v79.1h-63.2v-79.1h-44.4l76-76z"
      />
    </svg>
  );
};

export default Arrow;
