"use client";

import styles from "./Loader.module.css";
import { useAppSelector } from "@/store/hooks";
import { selectIsLoading } from "@/store/network-loader/loader.selectors";

const BOX_POSITIONS: { x: number; y: number; className: string }[] = [
  { x: 13, y: 1, className: styles.box1 },
  { x: 13, y: 1, className: styles.box2 },
  { x: 25, y: 25, className: styles.box3 },
  { x: 13, y: 13, className: styles.box4 },
  { x: 13, y: 13, className: styles.box5 },
  { x: 25, y: 13, className: styles.box6 },
  { x: 1, y: 25, className: styles.box7 },
  { x: 13, y: 25, className: styles.box8 },
  { x: 25, y: 25, className: styles.box9 },
];

interface LoadingIconProps {
  className?: string;
  size?: number;
}

interface LoaderBoxProps {
  x: number;
  y: number;
  boxClass: string;
}

function LoaderBox({ x, y, boxClass }: LoaderBoxProps) {
  return (
    <rect
      className={`${styles.box} ${boxClass}`}
      x={x}
      y={y}
      rx={1}
      width={10}
      height={10}
    />
  );
}

export default function Loader({ className, size = 90 }: LoadingIconProps) {
  const loading = useAppSelector(selectIsLoading);

  if (!loading) {
    return null;
  }

  return (
    <div className={styles.overlay}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 36 36"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        role="img"
        aria-label="Cargando"
      >
        <g>
          {BOX_POSITIONS.map((box, i) => (
            <LoaderBox key={i} x={box.x} y={box.y} boxClass={box.className} />
          ))}
        </g>
      </svg>
    </div>
  );
}
