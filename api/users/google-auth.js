export default async function handler(req, res) {
  // --- CORS HEADERS ---
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://financial-dashboard-wwwp.vercel.app"
  );
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  // --- HANDLE PREFLIGHT ---
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { token } = req.body;

    // TODO: verify Google token here
    // For now, just test:
    return res.status(200).json({
      success: true,
      message: "Google auth endpoint working",
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
