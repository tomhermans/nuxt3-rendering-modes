/**
 * A function to handle API calls and fetch data from the WordPress REST API
 * @returns {Object} An object with various functions to fetch data from WordPress REST API
 */
export default function useWordpressApi() {
  const config = useRuntimeConfig(); // capture config inside nuxt.config
  const wpUri = config.public.wpUri;

  const perPage = ref(9);
  const page = ref(1);
  const maxPages = ref(1);
  const items = ref([]);
  const displayedItems = ref([]);
  /**
   * Fetches data from the API based on the provided endpoint
   * @param {string} endpoint - The API endpoint to fetch data from
   * @returns {Promise<Object>} - The data fetched from the API
   */
  const get = async (endpoint, group = "wp/v2", options = {}) => {
    const url = `${wpUri}/wp-json/${group}/${endpoint}`;
    options = { watch: false, fetch: false, ...options };

    console.log("Fetching URL:", url, options);
    if (options.fetch) {
      return await $fetch(url, options);
    }

    return await useFetch(url, options);
  };

  const transformParamsToQueryString = (params) => {
    return Object.keys(params)
      .map((key) => {
        if (Array.isArray(params[key])) {
          return params[key]
            .map((value) => `${key}[]=${encodeURIComponent(value)}`)
            .join("&");
        } else {
          return `${key}=${encodeURIComponent(params[key])}`;
        }
      })
      .join("&");
  };

  const getBlog = async (params = {}, options = {}) => {
    params = {
      page: 1,
      per_page: 9,
      ...params,
    };

    const query = `posts?_embed&${transformParamsToQueryString(params)}`;
    return get(query, "wp/v2", options);
  };

  // const getBlogPost = async (params = {}, options = {}) => {};

  /**
   * Fetches a single category by slug
   * @param {string} slug - The slug of the category
   * @returns {Promise<Object>} - The fetched category
   */
  const getCategory = async (slug) => {
    return get(`categories?slug=${slug}`);
  };

  /**
   * Fetches all categories
   * @returns {Promise<Object>} - The fetched categories
   */
  const getCategories = async () => {
    return get("categories");
  };

  /**
   * Fetches all industries
   * @param {number} page - The page number to fetch
   * @param {number} perPage - The number of industries per page
   * @returns {Promise<Object>} - The fetched industries
   */
  const getIndustries = async (/* page = 1, perPage = 10 */) => {
    const query = `cbtw_industry?_embed`;
    return get(query);
  };

  /**
   * Fetches a single industry by slug
   * @param {string} slug - The slug of the industry
   * @returns {Promise<Object>} - The fetched industry
   */
  const getIndustry = async (slug) => {
    const query = `cbtw_industry?slug=${slug}&_embed`;
    return get(query);
  };

  /**
   * Fetch menu
   * @param {string} slug - Menu slug
   * @returns {Promise<Object>} - The fetched menu
   */
  const getMenu = async (slug = "primary-navigation") => {
    const query = `menu/${slug}`;
    return get(query);
  };

  const getPage = async (slug) => {
    const query = `pages/${slug}`;
    return get(query);
  };

  /**
   * Fetches a single blog post by slug
   * @param {string} slug - The slug of the blog post
   * @returns {Promise<Object>} - The fetched blog post
   */
  const getPost = async (slug) => {
    const query = `posts?slug=${slug}&_embed`;
    return get(query);
  };

  /**
   * Fetches a single blog post by ID
   * @param {number} id - The ID of the blog post
   * @returns {Promise<Object>} - The fetched blog post
   */
  // const getPostById = async (id) => {
  //   console.log('id requested :', id);
  //   const query = `posts/${id}`;
  //   console.log('query requested :', query);
    
  //   myPostById = await get(query);
  //   console.log(id, "fetched", myPostById);
  //   return myPostById;
  // };

  const getPostById = async (id) => {
    console.log("id requested :", id);
    const query = `posts/${id}`;
    console.log("query requested :", query);

    // Use a reactive ref to store the fetched post data
    const post = ref(null);

    try {
      post.value = await get(query);
      console.log(id, "fetched", post.value);
      return post.value; // Return the actual fetched data
    } catch (error) {
      console.error("Error fetching post by ID:", error);
      // Handle errors appropriately, e.g., display an error message to the user
    }

    return post; // Return the reactive ref
  };


  /**
   * Fetches all blog posts
   * @param {number} page - The page number to fetch
   * @param {number} perPage - The number of posts per page
   * @returns {Promise<Object>} - The fetched blog posts
   */
  const getPosts = async (page = 1, perPage = 9, options = {}) => {
    const query = `posts?_embed&per_page=${perPage}&page=${page}`;
    return get(query, "wp/v2", options);
  };

  /**
   * Fetches blog posts by category
   * @param {number} page - The page number to fetch
   * @param {number} perPage - The number of blog posts per page
   * @param {string} cat - The category of the blog post
   * @returns {Promise<Object>} - The fetched blog posts
   */
  const getPostsByCat = async (page = 1, perPage = 10, cat) => {
    const categories = `&categories=${cat}`;
    const query = `posts?_embed${categories}&per_page=${perPage}&page=${page}`;
    return get(query);
  };

  /**
   * Fetches related posts by postId
   * @param {number} id - The postId of the related posts
   * @returns {Promise<Object>} - The fetched related posts
   */
  const getRelatedPosts = async (id) => {
    const query = `posts/${id}?posts_per_page=3`;
    return get(query, "related-posts-by-taxonomy/v1");
  };

  /**
   * Fetches a single service by slug
   * @param {string} slug - The slug of the service
   * @returns {Promise<Object>} - The fetched service
   */
  const getService = async (slug) => {
    const query = `cbtw_service?slug=${slug}&_embed`;
    return get(query);
  };

  /**
   * Fetches all services
   * @param {number} page - The page number to fetch
   * @param {number} perPage - The number of services per page
   * @returns {Promise<Object>} - The fetched services
   */
  const getServices = async (/* page = 1, perPage = 10 */) => {
    const query = `cbtw_service?_embed`;
    return get(query);
  };

  const getTaxonomyTerms = async (
    taxonomy = "category",
    params = {},
    options = {}
  ) => {
    params = {
      hide_empty: true,
      per_page: 100,
      ...params,
    };
    const query = `${taxonomy}?${transformParamsToQueryString(params)}`;
    return get(query, "wp/v2", options);
  };

  const getWork = async (slug, params = {}) => {
    params = {
      _fields:
        "id,title,content,slug,link,excerpt,categories,featured_image,services,industries,header,layout_builder,yoast_head_json",
      slug,
      ...params,
    };
    const query = `posts?${transformParamsToQueryString(params)}`;
    return get(query);
  };

  const getWorks = async (params = {}) => {
    params = {
      categories: 127,
      _fields:
        "id,title,slug,link,excerpt,categories,featured_image,services,industries",
      ...params,
    };
    const query = `posts?${transformParamsToQueryString(params)}`;
    return get(query);
  };

  return {
    get,
    getBlog,
    // getBlogPost,
    getCategories,
    getCategory,
    getIndustries,
    getIndustry,
    getMenu,
    getPage,
    getPost,
    getPostById,
    getPosts,
    getPostsByCat,
    getRelatedPosts,
    getService,
    getServices,
    getTaxonomyTerms,
    getWork,
    getWorks,
  };
}
