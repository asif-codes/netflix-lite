import Link from "next/link";
import Card from "./card";
import styles from "./section-cards.module.css";

type SectionVideos = { id: string | { videoId: string }; imgUrl?: string }[];

interface SectionProps {
  title: string;
  videos: SectionVideos;
  size: CardSize;
  shouldWrap?: boolean;
  shouldScale?: boolean;
}

const SectionCards: React.FC<SectionProps> = (props) => {
  const { title, videos = [], size, shouldWrap = false, shouldScale } = props;

  return (
    <section className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
      <div className={`${styles.cardWrapper} ${shouldWrap && styles.wrap}`}>
        {videos.map((video, idx) => {
          return (
            <Link href={`/video/${video.id}`} key={idx}>
              <a>
                <Card
                  id={idx}
                  imgUrl={video.imgUrl}
                  size={size}
                  shouldScale={shouldScale}
                />
              </a>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default SectionCards;
