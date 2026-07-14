interface Photo {
  src: string;
  alt: string;
}

interface Video {
  src: string; // mp4 url or youtube embed url
  poster?: string;
}

interface AboutUsProps {
  title?: string;
  content?: string;
  photos?: Photo[];
  videos?: Video[];
}

export default function AboutUs({
  title = "About Us ESS ARR SUNDAR",
  content = "ESS ARR Enterprises has been a leading provider of LED screen and AV rental solutions in Chennai, delivering reliable equipment and service for events of every scale. With years of industry expertise, we specialize in transforming corporate conferences, grand weddings, live concerts, and exhibition booths into immersive visual experiences. Our extensive inventory features cutting-edge indoor and outdoor LED displays, high-fidelity sound systems, and professional staging gear. Backed by a dedicated team of technical experts who handle everything from seamless installation to live event support, we ensure your production runs flawlessly from start to finish.",
  photos = [ { src: "/images/Founder_sundar_0.png", alt: "ESS ARR Sundar" },
        { src: "/images/Founder_sundar_1.png", alt: "ESS ARR Sundar" },],
  videos = [],
}: AboutUsProps) {
  return (
    <section className="about-section" id="about">
      <div className="about-container">
        <div className="about-content">
          <h1 className="about-title">{title}</h1>
          <p className="about-text">{content}</p>
        </div>

        <div className="about-galleries">
          {photos.length > 0 && (
            <div>
              <h2 className="gallery-title">Photo Gallery</h2>
              <div className="photo-gallery-grid">
                {photos.map((photo, i) => (
                  <img key={i} src={photo.src} alt={photo.alt} />
                ))}
              </div>
            </div>
          )}

          {videos.length > 0 && (
            <div>
              <h2 className="gallery-title">Video Gallery</h2>
              <div className="video-gallery-grid">
                {videos.map((video, i) =>
                  video.src.includes("youtube.com") || video.src.includes("youtu.be") ? (
                    <iframe key={i} src={video.src} allowFullScreen />
                  ) : (
                    <video key={i} src={video.src} poster={video.poster} controls />
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
