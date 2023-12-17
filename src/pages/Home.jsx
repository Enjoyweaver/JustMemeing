import videoFile from "/0001-0250.mp4";

export default function Home() {
  return (
    <div className="pt-40 flex flex-col">
      <video autoPlay loop muted width="840" height="660" className="mx-auto">
        <source src={videoFile} type="video/mp4" />
      </video>
      <div className="text-center">
        <br />
        <p
          className="text-center"
          style={{ color: "var(--header-color)", fontSize: "2rem" }}
        >
          Is your favorite meme safe to own?
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
            Not all memes are created equal and thats why we created this
            dashboard to help you find the safest memes to invest in. We use a
            combination of metrics to determine the safety of a meme and then
            use these metrics to calculate a safety score for each meme. The
            higher the score, the safer the meme.
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
            The metrics will start with centralization risk which is a measure
            of the degreee to which the team behind the meme can later change or
            update any details. For example, a rugpull can be a centralization
            risk based on the team being able to update proxy contracts, revoke
            access to liquidity, or by not revoking ownership of the token
            itself.
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
            We hope you find this dashboard useful and if you have any questions
            or feedback, please reach out to us on Twitter @SafeMemeX.
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
            If you dont see your meme on our dashboard and want to, then please
            submit it on the{" "}
            <a href="https://app.deform.cc/form/27997b11-7f60-4298-9c99-7226ff9305eb/">
              Meme Submission Form.
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
