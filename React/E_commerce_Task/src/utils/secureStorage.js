import SecureLS from "secure-ls";

const secretKey = import.meta.env.VITE_APP_SECRET_KEY;

const ls = new SecureLS.default({
    encodingType: "aes",
    encryptionSecret: secretKey,
});

export default ls;