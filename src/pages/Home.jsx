import videoFile from "/0001-0250.mp4";

export default function Home() {
  const hoverStyle = {
    transition: "transform 0.3s ease-in-out", // Smooth transition
  };

  return (
    <div className="pt-20 pb-20">
      <div className="pt-10 flex flex-col">
        <video
          autoPlay
          loop
          muted
          width="540"
          height="360"
          className="mx-auto"
          style={{ ...hoverStyle, borderRadius: "20px" }}
          onMouseOver={(e) => {
            e.target.style.transform = "scale(1.2)";
          }}
          onMouseOut={(e) => {
            e.target.style.transform = "scale(1)";
          }}
        >
          <source src={videoFile} type="video/mp4" />
        </video>
        <div className="text-center">
          <br />
          <p
            className="text-center"
            style={{ color: "var(--header-color)", fontSize: "2rem" }}
          >
            Is your favorite meme safe?
          </p>
          <br />
          <div className="text-left">
            <p
              style={{
                color: "var(--description-color)",
                fontSize: "1.2rem",
                maxWidth: "800px",
                margin: "0 auto",
              }}
            >
              Not all memes are equal. Not all memes are safe. Thats why we
              created this dashboard to help you find the safest memes to invest
              in.
            </p>
            <br />
            <p
              style={{
                color: "var(--content-color)",
                fontSize: "1.2rem",
                maxWidth: "800px",
                margin: "0 auto",
              }}
            >
              From liquidity concentration to centralization risk, we have a
              dashboard to cover it all.
            </p>
            <br />
            <p
              style={{
                color: "var(--content-color)",
                fontSize: "1.2rem",
                maxWidth: "800px",
                margin: "0 auto",
              }}
            >
              We hope you find this dashboard useful and if you have any
              questions or feedback, please reach out to us on Twitter
              @SafeMemeX.
            </p>
            <br />
            <p
              style={{
                color: "var(--content-color)",
                fontSize: "1.2rem",
                maxWidth: "800px",
                margin: "0 auto",
              }}
            >
              If you dont see your meme on our dashboard and want to, then
              please submit it on the{" "}
              <a href="https://app.deform.cc/form/e5410f05-4cf4-4cd4-85dc-08a4b3191ebf">
                Safememe Submission Form.
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
