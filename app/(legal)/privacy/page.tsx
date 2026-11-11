import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "DuoDate Privacy Policy",
  description:
    "What information DuoDate collects, why, who receives it, how long it is kept, and the choices you have.",
};

export default function PrivacyPage() {
  return (
    <>
      <h1>DuoDate Privacy Policy</h1>
      <p className="meta">Effective November 14, 2026</p>

      <p>
        DuoDate is a mobile app that helps couples plan dates together. DuoDate
        is run by Jal Devecais, based in the Philippines (&quot;we&quot; or
        &quot;us&quot;). This policy explains what information DuoDate
        collects, why, who receives it, how long it is kept, and the choices
        you have.
      </p>
      <p>
        For any privacy question, email{" "}
        <a href="mailto:supportduodate@gmail.com">supportduodate@gmail.com</a>.
      </p>

      <h2>Information we collect</h2>
      <h3>Information you give us</h3>
      <ul>
        <li>
          <strong>Account:</strong> your email address, which we use to send
          sign-in codes, your display name, and when you accepted our terms.
        </li>
        <li>
          <strong>Profile:</strong> your profile photo, if you add one.
        </li>
        <li>
          <strong>Your couple:</strong> the link between you and your partner,
          your invite code, and the date you got together, if you add one.
        </li>
        <li>
          <strong>Dates:</strong> title, venue name and address, date and time,
          vibe, notes, whether the date is outdoors, its status, and a cover
          photo if you add one.
        </li>
        <li>
          <strong>Fits:</strong> outfit photos, colour tags and descriptions
          you add to a date.
        </li>
        <li>
          <strong>Mood:</strong> your current mood and an optional short note.
          A new mood replaces the previous one.
        </li>
        <li>
          <strong>Preferences:</strong> the things you mark as loved, wanted or
          not for you.
        </li>
        <li>
          <strong>Goals and achievements:</strong> shared goals, their list
          items and progress, and achievements you earn together.
        </li>
        <li>
          <strong>Reports:</strong> the reason and details you send if you
          report someone.
        </li>
      </ul>
      <p>
        DuoDate does not ask for sensitive information such as health details.
        Please do not enter it in notes or other text fields.
      </p>

      <h3>Information collected automatically</h3>
      <ul>
        <li>
          <strong>Push token:</strong> if you allow notifications, a token that
          lets us send notifications to your phone.
        </li>
        <li>
          <strong>Technical logs:</strong> when the app connects to our
          servers, our hosting provider records technical information such as
          IP address, request details and sign-in times.
        </li>
      </ul>

      <h3>Information kept only on your phone</h3>
      <p>
        Your reminder settings, your cover scene, and the photos you add to
        your partner tile stay on your phone. DuoDate also keeps temporary
        copies of shared photos on your phone so they load faster. Removing the
        app removes this information.
      </p>

      <h3>Permissions</h3>
      <p>
        DuoDate uses your camera and photo library only when you choose to add
        a photo. Only the photo you choose is compressed and uploaded.
        Notifications are optional.
      </p>

      <h3>What DuoDate does not collect</h3>
      <p>
        DuoDate does not collect your device location, your contacts or payment
        details. DuoDate contains no advertising and no third-party analytics.
      </p>

      <h2>How we use information</h2>
      <ul>
        <li>To create your account and sign you in.</li>
        <li>To show and sync your content between you and your partner.</li>
        <li>
          To send notifications, such as when your partner adds a date.
        </li>
        <li>To keep DuoDate secure, prevent abuse and act on reports.</li>
        <li>To comply with the law.</li>
      </ul>
      <p>
        We do not sell your personal information and we do not use it for
        advertising.
      </p>

      <h2>Who receives your information</h2>
      <h3>Your partner</h3>
      <p>
        Once you pair, your partner can see your display name, profile photo,
        mood and preferences, and the dates, fits, goals and achievements in
        your couple.
      </p>

      <h3>Service providers</h3>
      <p>These companies process information for us so that DuoDate can work:</p>
      <ul>
        <li>
          <strong>Supabase</strong> provides our database, sign-in, photo
          storage and server functions. Your information is stored in Tokyo,
          Japan.
        </li>
        <li>
          <strong>Resend</strong> delivers sign-in emails and receives your
          email address and sign-in code. It also delivers report alerts to us,
          which contain the report and the account ids involved.
        </li>
        <li>
          <strong>Expo</strong> sends push notifications and receives your push
          token and the notification text, which can include a display name and
          a venue name.
        </li>
        <li>
          <strong>Apple</strong> and <strong>Google</strong> deliver push
          notifications to your phone.
        </li>
      </ul>

      <h3>Legal reasons and business transfers</h3>
      <p>
        We may disclose information when the law requires it, or when it is
        necessary to protect someone&apos;s safety. If DuoDate is sold or
        transferred to a new owner, your information may transfer with it, and
        we will tell you first.
      </p>

      <h2>International transfers</h2>
      <p>
        Your information is stored in Japan and our service providers may
        process it in other countries, including the United States. These
        countries may have different data protection laws from yours. Where the
        law requires it, we use appropriate safeguards for these transfers.
      </p>

      <h2>How long we keep information</h2>
      <ul>
        <li>
          <strong>Your account:</strong> we keep your account information until
          you delete your account.
        </li>
        <li>
          <strong>When a couple ends:</strong> both partners lose access to
          shared data right away. We keep the shared data for 30 days so that
          you can both choose to reconnect. After 30 days, or as soon as either
          person pairs with someone new, a daily clean-up permanently deletes
          the shared dates, fits, goals, achievements and photo files. Each
          person&apos;s profile photo, mood and preferences stay with their own
          account.
        </li>
        <li>
          <strong>When you delete your account:</strong> we delete your
          information and your couple. This also deletes the couple&apos;s
          shared information for your partner. See{" "}
          <Link href="/delete-account">how to delete your account</Link>.
        </li>
        <li>
          <strong>Push tokens:</strong> we keep a token until it stops working
          or your account is deleted.
        </li>
        <li>
          <strong>Reports:</strong> we keep reports to handle safety concerns.
          If an account is deleted, the report stays without a link to that
          account.
        </li>
        <li>
          <strong>Backups and logs:</strong> copies in routine backups and
          technical logs held by our service providers are removed on their
          normal schedules.
        </li>
        <li>
          <strong>Legal retention:</strong> we keep limited information for
          longer only if the law requires it, or to handle a dispute or safety
          report. For example, we may keep a record that a deletion request was
          completed.
        </li>
      </ul>

      <h2>Security</h2>
      <p>
        Traffic between the app and our servers is encrypted. Access rules
        limit your information to you and your partner. Photos are kept in
        private storage and are opened through time-limited links. No system is
        perfectly secure, so we cannot guarantee absolute security.
      </p>

      <h2>Your choices and rights</h2>
      <ul>
        <li>Change your mood and preferences in the app.</li>
        <li>
          Turn off notifications, camera or photo access in your phone
          settings.
        </li>
        <li>End your couple from the Us screen.</li>
        <li>
          <Link href="/delete-account">Delete your account</Link>.
        </li>
      </ul>
      <p>
        Depending on where you live, you may have the right to access, correct,
        delete or receive a copy of your information, to object to or restrict
        how we use it, and to complain to your data protection authority. To
        use these rights, email{" "}
        <a href="mailto:supportduodate@gmail.com">supportduodate@gmail.com</a>.
        We respond within 30 days.
      </p>

      <h2>Legal bases in the EEA and UK</h2>
      <p>
        If you are in the European Economic Area or the United Kingdom, we use
        your information because it is necessary to provide DuoDate under our
        contract with you, for our legitimate interests in keeping DuoDate
        secure and preventing abuse, to comply with the law, and with your
        consent for optional permissions such as notifications. You can
        withdraw consent at any time in your phone settings.
      </p>

      <h2>Children</h2>
      <p>
        DuoDate is for adults aged 18 and over. It is not directed at children.
        If we learn that we hold information about someone under 18, we delete
        it.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        If we change this policy, we update the effective date on this page. If
        a change is significant, we tell you in the app or by email before it
        applies.
      </p>

      <h2>Contact</h2>
      <p>
        Jal Devecais
        <br />
        <a href="mailto:supportduodate@gmail.com">supportduodate@gmail.com</a>
      </p>
    </>
  );
}
