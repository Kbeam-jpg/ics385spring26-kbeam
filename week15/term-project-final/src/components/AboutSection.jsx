export default function AboutSection({ description, title, image}) {
  return (
    <section className="about">
      <img className="about-Img" src={image} alt={"placeholder"} />
      <div className="about-text">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </section>
  );
}
