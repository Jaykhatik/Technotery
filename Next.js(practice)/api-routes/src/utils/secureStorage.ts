import SecureLS from "secure-ls";

// Only initialize SecureLS on the client side (localStorage doesn't exist on the server)
const ls = typeof window !== "undefined" ? new SecureLS({ encodingType: "aes" }) : null;

export default ls;
