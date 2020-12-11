import fetch from "node-fetch";

const CategoriesClient = () => {
  const categoriesClient = {};

  const baseUrl = process.env.WDN_API_HOST;

  categoriesClient.find = async () => {
    return fetch(`${baseUrl}/categories`)
      .then((res) => res.json())
      .then(({ data }) => data);
  };

  categoriesClient.getProducts = ({ id, page, pageSize }) => {
    return fetch(
      `${baseUrl}/categories/${id}/products?page=${page}&page_size=${pageSize}`
    )
      .then((res) => res.json())
      .then(({ data }) => data);
  };

  return categoriesClient;
};

export default CategoriesClient;
