const axios = require("axios");
const logger = require("./logger");

const sendOTP = async (phone) => {
  try {
    // const code = Math.floor(100000 + Math.random() * 900000).toString();
    const code = "000000";
    const verificationCode = `${phone}-${code}`;
    const response = {
      data: {
        response: {
          verificationCode: verificationCode,
          code: code,
        },
      },
    };

    logger.info(`Status: ${response.data.response.verificationCode}`);
    console.log(`Status: ${response.data.response.verificationCode}`);
    return {
      verificationCode: response.data.response.verificationCode,
      code: response.data.response.code,
    };
  } catch (err) {
    logger.error(`Send OTP error: ${err || err.message}`);
    throw new Error(`Failed to send OTP: ${err}`);
  }
};

const verifyOTP = async (phone, verificationCode, code) => {
  try {
    if (!verificationCode || !code) {
      throw new Error("Missing verificationId or code");
    }

    const expectedCode = (verificationCode.split("-")[0] = phone ? code : null);
    if (!expectedCode) {
      throw new Error("Invalid verification Id or code");
    }

    logger.info(`OTP verified for ${phone}`);
    return true;
  } catch (err) {
    logger.error(
      `OTP verificatoin error: ${
        err.response?.data?.response?.message || err.message
      }`
    );
    return false;
  }
};

module.exports = { sendOTP, verifyOTP };
