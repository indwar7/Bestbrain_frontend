import LegalLayout, { Section } from '../components/LegalLayout';

/**
 * Terms of Service. Placeholder legal content scaffolded for BestBrain, it
 * should be reviewed by the company's legal counsel before being relied upon.
 */
export default function Terms() {
  return (
    <LegalLayout
      title="Terms of Service"
      updated="July 2026"
      lede={
        <>
          These Terms govern your use of the BestBrain platform, website, and mobile apps (the
          “Service”), operated by BestBrain Learning Pvt. Ltd. (“BestBrain”, “we”, “us”). By creating
          an account or using the Service, you agree to these Terms.
        </>
      }
    >
      <Section heading="1. Eligibility">
        <p>The Service is intended for students, teachers, and parents. If you are a minor, you may use the Service only with the involvement and consent of a parent, guardian, or school.</p>
      </Section>

      <Section heading="2. Your account">
        <p>You are responsible for the information you provide and for keeping your login credentials secure. You must use a role (student, teacher, or parent) that matches your actual capacity, and you may not share or transfer your account.</p>
      </Section>

      <Section heading="3. Acceptable use">
        <ul>
          <li>Use the Service only for lawful, educational purposes.</li>
          <li>Do not attempt to disrupt, reverse-engineer, or gain unauthorized access to the Service or other users’ data.</li>
          <li>Do not upload content that is unlawful, infringing, or inappropriate for a school audience.</li>
        </ul>
      </Section>

      <Section heading="4. Teacher and admin content">
        <p>Teachers and admins may upload lecture videos and chapter notes. You confirm that you have the right to share what you upload, and you grant BestBrain a license to host and deliver that content to eligible students within the Service. You remain responsible for your content, and we may remove content that violates these Terms.</p>
      </Section>

      <Section heading="5. Intellectual property">
        <p>The Service, including its software, design, and BestBrain-provided content, is owned by BestBrain and protected by law. Except for content you upload, you may not copy, distribute, or create derivative works without our permission.</p>
      </Section>

      <Section heading="6. Disclaimers">
        <p>The Service is provided “as is” and “as available”. We work to keep it accurate and reliable but do not warrant that it will be uninterrupted, error-free, or fit for a particular purpose.</p>
      </Section>

      <Section heading="7. Limitation of liability">
        <p>To the extent permitted by law, BestBrain will not be liable for indirect, incidental, or consequential damages arising from your use of the Service.</p>
      </Section>

      <Section heading="8. Termination">
        <p>You may stop using the Service at any time. We may suspend or terminate access that violates these Terms or that is required to protect the Service or its users.</p>
      </Section>

      <Section heading="9. Governing law">
        <p>These Terms are governed by the laws of India, and any disputes are subject to the jurisdiction of the competent courts in India.</p>
      </Section>

      <Section heading="10. Changes">
        <p>We may update these Terms from time to time. Continued use of the Service after changes take effect constitutes acceptance of the updated Terms.</p>
      </Section>

      <Section heading="11. Contact us">
        <p>Questions about these Terms can be sent to BestBrain Learning Pvt. Ltd. at the support address listed on our website.</p>
      </Section>
    </LegalLayout>
  );
}
