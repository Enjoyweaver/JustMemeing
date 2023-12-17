import imageFile from "../assets/DAOsigner.png";

export default function Home() {
  return (
    <div className="pt-40 flex items-center">
      <div className="w-1/2 text-center pl-20">
        <img src={imageFile} alt="DAOsigner Apparel" width="690" height="580" />
      </div>
      <div className="w-1/2 text-left" style={{ maxWidth: "800px" }}>
        <p
          className="text-left"
          style={{ color: "var(--header-color)", fontSize: "3rem" }}
        >
          Safe Meme
        </p>
        <br></br>
        <p
          className="text-left"
          style={{ color: "var(--header-color)", fontSize: "2rem" }}
        >
          Is your favorite meme safe to own?
        </p>

        <br></br>
        <div className="text-left">
          <p style={{ color: "var(--description-color)", fontSize: "1.2rem" }}>
            Not all memes are created equal and thats why we created this
            dashboard to help you find the safest memes to invest in. We use a
            combination of metrics to determine the safety of a meme and then
            use these metrics to calculate a safety score for each meme. The
            higher the score, the safer the meme.
          </p>
          <br />
          <p style={{ color: "var(--content-color)", fontSize: "1.2rem" }}>
            The metrics will start with centralization risk which is a measure
            of the degreee to which the team behind the meme can later change or
            update any details. For example, a rugpull can be a centralization
            risk based on the team being able to update proxy contracts, revoke
            access to liquidity, or by not revoking ownership of the token
            itself.
          </p>
          <br />
          <p style={{ color: "var(--content-color)", fontSize: "1.2rem" }}>
            We hope you find this dashboard useful and if you have any questions
            or feedback, please reach out to us on Twitter @SafeMemeX.
          </p>
          <br />
          <p style={{ color: "var(--content-color)", fontSize: "1.2rem" }}>
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
