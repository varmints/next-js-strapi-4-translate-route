import client from "../lib/apollo-client";
import { gql } from "@apollo/client";

export const getGlobalData = async (locale) => {
  const { data } = await client.query({
    query: gql`
      query GetGlobal($locale: I18NLocaleCode) {
        global(locale: $locale) {
          data {
            attributes {
              locale
              Navbar {
                Links {
                  id
                  Name
                  Url
                  NewTab
                }
              }
            }
          }
        }
      }
    `,
    variables: {
      locale,
    },
  });

  return data.global;
};
