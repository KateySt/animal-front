import { Typography } from "antd";
import { useTranslation } from "react-i18next";
import { LandingSection } from "./LandingSection.tsx";
import { MAX_DOCUMENT_SIZE_BYTES, MAX_DOCUMENTS_PER_SESSION } from "../../../constants";
import styles from "./LandingFaq.module.scss";

const { Title, Paragraph } = Typography;

const FAQ_KEYS = ["who", "assistant", "documents", "payments", "languages", "signup"];
const BYTES_IN_MB = 1024 * 1024;

const toJsonLd = (value: object) => JSON.stringify(value).replace(/</g, "\\u003c");

export const LandingFaq = () => {
  const { t } = useTranslation("landing");

  const items = FAQ_KEYS.map((key) => ({
    key,
    question: t(`faq.items.${key}.question`),
    answer: t(`faq.items.${key}.answer`, {
      maxSizeMb: MAX_DOCUMENT_SIZE_BYTES / BYTES_IN_MB,
      maxDocuments: MAX_DOCUMENTS_PER_SESSION,
    }),
  }));

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };

  return (
    <LandingSection id="faq" title={t("faq.title")}>
      <dl className={styles.list}>
        {items.map(({ key, question, answer }) => (
          <div key={key} className={styles.item}>
            <dt>
              <Title level={3} className={styles.question}>
                {question}
              </Title>
            </dt>
            <dd className={styles.answer}>
              <Paragraph className={styles.answerText}>{answer}</Paragraph>
            </dd>
          </div>
        ))}
      </dl>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(faqSchema) }}
      />
    </LandingSection>
  );
};
