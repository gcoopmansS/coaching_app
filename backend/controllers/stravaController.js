const axios = require("axios");
const User = require("../models/User");

exports.connectStrava = (req, res) => {
  const { userId } = req.query;
  const redirectUri = `${process.env.STRAVA_REDIRECT_URI}?userId=${userId}`;

  const authUrl = `https://www.strava.com/oauth/authorize?client_id=${process.env.STRAVA_CLIENT_ID}&response_type=code&redirect_uri=${redirectUri}&scope=read,activity:read`;

  res.redirect(authUrl);
};

exports.stravaCallback = async (req, res) => {
  const { code, userId } = req.query;

  try {
    const response = await axios.post("https://www.strava.com/oauth/token", {
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      code,
      grant_type: "authorization_code",
    });

    const { access_token, refresh_token, expires_at, athlete } = response.data;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        strava: {
          accessToken: access_token,
          refreshToken: refresh_token,
          expiresAt: expires_at,
          athleteId: athlete.id,
          username: athlete.username,
          firstname: athlete.firstname,
          lastname: athlete.lastname,
          city: athlete.city,
          country: athlete.country,
          profile: athlete.profile,
          profileMedium: athlete.profile_medium,
        },
      },
      { new: true }
    );

    res.redirect(`${process.env.FRONTEND_URL}/strava-landing?strava=connected`);
  } catch (err) {
    console.error("Strava callback failed:", err.response?.data || err.message);
    res.status(500).json({ message: "Strava authentication failed" });
  }
};
