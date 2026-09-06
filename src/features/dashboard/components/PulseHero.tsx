import type { CSSProperties, ReactNode } from "react";
import { Typography } from "antd";
import { useTranslation } from "react-i18next";
import styles from "./PulseHero.module.scss";

const { Title, Text } = Typography;

const AnimalShape = {
  Cat: "cat",
  Dog: "dog",
  Rabbit: "rabbit",
  Bird: "bird",
  Fish: "fish",
} as const;

type AnimalShapeType = (typeof AnimalShape)[keyof typeof AnimalShape];

const { Cat, Dog, Rabbit, Bird, Fish } = AnimalShape;

const ANIMAL_SILHOUETTES: Record<AnimalShapeType, ReactNode> = {
  [Cat]: (
    <>
      <path d="M8.4 3.6 L10 7.1 A5.6 5.6 0 0 1 14 7.1 L15.6 3.6 L16.1 8 C18 9.4 19.1 11.6 19.1 14.2 C19.1 18 16.5 20.6 12 20.6 C7.5 20.6 4.9 18 4.9 14.2 C4.9 11.6 6 9.4 7.9 8 Z" />
      <path d="M18.6 19 C21.4 18.4 22.4 15.7 21.1 13.4 L19.7 14.1 C20.5 15.8 19.9 17.4 18.1 17.7 Z" />
    </>
  ),
  [Dog]: (
    <path d="M6.3 5.4 C4.7 5.4 3.9 7 4.3 9.7 L5.1 14.6 C5.5 17.8 8.2 20.4 12 20.4 C15.8 20.4 18.5 17.8 18.9 14.6 L19.7 9.7 C20.1 7 19.3 5.4 17.7 5.4 C16.4 5.4 15.4 6.5 15.1 8.2 C14.2 7.7 13.1 7.4 12 7.4 C10.9 7.4 9.8 7.7 8.9 8.2 C8.6 6.5 7.6 5.4 6.3 5.4 Z" />
  ),
  [Rabbit]: (
    <path d="M8.9 2.4 C7.7 2.4 7 4.3 7.2 6.9 L7.6 10.4 C6.2 11.7 5.4 13.5 5.4 15.5 C5.4 18.5 8.3 20.7 12 20.7 C15.7 20.7 18.6 18.5 18.6 15.5 C18.6 13.5 17.8 11.7 16.4 10.4 L16.8 6.9 C17 4.3 16.3 2.4 15.1 2.4 C14 2.4 13.3 4 13.2 6.4 L13.1 8.8 C12.7 8.75 12.4 8.7 12 8.7 C11.6 8.7 11.3 8.75 10.9 8.8 L10.8 6.4 C10.7 4 10 2.4 8.9 2.4 Z" />
  ),
  [Bird]: (
    <path d="M12 15.6 C9.4 10.6 5.7 8.9 2 10.1 C5.7 9.5 8.9 11.7 12 16.1 C15.1 11.7 18.3 9.5 22 10.1 C18.3 8.9 14.6 10.6 12 15.6 Z" />
  ),
  [Fish]: (
    <path d="M2.6 12 C5.6 6.9 12.9 6.4 17 10 L21.4 6.2 L20.2 12 L21.4 17.8 L17 14 C12.9 17.6 5.6 17.1 2.6 12 Z" />
  ),
};

type DriftMote = {
  x: number;
  size: number;
  op: number;
  dur: number;
  delay: number;
  dx: number;
  rest: number;
};

type DustMote = DriftMote & { blur: number };

type AnimalMote = DriftMote & { shape: AnimalShapeType; rot: number };

const AMBIENT_DUST: DustMote[] = [
  { x: 8, size: 4, blur: 0.6, op: 0.5, dur: 21, delay: -3, dx: 10, rest: 0.52 },
  { x: 25, size: 7, blur: 2.4, op: 0.28, dur: 27, delay: -14, dx: -12, rest: 0.88 },
  { x: 43, size: 3, blur: 0.4, op: 0.55, dur: 19, delay: -11, dx: -8, rest: 0.39 },
  { x: 61, size: 4, blur: 0.8, op: 0.48, dur: 23, delay: -5, dx: -10, rest: 0.61 },
  { x: 79, size: 5, blur: 1.4, op: 0.38, dur: 25, delay: -16, dx: -9, rest: 0.45 },
  { x: 94, size: 6, blur: 1.6, op: 0.3, dur: 31, delay: -7, dx: -11, rest: 0.78 },
];

const AMBIENT_ANIMALS: AnimalMote[] = [
  { x: 16, size: 20, op: 0.42, dur: 29, delay: -12, dx: 13, rest: 0.72, shape: Cat, rot: -6 },
  { x: 34, size: 15, op: 0.46, dur: 24, delay: -8, dx: 14, rest: 0.35, shape: Bird, rot: 4 },
  { x: 52, size: 24, op: 0.38, dur: 33, delay: -22, dx: 12, rest: 0.95, shape: Dog, rot: 9 },
  { x: 70, size: 17, op: 0.44, dur: 28, delay: -19, dx: 16, rest: 0.55, shape: Rabbit, rot: -4 },
  { x: 88, size: 14, op: 0.4, dur: 26, delay: -2, dx: 11, rest: 0.25, shape: Fish, rot: 7 },
];

const SWAY_STAGGER = 2.4;

const driftVars = (mote: DriftMote): CSSProperties =>
  ({
    "--mote-left": `${mote.x}%`,
    "--mote-size": `${mote.size}px`,
    "--mote-opacity": mote.op,
    "--mote-dur": `${mote.dur}s`,
    "--mote-delay": `${mote.delay}s`,
    "--mote-x": `${mote.dx}px`,
    "--mote-rest": mote.rest,
  }) as CSSProperties;

type PulseHeroProps = {
  totalAnimals: number;
};

export const PulseHero = ({ totalAnimals }: PulseHeroProps) => {
  const { t } = useTranslation("animals");

  return (
    <div className={styles.hero}>
      <div className={styles.art} aria-hidden="true">
        <span className={styles.blobA} />
        <span className={styles.blobB} />
        <span className={styles.beam} />

        <div className={styles.motes}>
          {AMBIENT_DUST.map((mote) => (
            <span
              key={mote.x}
              className={styles.mote}
              data-dust
              style={{ ...driftVars(mote), "--mote-blur": `${mote.blur}px` } as CSSProperties}
            />
          ))}

          {AMBIENT_ANIMALS.map((mote, index) => (
            <span key={mote.x} className={styles.mote} data-glyph style={driftVars(mote)}>
              <svg
                width={mote.size}
                height={mote.size}
                viewBox="0 0 24 24"
                className={styles.glyph}
                style={
                  {
                    "--glyph-sway-delay": `${-1 - index * SWAY_STAGGER}s`,
                    "--glyph-rest-rotate": `${mote.rot}deg`,
                  } as CSSProperties
                }
              >
                {ANIMAL_SILHOUETTES[mote.shape]}
              </svg>
            </span>
          ))}
        </div>

        <span className={styles.scrim} />
      </div>

      <div className={styles.content}>
        <Title level={2} className={styles.title}>
          {t("hero.title")}
        </Title>

        <Text className={styles.stat}>
          {totalAnimals > 0
            ? t("hero.petsInCare", { count: totalAnimals })
            : t("hero.emptySubtitle")}
        </Text>
      </div>
    </div>
  );
};
