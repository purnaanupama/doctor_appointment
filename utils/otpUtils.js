import speakeasy from 'speakeasy';

export const verifyOtp = (token) => {
    return speakeasy.totp.verifyDelta({
        secret: process.env.OTP_KEY,
        encoding: 'base32',
        token: token,
        step: 30,
        window: 4,
    });
};

export const generateOtp = () => {
    return speakeasy.totp({
        secret: process.env.OTP_KEY,
        encoding: 'base32',
        digits: 6,
        step: 30,
    });
};
