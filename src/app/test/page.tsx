export default function TestPage() {
  return (
    <div style={{ width: "100vw", height: "100vh", backgroundColor: "black" }}>
      <h1 style={{ color: "white", padding: "10px" }}>Videasy Test - The Office S01E01</h1>
      
      {/* Exactly as per docs - 16:9 responsive container */}
      <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
        <iframe
          src="https://player.videasy.net/tv/2316/1/1"
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
          frameBorder="0"
          allowFullScreen
          allow="encrypted-media"
        ></iframe>
      </div>
    </div>
  );
}
