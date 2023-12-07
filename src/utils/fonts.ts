import localFont from "next/font/local";

const satoshi = localFont({
  src: "../fonts/Satoshi-Regular.woff2",
});
const clash = localFont({
  src: "../fonts/ClashDisplay-Medium.woff2",
});
const clashRegular = localFont({
  src: "../fonts/ClashDisplay-Regular.woff2",
});

const fonts = {
  satoshi,
  clash,
  clashRegular,
};

export default fonts;
