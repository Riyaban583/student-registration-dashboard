// Simple Client-Side Load Balancer
// Add this to your app to distribute users across multiple Vercel deployments

const VERCEL_DEPLOYMENTS = [
  'https://quiz-app-1.vercel.app',
  'https://quiz-app-2.vercel.app',
  'https://quiz-app-3.vercel.app',
  'https://quiz-app-4.vercel.app',
  'https://quiz-app-5.vercel.app',
  'https://quiz-app-6.vercel.app',
  'https://quiz-app-7.vercel.app',
  'https://quiz-app-8.vercel.app',
  'https://quiz-app-9.vercel.app',
  'https://quiz-app-10.vercel.app',
];

// Hash function to consistently assign user to same server
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

// Get assigned server for a user
export function getAssignedServer(email: string): string {
  const hash = hashString(email);
  const serverIndex = hash % VERCEL_DEPLOYMENTS.length;
  return VERCEL_DEPLOYMENTS[serverIndex];
}

// Redirect user to their assigned server
export function redirectToAssignedServer(email: string) {
  const assignedServer = getAssignedServer(email);
  const currentHost = window.location.origin;
  
  // If not on assigned server, redirect
  if (currentHost !== assignedServer) {
    const path = window.location.pathname + window.location.search;
    window.location.href = assignedServer + path;
  }
}

// Usage in student-dashboard:
// redirectToAssignedServer(user.email);
