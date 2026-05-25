"use client";

export default function Greeting() {
  const hour = new Date().getHours(); // now runs in user's browser
  const greeting =
    hour < 12 ? "Good morning" :
    hour < 17 ? "Good afternoon" : "Good evening";

  return <span>{greeting} 👋</span>;
}