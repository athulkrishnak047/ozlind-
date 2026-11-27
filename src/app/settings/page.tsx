import type { Metadata } from "next";
import { SettingsPanel } from "@/components/settings-panel";
export const metadata: Metadata = { title: "Settings", description: "Manage your Ozlind workspace preferences, profile, and local data." };
export default function SettingsPage() { return <SettingsPanel />; }
