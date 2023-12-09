import Head from "next/head";

let defaults = {
  title: "bday.quest",
  description: "Create virtual birthday cards",
  color: "#eb5d71",
};

export default function Meta({
  color = defaults.color,
  description = defaults.description,
  title = defaults.title,
}) {
  const url = "bday.quest";

  return (
    <Head>
      <title>{title ?? defaults.title}</title>
      <meta name="description" content={description ?? defaults.description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="theme-color" content={color ?? defaults.color} />
      <meta property="og:title" content={title ?? defaults.title} />
      <meta
        property="og:description"
        content={description ?? defaults.description}
      />
      <meta property="twitter:domain" content={url} />
      <meta property="twitter:url" content={url} />
      <meta name="twitter:title" content={title ?? defaults.title} />
      <meta
        name="twitter:description"
        content={description ?? defaults.description}
      />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
}
