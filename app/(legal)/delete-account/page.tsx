import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Delete Your DuoDate Account",
  description:
    "How to delete your DuoDate account and its data, in the app or by email.",
};

export default function DeleteAccountPage() {
  return (
    <>
      <h1>Delete your DuoDate account</h1>
      <p className="meta">DuoDate, by Jal Devecais</p>

      <p>
        You can delete your DuoDate account and its data at any time, in the
        app or by email. To ask by email, you do not need to have the app
        installed.
      </p>

      <p className="note">
        <strong>Deleting your account also deletes your couple.</strong> Your
        shared dates, cover photos, fits, goals and achievements are deleted
        for your partner too. This cannot be undone.
      </p>

      <h2>How to delete your account</h2>
      <h3>In the app</h3>
      <p>
        Go to the Us screen, tap Delete account, then hold the button to
        confirm. Your account is deleted right away. Delete account is also on
        the screen you see after a couple ends.
      </p>
      <h3>By email, without the app</h3>
      <ol>
        <li>
          Email{" "}
          <a href="mailto:supportduodate@gmail.com">
            supportduodate@gmail.com
          </a>{" "}
          from the email address you use to sign in to DuoDate.
        </li>
        <li>
          Use the subject line &quot;Delete my DuoDate account&quot;.
        </li>
        <li>We reply to confirm that the request came from you.</li>
        <li>
          We delete your account within 30 days of your confirmation, and we
          email you when it is done.
        </li>
      </ol>
      <p>
        If you can no longer use that email address, tell us when you contact
        us and we will ask for other details to confirm the account is yours.
      </p>

      <h2>What we delete</h2>
      <ul>
        <li>Your account, email address and display name.</li>
        <li>Your profile photo, mood and preferences.</li>
        <li>Your push tokens.</li>
        <li>
          Your couple and everything shared in it: dates, cover photos, fits
          and outfit photos, goals and achievements.
        </li>
      </ul>

      <h2>What may remain for a limited time</h2>
      <ul>
        <li>
          <strong>Backups and logs:</strong> copies in routine backups and
          technical logs held by our service providers are removed on their
          normal schedules.
        </li>
        <li>
          <strong>Legal records:</strong> we keep limited information for
          longer only if the law requires it, or to handle a dispute or safety
          report. For example, we may keep a record that your request was
          completed.
        </li>
        <li>
          <strong>Reports:</strong> reports you sent, or that name you, stay
          without a link to your account.
        </li>
        <li>
          <strong>Your phone:</strong> reminder settings, partner tile photos
          and temporary photo copies stay on your phone until you remove the
          app.
        </li>
      </ul>

      <h2>Only want to separate from your partner?</h2>
      <p>
        You do not need to delete your account. Use End couple on the Us
        screen. Both of you lose access to shared content right away, and it is
        kept for 30 days in case you both choose to reconnect. Read more in our{" "}
        <Link href="/privacy">Privacy Policy</Link>.
      </p>
    </>
  );
}
