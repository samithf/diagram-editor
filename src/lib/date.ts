export const formatDate = (timestamp: unknown) => {
  if (!timestamp) return "Unknown";

  try {
    // Handle Firestore Timestamp objects
    if (
      typeof timestamp === "object" &&
      timestamp !== null &&
      "toDate" in timestamp
    ) {
      const date = (timestamp as { toDate: () => Date }).toDate();
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    // Handle regular Date strings/objects
    const date = new Date(timestamp as string);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "Invalid date";
  }
};
