import LegalLayout, { Section } from '../components/LegalLayout';

/**
 * Privacy Policy. Placeholder legal content scaffolded for BestBrain, it should
 * be reviewed by the company's legal counsel before being relied upon.
 */
export default function Privacy() {
  return (
    <LegalLayout
      title="Privacy Policy"
      updated="July 2026"
      lede={
        <>
          This Privacy Policy explains how BestBrain Learning Pvt. Ltd. (“BestBrain”, “we”, “us”)
          collects, uses, and protects information when you use our learning platform, website, and
          mobile apps (the “Service”). By using the Service you agree to the practices described here.
        </>
      }
    >
      <Section heading="1. Information we collect">
        <ul>
          <li><strong>Account information</strong> you provide at sign-up, name, email, phone number, role (student, teacher, or parent), and class, section, or board where relevant.</li>
          <li><strong>Learning activity</strong>, chapters viewed, lectures watched, tests attempted, scores, and streaks, so we can show your progress.</li>
          <li><strong>Content you upload</strong>, for teachers and admins, the video lectures and chapter notes you add.</li>
          <li><strong>Technical data</strong>, device and browser information and basic logs needed to run and secure the Service.</li>
        </ul>
      </Section>

      <Section heading="2. How we use information">
        <p>We use the information to provide and improve the Service, to authenticate you, deliver lessons for your class and subject, track progress, enable live classes and PAL AI help, and communicate important account or service updates.</p>
      </Section>

      <Section heading="3. Sharing">
        <p>We do not sell your personal information. We share it only with service providers who help us operate the Service (such as hosting and communication providers) under confidentiality obligations, or where required by law.</p>
      </Section>

      <Section heading="4. Children’s privacy">
        <p>BestBrain is used by school students, who may be minors. Student accounts are intended to be created and overseen with the involvement of a parent, guardian, teacher, or school. We collect only the information needed for learning, and a parent or guardian may request access to or deletion of a linked child’s information.</p>
      </Section>

      <Section heading="5. Data security">
        <p>We use reasonable technical and organizational measures to protect your information, including access controls and encrypted authentication tokens. No method of transmission or storage is completely secure, so we cannot guarantee absolute security.</p>
      </Section>

      <Section heading="6. Cookies and local storage">
        <p>We use browser local storage to keep you signed in and to remember preferences such as your theme and language. These are essential to how the Service works.</p>
      </Section>

      <Section heading="7. Your rights">
        <p>You may access, correct, or request deletion of your account information, and you may withdraw consent by closing your account. To make a request, contact us using the details below.</p>
      </Section>

      <Section heading="8. Changes to this policy">
        <p>We may update this policy from time to time. Material changes will be reflected by updating the “Last updated” date above.</p>
      </Section>

      <Section heading="9. Contact us">
        <p>Questions about this policy or your data can be sent to BestBrain Learning Pvt. Ltd. at the support address listed on our website.</p>
      </Section>
    </LegalLayout>
  );
}
