/** Guests (not signed in): a random id kept beside the hashed IP, so a free-use quota survives a changed IP. */
export const GUEST_COOKIE = "pv_gid";
export const GUEST_ID = /^[a-z0-9]{16,32}$/;
/** The path of the page being rendered, passed by the proxy for the section gate. */
export const PATH_HEADER = "x-pv-path";
