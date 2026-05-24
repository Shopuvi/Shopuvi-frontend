import { Metadata } from "next";
import StorefrontClient from "./StorefrontClient";

interface Props {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const clean = username.replace("@", "");
  return {
    title: `@${clean} on Shopuvi`,
    description: `Browse products from ${clean} on Shopuvi marketplace.`,
  };
}

export default async function StorefrontPage({ params }: Props) {
  const { username } = await params;
  const clean = username.replace("@", "");
  return <StorefrontClient username={clean} />;
}