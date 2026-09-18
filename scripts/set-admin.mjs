import fs from "fs";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const serviceAccountPath =
  "D:\\firebase-secrets\\zarr-jewels-firebase-adminsdk-fbsvc-25a9138e25.json";

const serviceAccount = JSON.parse(
  fs.readFileSync(serviceAccountPath, "utf8")
);

const app =
  getApps().length > 0
    ? getApps()[0]
    : initializeApp({
        credential: cert(serviceAccount),
      });

const adminAuth = getAuth(app);

const adminEmail = "zarrjewelss@gmail.com";

try {
  const user = await adminAuth.getUserByEmail(adminEmail);

  await adminAuth.setCustomUserClaims(user.uid, {
    admin: true,
  });

  console.log(`✅ Admin role assigned to ${adminEmail}`);
  console.log("Admin claim: admin=true");
} catch (error) {
  console.error("❌ Failed to assign admin role:");
  console.error(error);
  process.exit(1);
}