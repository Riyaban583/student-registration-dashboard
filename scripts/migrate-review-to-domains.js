// Migration script: Copy old `review` marks into reviewDomain1/reviewDomain2
// based on which domain matches "Photography, Videography & Graphics" or "Web Development"

const { MongoClient } = require("mongodb");

const MONGODB_URI = "mongodb+srv://dscrtuofficial:cYSvfj3r2eI6ZL8V@cluster0.ip6q0.mongodb.net/ptp2026";

const INTERVIEW_DONE_DOMAINS = [
  "Photography & Videography",
  "Graphic",
  "Web dev",
];

async function migrate() {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db("ptp2026");
  const collection = db.collection("students");

  // Find students who have a review value and haven't been migrated yet
  const students = await collection
    .find({ review: { $ne: null } })
    .toArray();

  console.log(`Found ${students.length} students with existing review marks`);

  let updatedCount = 0;

  for (const student of students) {
    const domains = student.domain || [];
    const oldReview = student.review;
    const update = {};

    // Check Domain 1 (index 0)
    if (domains[0] && INTERVIEW_DONE_DOMAINS.includes(domains[0])) {
      // Only set if reviewDomain1 is not already filled
      if (student.reviewDomain1 == null) {
        update.reviewDomain1 = oldReview;
      }
    }

    // Check Domain 2 (index 1)
    if (domains[1] && INTERVIEW_DONE_DOMAINS.includes(domains[1])) {
      // Only set if reviewDomain2 is not already filled
      if (student.reviewDomain2 == null) {
        update.reviewDomain2 = oldReview;
      }
    }

    if (Object.keys(update).length > 0) {
      await collection.updateOne({ _id: student._id }, { $set: update });
      console.log(
        `✅ ${student.name} (${student.rollNumber}) — domains: [${domains.join(", ")}] → updated:`,
        update
      );
      updatedCount++;
    } else {
      console.log(
        `⏭️  ${student.name} (${student.rollNumber}) — domains: [${domains.join(", ")}] → no matching domain, skipped`
      );
    }
  }

  console.log(`\nDone! Updated ${updatedCount} out of ${students.length} students.`);
  await client.close();
}

migrate().catch(console.error);
