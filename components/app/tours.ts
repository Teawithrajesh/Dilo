import type { TourStep } from "./Tour";

const tab = (href: string) => `nav[aria-label="App"] a[href="${href}"]`;

/** First visit to Home: a short walk through the whole app. */
export const homeTour: TourStep[] = [
  {
    title: "Welcome to DILO, {name}!",
    body: "DILO helps your family turn birthdays, weddings and anniversaries into one dream that everyone makes come true together. Let me show you around. It takes one minute.",
  },
  {
    target: '[data-testid="sparkles-card"]',
    title: "Daily Sparkles",
    body: "Open DILO every day and collect Sparkles. Come back 7 days in a row for the biggest reward.",
  },
  {
    target: '[data-testid="dreams-spotlight"]',
    title: "Dreams that came true",
    body: "Here you'll see wishes your family made come true. Tap a card to open that celebration.",
  },
  {
    target: '[data-tour="communities"]',
    title: "Your communities",
    body: "Private groups for your family or friends. Only people the admin approves can see what's inside.",
  },
  {
    target: '[data-testid="create-own"]',
    title: "Start your own community",
    body: "Make one for your side of the family, your in-laws or your friends, then invite them with a private link.",
  },
  {
    target: '[data-tour="upcoming"]',
    title: "Upcoming celebrations",
    body: "Every celebration has a dream, a wishlist and the family's contributions. Tap one to see how close the dream is.",
  },
  {
    target: tab("/communities/"),
    title: "Communities tab",
    body: "Open a community to add a Birthday, Engagement, Wedding or Anniversary. Everyone in it gets a notification.",
  },
  {
    target: tab("/notifications/"),
    title: "Notifications",
    body: "New celebrations, join requests and updates from your family show up here.",
  },
  {
    target: tab("/profile/"),
    title: "Your profile",
    body: "Change your name and privacy, send us feedback, or take this tour again any time.",
  },
];

/** First visit to a celebration page. */
export const eventTour: TourStep[] = [
  {
    target: '[data-tour="progress"]',
    title: "How close is the dream?",
    body: "This ring shows how much the family has recorded towards the goal. People give the way they always do, cash or UPI. DILO never handles money.",
  },
  {
    target: '[data-tour="dream"]',
    title: "The dream wish",
    body: "The one big thing this person really wants, and its estimated budget.",
  },
  {
    target: '[data-tour="wishlist"]',
    title: "Wishlist",
    body: "Smaller wishes that make up the dream. The organiser adds them and ticks them off when they're covered.",
  },
  {
    target: '[data-tour="contributions"]',
    title: "Record your contribution",
    body: "After you give, record it here so everyone sees the dream getting closer. You can stay anonymous to others. It shows as Self-reported until the organiser confirms it.",
  },
];
