import { gql } from "@apollo/client";
import Layout from "../components/layout";
import client from "../lib/apollo-client";
import { getGlobalData } from "../utils/api-helpers";
import { getLocalizedPaths } from "../utils/localize-helpers";
import ReactMarkdown from "react-markdown";

const DynamicPage = ({ global, pageContext, title, body }) => {
  return (
    <Layout global={global} pageContext={pageContext}>
      <div className="content">
        <h1>{title}</h1>
        <ReactMarkdown>{body}</ReactMarkdown>
      </div>
    </Layout>
  );
};

export default DynamicPage;

export async function getStaticPaths({ locales }) {
  // array of locales provided in context object in getStaticPaths
  const paths = (
    await Promise.all(
      locales.map(async (locale) => {
        // map through locales
        const { data } = await client.query({
          query: gql`
            query GetAllPages($locale: I18NLocaleCode) {
              pages(locale: $locale) {
                data {
                  attributes {
                    slug
                    locale
                  }
                }
              }
            }
          `, // fetch list of pages per locale
          variables: { locale },
        });
        return {
          pages: data.pages.data,
          locale,
        };
      })
    )
  ).reduce((acc, item) => {
    item.pages.map((p) => {
      // reduce through the array of returned objects
      acc.push({
        params: {
          slug:
            p.attributes.slug === "/" ? false : p.attributes.slug.split("/"),
        },
        locale: p.attributes.locale,
      });
      return p;
    });
    return acc;
  }, []);

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({
  locale,
  locales,
  defaultLocale,
  params,
}) {
  const { data } = await client.query({
    query: gql`
      query GetPageBySlug($slug: String, $locale: I18NLocaleCode) {
        pages(locale: $locale, filters: { slug: { eq: $slug } }) {
          data {
            attributes {
              title
              body
              slug
              locale
              localizations {
                data {
                  id
                  attributes {
                    slug
                    locale
                  }
                }
              }
            }
          }
        }
      }
    `,
    variables: {
      slug: params.slug ? params.slug[0] : "/",
      locale,
    },
  });

  const page = data.pages.data[0].attributes;
  const { title, body } = page;

  console.log("slug", params.slug);
  const pageContext = {
    locale: page.locale,
    localizations: page.localizations,
    locales,
    defaultLocale,
    slug: params.slug ? params.slug[0] : "",
  };

  const localizedPaths = getLocalizedPaths(pageContext);
  const globalData = await getGlobalData(locale);

  return {
    props: {
      global: globalData,
      title,
      body,
      pageContext: {
        ...pageContext,
        localizedPaths,
      },
    },
  };
}
