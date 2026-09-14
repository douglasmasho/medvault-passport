/**
 * One-off account-recovery script: removes ALL enrolled MFA factors
 * (e.g. a TOTP enrollment tied to a lost Authy install) from a single
 * Firebase Auth user, so they can sign in again and re-enroll a new
 * authenticator app from Settings.
 *
 * This is NOT deployed as a Cloud Function — it only runs when you
 * invoke it manually, with your own service account credentials.
 * Nobody else can trigger this.
 *
 * SETUP (one time):
 *   1. Firebase Console -> Project settings -> Service accounts
 *      -> "Generate new private key". Save the JSON somewhere safe,
 *      OUTSIDE this git repo (e.g. your Desktop), so it never gets committed.
 *   2. This uses the "firebase-admin" package already installed at the
 *      repo root (this "functions" folder has no node_modules of its own).
 *
 * USAGE (from this "functions" folder):
 *   $env:GOOGLE_APPLICATION_CREDENTIALS = "C:\path\to\service-account.json"
 *   node scripts/disable-mfa.cjs --email you@example.com --dry-run
 *
 * Drop --dry-run once the output looks right to actually make the change.
 */

const { initializeApp, applicationDefault } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");

function parseArgs(argv) {
  const out = { dryRun: false };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--email") out.email = argv[++i];
    else if (arg === "--dry-run") out.dryRun = true;
  }
  return out;
}

async function main() {
  const { email, dryRun } = parseArgs(process.argv.slice(2));

  if (!email) {
    console.error(
      "Usage: node scripts/disable-mfa.cjs --email you@example.com [--dry-run]"
    );
    process.exit(1);
  }

  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    console.error(
      "GOOGLE_APPLICATION_CREDENTIALS is not set.\n" +
        "Set it to the path of your downloaded service-account JSON key first, e.g.\n" +
        '  (PowerShell) $env:GOOGLE_APPLICATION_CREDENTIALS = "C:\\path\\to\\key.json"'
    );
    process.exit(1);
  }

  initializeApp({ credential: applicationDefault() });
  const auth = getAuth();

  const user = await auth.getUserByEmail(email);
  const enrolled = user.multiFactor?.enrolledFactors || [];

  console.log(`User: ${user.uid} (${user.email})`);
  console.log(`Currently enrolled MFA factors: ${enrolled.length}`);
  enrolled.forEach((f) =>
    console.log(`  - uid=${f.uid} factorId=${f.factorId} displayName=${f.displayName || "(none)"}`)
  );

  if (enrolled.length === 0) {
    console.log("No MFA factors enrolled — nothing to do.");
    return;
  }

  if (dryRun) {
    console.log("\n--dry-run set: not making any changes.");
    return;
  }

  await auth.updateUser(user.uid, {
    multiFactor: { enrolledFactors: [] },
  });

  console.log(
    "\nDone. All MFA factors removed. You can now sign in with just " +
      "email + password, then re-enable 2FA from Settings using your new authenticator app."
  );
}

main().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});
