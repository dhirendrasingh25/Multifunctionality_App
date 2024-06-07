export const corsOptions = {
  origin: ["http://localhost:5173", process.env.CLIENT_URL],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

export const SECURITY_TOKEN = "security-token";
